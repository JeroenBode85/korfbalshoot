export const gameConfig = {
  name: 'Korfbal Shoot!',
  playUrl: 'https://play.google.com/store/apps/details?id=nl.jbd.korfbalshoot',
  comingSoon: false,
  standingsApi: 'https://azxvmwndvfdexnlootes.supabase.co/functions/v1/public-standings',
  clubApi: 'https://azxvmwndvfdexnlootes.supabase.co/functions/v1/club-standings',
};
export type RankingMode = 'overall' | 'week' | 'verenigingen';
export const rankingLabels: Record<RankingMode, string> = { overall: 'Overall', week: 'Deze week', verenigingen: 'Verenigingen' };
