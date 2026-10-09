import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowLeft, MapPin, RefreshCw, Share2, UserRound } from 'lucide-react';
import { GameLayout, PlayButton } from '@/components/game-layout';
import { ClubEmblem } from '@/components/leaderboard';
import { ShareDialog } from '@/components/share-dialog';
import { Button } from '@/components/ui/button';
import { clubsQuery, formatTime } from '@/lib/standings';
import { pageHead } from '@/lib/page-head';
import type { ShareData } from '@/lib/share-card';

export const Route = createFileRoute('/verenigingen/$clubId')({
  loader: async ({ params, context }) => { const result = await context.queryClient.ensureQueryData(clubsQuery); const club = result.clubs.find(item => item.id === params.clubId); if (!club && !result.error) throw notFound(); return { club, fetchedAt: result.fetchedAt, error: result.error }; },
  head: ({ loaderData }) => pageHead(loaderData?.club ? `${loaderData.club.name} · Korfbal Shoot!` : 'Vereniging · Korfbal Shoot!', loaderData?.club ? `${loaderData.club.name} uit ${loaderData.club.city} staat op plek ${loaderData.club.position} met ${loaderData.club.score} punten. Speel mee voor deze vereniging in Korfbal Shoot!` : 'Bekijk de openbare verenigingsstand in Korfbal Shoot!'),
  component: ClubPage,
});
function ClubPage() {
  const { club, fetchedAt } = Route.useLoaderData();
  const [data, setData] = useState<ShareData | null>(null);
  return <GameLayout active="rankings"><section className="club-page"><div className="container-game"><Link to="/klassementen/$mode" params={{mode:'verenigingen'}} className="back-link"><ArrowLeft className="size-4"/>Terug naar verenigingen</Link>{club ? <><div className="club-page-header"><ClubEmblem name={club.name}/><span className="eyebrow">SAMEN NAAR DE TOP</span><h1>{club.name}</h1><p className="club-location"><MapPin className="size-4"/>{club.city}</p></div><div className="club-stats"><div><strong>#{club.position}</strong><span>Clubpositie</span></div><div><strong>{club.score.toLocaleString('nl-NL')}</strong><span>Clubscore</span></div><div><strong>{club.participants}</strong><span>Deelnemers</span></div></div><p className="text-center text-xs text-muted-foreground">Laatst bijgewerkt: {formatTime(fetchedAt)}</p><div className="club-actions"><PlayButton/><Button variant="gameOutline" onClick={() => setData({ title:club.name, subtitle:'Verenigingen', score:club.score, position:club.position, fetchedAt, url:window.location.href })}><Share2/>Deel deze vereniging</Button></div><div className="club-counting"><h2>De vijf beste persoonlijke records tellen mee.</h2><div className="counting-icons" aria-hidden="true">{[1,2,3,4,5].map(value => <UserRound key={value}/>)}</div><p>Vijf verschillende spelers. Eén gezamenlijke clubscore.<br/>Ook met minder dan vijf spelers doet jouw vereniging mee.</p><p className="mt-5">De namen van meetellende spelers zijn nog niet openbaar beschikbaar.</p></div></> : <div className="empty-state"><RefreshCw/><h1>De clubstand is even niet bereikbaar</h1><p>Probeer deze pagina opnieuw te openen.</p><Button variant="gameOutline" onClick={() => window.location.reload()}><RefreshCw/>Opnieuw proberen</Button></div>}<ShareDialog data={data} onClose={() => setData(null)}/></div></section></GameLayout>;
}