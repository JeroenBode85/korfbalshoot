import { createFileRoute, notFound } from '@tanstack/react-router';
import { GameLayout } from '@/components/game-layout';
import { Leaderboard } from '@/components/leaderboard';
import { rankingLabels, type RankingMode } from '@/lib/game-config';
import { clubsQuery } from '@/lib/standings';
import { pageHead } from '@/lib/page-head';

function validMode(mode: string): mode is RankingMode { return mode === 'overall' || mode === 'week' || mode === 'verenigingen'; }
export const Route = createFileRoute('/klassementen/$mode')({
  loader: async ({ params, context }) => { if (!validMode(params.mode)) throw notFound(); const initialResult = await context.queryClient.ensureQueryData(clubsQuery); return { mode: params.mode, initialResult }; },
  head: ({ loaderData }) => pageHead(`${loaderData ? rankingLabels[loaderData.mode] : 'Klassementen'} · Korfbal Shoot!`, 'Bekijk de openbare klassementen van Korfbal Shoot! Speel jouw vereniging naar de top.'),
  component: RankingPage,
});
function RankingPage() { const { mode, initialResult } = Route.useLoaderData(); return <GameLayout active="rankings"><Leaderboard mode={mode} full initialResult={initialResult}/></GameLayout>; }