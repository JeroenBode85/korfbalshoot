export type LogoClub = { id: string; name: string; logo_url?: string | null };

export function clubLogoUrl(club: Pick<LogoClub, 'id' | 'logo_url'>): string | undefined {
  if (club.logo_url) {
    try {
      const url = new URL(club.logo_url);
      if (url.protocol === 'https:') return url.href;
    } catch { /* Use the club code when the supplied URL is invalid. */ }
  }
  if (!/^knkv-[A-Za-z0-9]+$/.test(club.id)) return undefined;
  return `https://logo-api.sportlinkpress.nl/korfbal/${club.id.slice(5)}.png`;
}

export function findPlayerClub(name: string | null, clubs: LogoClub[]): LogoClub | undefined {
  if (!name || name === 'Geen vereniging') return undefined;
  const matches = clubs.filter(club => club.name === name);
  return matches.length === 1 ? matches[0] : undefined;
}