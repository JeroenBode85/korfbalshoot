import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { GameLayout } from '@/components/game-layout';
import { Leaderboard } from '@/components/leaderboard';
import { rankingLabels } from '@/lib/game-config';
import { clubsQuery, formatWeek, playersQuery, weeksQuery } from '@/lib/standings';
import { pageHead } from '@/lib/page-head';

const searchSchema = z.object({
  type: z.enum(['overall', 'week', 'verenigingen']).catch('overall').default('overall'),
  week: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().catch(undefined),
});

export const Route = createFileRoute('/klassementen')({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ type: search.type, week: search.type === 'week' ? search.week : undefined }),
  loader: async ({ deps, context }) => {
    if (deps.type === 'verenigingen') await context.queryClient.ensureQueryData(clubsQuery);
    else {
      await context.queryClient.ensureQueryData(playersQuery(deps.type === 'week' ? 'week' : 'world', deps.week));
      if (deps.type === 'week') await context.queryClient.ensureQueryData(weeksQuery);
    }
    return deps;
  },
  head: ({ loaderData }) => {
    const label = loaderData ? (loaderData.type === 'week' && loaderData.week ? `Week ${formatWeek(loaderData.week)}` : rankingLabels[loaderData.type]) : 'Klassementen';
    return pageHead(`${label} · Klassementen · Korfbal Shoot!`, loaderData?.type === 'verenigingen' ? 'Welke vereniging staat bovenaan? Bekijk de openbare verenigingsstanden van Korfbal Shoot!' : 'De beste scores van alle online spelers van Korfbal Shoot! Bekijk het overall- en weekklassement.');
  },
  component: RankingPage,
});

function RankingPage() {
  const { type, week } = Route.useLoaderData();
  return <GameLayout active="rankings"><Leaderboard mode={type} week={week} full/></GameLayout>;
}
