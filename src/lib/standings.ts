import { queryOptions } from '@tanstack/react-query';
import { z } from 'zod';
import { gameConfig } from './game-config';

const clubSchema = z.object({ id: z.string(), name: z.string(), city: z.string(), score: z.number().nonnegative(), position: z.number().nonnegative(), participants: z.number().nonnegative() });
const playerSchema = z.object({ position: z.number().nonnegative(), player_name: z.string(), club: z.string().nullable().optional(), score: z.number().nonnegative() });
const pageSchema = <T extends z.ZodTypeAny>(row: T) => z.object({ rows: z.array(row), total: z.number().nullable().optional(), week: z.string().nullable().optional(), week_end: z.string().nullable().optional(), updated_at: z.string().optional() });
const weeksSchema = z.object({ rows: z.array(z.object({ week: z.string() })) });

export type Club = z.infer<typeof clubSchema>;
export type Player = { position: number; name: string; club: string | null; score: number };
export type ClubResult = { clubs: Club[]; fetchedAt: string; error: boolean };
export type PlayerResult = { players: Player[]; week: string | null; weekEnd: string | null; fetchedAt: string; error: boolean };

const PAGE = 100;
const MAX_OFFSET = 10000;
const TTL = 60000;
const cache = new Map<string, { value: unknown; expires: number }>();
const pending = new Map<string, Promise<unknown>>();

// Short-lived in-memory cache only (max 60s); nothing is stored permanently.
function cached<T>(key: string, load: () => Promise<T>, ok: (value: T) => boolean): Promise<T> {
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return Promise.resolve(hit.value as T);
  const running = pending.get(key);
  if (running) return running as Promise<T>;
  const promise = load().then(value => { if (ok(value)) cache.set(key, { value, expires: Date.now() + TTL }); return value; }).finally(() => pending.delete(key));
  pending.set(key, promise);
  return promise;
}

async function getJson(url: string) {
  const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function fetchAll<T extends z.ZodTypeAny>(base: string, row: T) {
  const rows: z.infer<T>[] = [];
  let meta: z.infer<ReturnType<typeof pageSchema<T>>> | undefined;
  for (let offset = 0; offset <= MAX_OFFSET; offset += PAGE) {
    const page = pageSchema(row).parse(await getJson(`${base}${base.includes('?') ? '&' : '?'}offset=${offset}`));
    meta ??= page;
    rows.push(...page.rows);
    const total = page.total ?? undefined;
    if (page.rows.length < PAGE || (total !== undefined && rows.length >= total)) break;
  }
  return { rows, meta };
}

export function getClubs(): Promise<ClubResult> {
  return cached('clubs', async () => {
    try {
      const { rows } = await fetchAll(`${gameConfig.standingsApi}?kind=clubs`, clubSchema);
      return { clubs: rows, fetchedAt: new Date().toISOString(), error: false };
    } catch {
      try {
        const { rows } = await fetchAll(gameConfig.clubApi, clubSchema);
        return { clubs: rows, fetchedAt: new Date().toISOString(), error: false };
      } catch { return { clubs: [], fetchedAt: '', error: true }; }
    }
  }, value => !value.error);
}

export function getPlayers(kind: 'world' | 'week', week?: string): Promise<PlayerResult> {
  const query = `kind=${kind}${kind === 'week' && week ? `&week=${encodeURIComponent(week)}` : ''}`;
  return cached(query, async () => {
    try {
      const { rows, meta } = await fetchAll(`${gameConfig.standingsApi}?${query}`, playerSchema);
      return { players: rows.map(row => ({ position: row.position, name: row.player_name, club: row.club ?? null, score: row.score })), week: meta?.week ?? null, weekEnd: meta?.week_end ?? null, fetchedAt: new Date().toISOString(), error: false };
    } catch { return { players: [], week: null, weekEnd: null, fetchedAt: '', error: true }; }
  }, value => !value.error);
}

export function getWeeks(): Promise<{ weeks: string[]; error: boolean }> {
  return cached('weeks', async () => {
    try { return { weeks: weeksSchema.parse(await getJson(`${gameConfig.standingsApi}?kind=weeks`)).rows.map(row => row.week), error: false }; }
    catch { return { weeks: [], error: true }; }
  }, value => !value.error);
}

const live = { staleTime: TTL, gcTime: 5 * TTL, refetchOnWindowFocus: true } as const;
export const clubsQuery = queryOptions({ queryKey: ['public-clubs'], queryFn: getClubs, ...live });
export const playersQuery = (kind: 'world' | 'week', week?: string) => queryOptions({ queryKey: ['public-players', kind, week ?? 'current'], queryFn: () => getPlayers(kind, week), ...live });
export const weeksQuery = queryOptions({ queryKey: ['public-weeks'], queryFn: getWeeks, ...live });

export function initials(name: string) { return name.replace(/[^\p{L}\p{N} ]/gu, '').split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]).join('').toUpperCase() || '?'; }
export function formatTime(value: string) { return value ? new Intl.DateTimeFormat('nl-NL', { timeZone: 'Europe/Amsterdam', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(value)) : '—'; }
const dayFormat = new Intl.DateTimeFormat('nl-NL', { timeZone: 'Europe/Amsterdam', day: 'numeric', month: 'short' });
// week is the Monday (YYYY-MM-DD, Amsterdam); display Monday–Sunday.
export function formatWeek(week: string) {
  const [y = 1970, m = 1, d = 1] = week.split('-').map(Number);
  const start = new Date(Date.UTC(y, m - 1, d, 12));
  const end = new Date(Date.UTC(y, m - 1, d + 6, 12));
  return `${dayFormat.format(start)} – ${dayFormat.format(end)} ${y}`;
}
