import { queryOptions } from '@tanstack/react-query';
import { z } from 'zod';
import { gameConfig } from './game-config';

const clubSchema = z.object({ id: z.string(), name: z.string(), city: z.string(), score: z.number().nonnegative(), position: z.number().nonnegative(), participants: z.number().nonnegative() });
const responseSchema = z.object({ rows: z.array(clubSchema), offset: z.number(), version: z.number() });
export type Club = z.infer<typeof clubSchema>;
export type ClubResult = { clubs: Club[]; fetchedAt: string; error: boolean };
let cached: ClubResult | undefined;
let expires = 0;
let pending: Promise<ClubResult> | undefined;

export async function getClubs(): Promise<ClubResult> {
  if (cached && expires > Date.now()) return cached;
  if (pending) return pending;
  pending = (async () => {
    try {
      const clubs: Club[] = [];
      for (let offset = 0; offset < 600; offset += 100) {
        const response = await fetch(`${gameConfig.clubApi}?offset=${offset}`, { signal: AbortSignal.timeout(10000) });
        if (!response.ok) throw new Error('Standen niet bereikbaar');
        const page = responseSchema.parse(await response.json());
        clubs.push(...page.rows);
        if (page.rows.length < 100) break;
      }
      cached = { clubs, fetchedAt: new Date().toISOString(), error: false };
      expires = Date.now() + 60000;
      return cached;
    } catch {
      return { clubs: [], fetchedAt: '', error: true };
    } finally { pending = undefined; }
  })();
  return pending;
}
export const clubsQuery = queryOptions({ queryKey: ['public-clubs'], queryFn: getClubs, staleTime: 60000 });
export function initials(name: string) { return name.replace(/[^\p{L}\p{N} ]/gu, '').split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]).join('').toUpperCase(); }
export function formatTime(value: string) { return value ? new Intl.DateTimeFormat('nl-NL', { timeZone: 'Europe/Amsterdam', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(value)) : '—'; }