import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { clubLogoUrl, findPlayerClub } from '@/lib/club-logo';
import { ClubEmblem } from '@/components/club-emblem';

afterEach(cleanup);
const hemur = { id: 'knkv-NCX23X8', name: 'Hemur Enge' };
describe('Club logos', () => {
  it('removes only the knkv prefix for Hemur Enge', () => {
    expect(clubLogoUrl(hemur)).toBe('https://logo-api.sportlinkpress.nl/korfbal/NCX23X8.png');
    expect(clubLogoUrl({ id: 'NCX23X8' })).toBeUndefined();
  });
  it('prefers a supplied logo_url', () => {
    expect(clubLogoUrl({ ...hemur, logo_url: 'https://example.org/logo.png' })).toBe('https://example.org/logo.png');
  });
  it('only matches a unique exact club name, not a player or guessed name', () => {
    expect(findPlayerClub('Hemur Enge', [hemur])).toBe(hemur);
    expect(findPlayerClub('JBD', [hemur])).toBeUndefined();
    expect(findPlayerClub('hemur enge', [hemur])).toBeUndefined();
    expect(findPlayerClub('Hemur Enge', [hemur, { ...hemur, id: 'knkv-OTHER' }])).toBeUndefined();
  });
  it('does not give a logo to no-club players', () => {
    expect(findPlayerClub(null, [hemur])).toBeUndefined();
    expect(findPlayerClub('Geen vereniging', [hemur])).toBeUndefined();
  });
  it('keeps initials during loading and after failure without retrying on remount', () => {
    const url = 'https://example.org/missing-logo-test.png';
    const { unmount } = render(<ClubEmblem name="Hemur Enge" logoUrl={url}/>);
    expect(screen.getByText('HE')).toBeVisible();
    fireEvent.error(screen.getByAltText('Logo van Hemur Enge'));
    expect(screen.getByText('HE')).toBeVisible();
    expect(screen.queryByRole('img')).toBeNull();
    unmount();
    render(<ClubEmblem name="Hemur Enge" logoUrl={url}/>);
    expect(screen.queryByRole('img')).toBeNull();
  });
});