export const gameConfig = {
  name: 'Korfbal Shoot!',
  playUrl: 'https://play.google.com/store/apps/details?id=nl.jbd.korfbalshoot',
  appStoreUrl: 'https://apps.apple.com/us/app/korfbal-shoot/id6831015026',
  comingSoon: false,
  standingsApi: 'https://azxvmwndvfdexnlootes.supabase.co/functions/v1/public-standings',
  clubApi: 'https://azxvmwndvfdexnlootes.supabase.co/functions/v1/club-standings',
};
export type RankingMode = 'overall' | 'week' | 'verenigingen';
export const rankingLabels: Record<RankingMode, string> = { overall: 'Overall', week: 'Deze week', verenigingen: 'Verenigingen' };
