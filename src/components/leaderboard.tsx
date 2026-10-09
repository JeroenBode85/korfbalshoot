import { Link, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, Building2, CalendarDays, Clock, Info, Loader2, RefreshCw, Search, Share2, Trophy, Users } from 'lucide-react';
import { Button } from './ui/button';
import { ShareDialog } from './share-dialog';
import { clubsQuery, formatTime, formatWeek, initials, playersQuery, weeksQuery, type Club, type Player } from '@/lib/standings';
import { rankingLabels, type RankingMode } from '@/lib/game-config';
import type { ShareData } from '@/lib/share-card';

export function ClubEmblem({ name }: { name: string }) { return <span className="club-emblem" aria-hidden="true">{initials(name)}</span>; }

type Entry = { key: string; position: number; name: string; detail: string; meta: string; score: number; clubId?: string };
const plural = (n: number) => `${n} ${n === 1 ? 'speler' : 'spelers'}`;
const fromClub = (c: Club): Entry => ({ key: c.id, position: c.position, name: c.name, detail: c.city, meta: plural(c.participants), score: c.score, clubId: c.id });
const fromPlayer = (p: Player, i: number): Entry => ({ key: `${p.position}-${i}`, position: p.position, name: p.name, detail: p.club ?? 'Geen vereniging', meta: p.club ?? 'Geen vereniging', score: p.score });

function EntryName({ entry }: { entry: Entry }) {
  const body = <><ClubEmblem name={entry.name}/><div className="min-w-0"><h3>{entry.name}</h3><p>{entry.detail}{entry.clubId && <span className="sm:hidden"> · {entry.meta}</span>}</p></div></>;
  return entry.clubId ? <Link to="/verenigingen/$clubId" params={{ clubId: entry.clubId }} className="club-name-cell">{body}</Link> : <div className="club-name-cell">{body}</div>;
}
function Podium({ entries, onShare }: { entries: Entry[]; onShare: (e: Entry) => void }) {
  return <div className="podium" aria-label="Hoogste standen">{entries.map(entry => {
    const inner = <><span className="podium-medal">{entry.position === 1 ? <Trophy className="size-4"/> : entry.position}</span><ClubEmblem name={entry.name}/><h3>{entry.name}</h3><p>{entry.detail}</p><strong className="podium-score">{entry.score.toLocaleString('nl-NL')}</strong><small>punten{entry.clubId ? ` · ${entry.meta}` : ''}</small></>;
    return entry.clubId
      ? <Link to="/verenigingen/$clubId" params={{ clubId: entry.clubId }} className="podium-item" data-rank={Math.min(entry.position, 3)} key={entry.key}>{inner}</Link>
      : <button type="button" className="podium-item" data-rank={Math.min(entry.position, 3)} key={entry.key} onClick={() => onShare(entry)} aria-label={`Deel resultaat van ${entry.name}`}>{inner}</button>;
  })}</div>;
}
function Row({ entry, onShare }: { entry: Entry; onShare: (e: Entry) => void }) {
  return <div className="ranking-row"><span className="rank-number">{entry.position}</span><EntryName entry={entry}/><span className="participants">{entry.clubId ? <Users/> : <Building2/>}{entry.meta}</span><strong className="row-score">{entry.score.toLocaleString('nl-NL')}</strong><Button variant="ghost" size="icon" title={`Deel ${entry.name}`} aria-label={`Deel ${entry.name}`} onClick={() => onShare(entry)}><Share2 className="text-muted-foreground"/></Button></div>;
}

function Countdown({ end }: { end: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { setNow(Date.now()); const t = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(t); }, []);
  if (now === null) return null;
  const left = new Date(end).getTime() - now;
  if (left <= 0) return <span><Clock className="inline size-4"/> Afgesloten week</span>;
  const d = Math.floor(left / 86400000), h = Math.floor(left / 3600000) % 24, m = Math.floor(left / 60000) % 60;
  return <span><Clock className="inline size-4"/> Nog {d > 0 ? `${d}d ` : ''}{h}u {m}m tot de nieuwe week</span>;
}

export function Leaderboard({ mode = 'verenigingen', full = false, week }: { mode?: RankingMode; full?: boolean; week?: string }) {
  const navigate = useNavigate();
  const isClubs = mode === 'verenigingen';
  const clubs = useQuery({ ...clubsQuery, enabled: isClubs });
  const players = useQuery({ ...playersQuery(mode === 'week' ? 'week' : 'world', mode === 'week' ? week : undefined), enabled: !isClubs });
  const weeks = useQuery({ ...weeksQuery, enabled: mode === 'week' });
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(8);
  const [shareData, setShareData] = useState<ShareData | null>(null);
  useEffect(() => { setSearch(''); setLimit(8); }, [mode, week]);

  const active = isClubs ? clubs : players;
  const result = active.data;
  const fetchedAt = result?.fetchedAt ?? '';
  const error = result?.error ?? active.isError;
  const all: Entry[] = isClubs ? (clubs.data?.clubs ?? []).map(fromClub) : (players.data?.players ?? []).map(fromPlayer);
  const term = search.toLocaleLowerCase('nl-NL');
  const entries = term ? all.filter(e => `${e.name} ${e.detail}`.toLocaleLowerCase('nl-NL').includes(term)) : all;
  const podium = term ? [] : entries.slice(0, 3);
  const rows = term ? entries : entries.slice(3);
  const currentWeek = players.data?.week ?? week ?? null;
  const weekEnd = players.data?.weekEnd ?? null;
  const subtitle = mode === 'week' && currentWeek ? `Weekklassement · ${formatWeek(currentWeek)}` : rankingLabels[mode] === 'Overall' ? 'Overall klassement' : 'Verenigingen';
  const pageUrl = () => `${window.location.origin}/klassementen?type=${mode}${mode === 'week' && currentWeek ? `&week=${currentWeek}` : ''}`;
  const shareEntry = (e: Entry) => setShareData({ title: e.name, subtitle, position: e.position, score: e.score, detail: e.clubId ? undefined : e.detail, fetchedAt, url: e.clubId ? `${window.location.origin}/verenigingen/${encodeURIComponent(e.clubId)}` : pageUrl() });
  const loading = active.isPending;
  const noun = isClubs ? 'verenigingen' : 'spelers';

  return <section className="ranking-section" id="klassementen"><div className="container-game">
    <div className="section-heading"><div><span className="eyebrow"><Trophy/>DE STRIJD OM DE TOP</span><h2>{full ? 'De klassementen' : 'Wie raakt de top?'}</h2><p>{isClubs ? 'Elke rake bal telt. Voor jou én je vereniging.' : mode === 'week' ? 'Een nieuwe week. Een nieuwe kans op de eerste plek.' : 'De beste persoonlijke records, op één plek.'}</p></div>
      <Button variant="gameOutline" className="section-share" disabled={error || all.length === 0} onClick={() => setShareData({ title: isClubs ? 'De top van de verenigingen' : mode === 'week' ? 'De top van deze week' : 'De overall top', subtitle, fetchedAt, leaders: all.slice(0, 3).map(e => `#${e.position} ${e.name} · ${e.score.toLocaleString('nl-NL')} punten`), url: pageUrl() })}><Share2/><span>Deel de top 3</span></Button></div>
    <div className="ranking-controls"><nav className="ranking-tabs" aria-label="Kies klassement">{(['overall', 'week', 'verenigingen'] as const).map(value => <Button key={value} variant="tab" data-active={mode === value} asChild><Link to="/klassementen" search={{ type: value }} aria-current={mode === value ? 'page' : undefined}>{value === 'overall' ? <Trophy/> : value === 'week' ? <CalendarDays/> : <Building2/>}{rankingLabels[value]}</Link></Button>)}</nav>
      <label className="search-control"><Search/><input aria-label="Zoek in geladen resultaten" placeholder="Zoek in geladen resultaten…" value={search} maxLength={100} disabled={loading || error} onChange={event => { setSearch(event.target.value); setLimit(8); }}/></label></div>
    {mode === 'week' && <div className="week-bar"><label><CalendarDays className="size-4"/><span className="sr-only">Kies een week</span><select value={currentWeek ?? ''} onChange={event => navigate({ to: '/klassementen', search: { type: 'week', week: event.target.value || undefined } })}>{currentWeek && !(weeks.data?.weeks ?? []).includes(currentWeek) && <option value={currentWeek}>{formatWeek(currentWeek)}</option>}{(weeks.data?.weeks ?? []).map(w => <option key={w} value={w}>{formatWeek(w)}</option>)}</select></label>{weekEnd && <Countdown end={weekEnd}/>}</div>}
    <div className="ranking-meta"><span className="live-label">{active.isFetching ? 'Standen ophalen…' : isClubs ? 'Openbare verenigingsstanden' : 'Online spelers'}</span><span>Laatst bijgewerkt: {formatTime(fetchedAt)}</span></div>
    {loading ? <div className="empty-state" role="status"><Loader2 className="animate-spin"/><h3>Standen laden…</h3></div>
      : error ? <div className="empty-state"><RefreshCw/><h3>De standen zijn even niet bereikbaar</h3><p>Probeer het nog eens. Je scores in de game blijven behouden.</p><Button variant="gameOutline" disabled={active.isFetching} onClick={() => { void active.refetch(); }}><RefreshCw/>Opnieuw proberen</Button></div>
      : entries.length === 0 ? <div className="empty-state"><Search/><h3>{term ? 'Niets gevonden' : mode === 'week' ? 'Nog geen scores deze week' : 'Nog geen scores'}</h3><p>{term ? 'Probeer een andere naam of plaats in de geladen resultaten.' : 'Speel een potje en zet als eerste een score neer!'}</p>{term && <Button variant="gameOutline" onClick={() => setSearch('')}>Zoeken wissen</Button>}</div>
      : <><Podium entries={podium} onShare={shareEntry}/><div className="ranking-table-head"><span>Pos.</span><span>{isClubs ? 'Vereniging' : 'Speler'}</span><span className="participants-label">{isClubs ? 'Deelnemers' : 'Vereniging'}</span><span className="text-right">Score</span><span className="sr-only">Delen</span></div>{rows.slice(0, limit).map(e => <Row key={e.key} entry={e} onShare={shareEntry}/>)}
        <div className="list-footer"><small>{Math.min(entries.length, limit + podium.length)} van {entries.length} {noun}</small>{rows.length > limit && <Button variant="gameOutline" onClick={() => setLimit(value => value + 20)}><ArrowDown/>Meer {noun}</Button>}{!full && <Button variant="link" asChild><Link to="/klassementen" search={{ type: mode }}>Bekijk alle klassementen <ArrowRight/></Link></Button>}</div></>}
    <p className="ranking-rule"><Info/>{isClubs ? 'De vijf beste persoonlijke records van verschillende spelers tellen mee. Ook kleine clubs doen mee.' : 'De beste scores van alle online spelers. Gastspelers doen niet mee aan de online klassementen.'}</p>
    <ShareDialog data={shareData} onClose={() => setShareData(null)}/></div></section>;
}
