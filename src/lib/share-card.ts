export type ShareData = { title: string; subtitle: string; score?: number; position?: number; fetchedAt: string; url: string; leaders?: string[]; detail?: string };

export async function downloadShareCard(data: ShareData, story: boolean) {
  await document.fonts.ready;
  const canvas = document.createElement('canvas');
  canvas.width = 1080; canvas.height = story ? 1920 : 1080;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Afbeelding niet beschikbaar');
  const styles = getComputedStyle(document.documentElement);
  const color = (token: string) => styles.getPropertyValue(token).trim();
  ctx.fillStyle = color('--background'); ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = color('--secondary'); ctx.beginPath(); ctx.roundRect(54, 54, 972, canvas.height - 108, 48); ctx.fill();
  ctx.textAlign = 'center';
  ctx.fillStyle = color('--foreground'); ctx.font = '900 70px "Barlow", sans-serif'; ctx.fillText('KORFBAL SHOOT!', 540, 174);
  ctx.fillStyle = color('--gold'); { let s = 30; ctx.font = `700 ${s}px "Barlow", sans-serif`; while (ctx.measureText(data.subtitle.toUpperCase()).width > 880 && s > 14) { s -= 1; ctx.font = `700 ${s}px "Barlow", sans-serif`; } ctx.fillText(data.subtitle.toUpperCase(), 540, 238); }
  const center = story ? 750 : 480;
  ctx.font = '900 160px "Barlow", sans-serif'; ctx.fillText(data.position ? `#${data.position}` : 'TOP 3', 540, center);
  ctx.fillStyle = color('--foreground');
  let size = 64; ctx.font = `800 ${size}px "Barlow", sans-serif`;
  while (ctx.measureText(data.title).width > 880 && size > 12) { size -= 2; ctx.font = `800 ${size}px "Barlow", sans-serif`; }
  ctx.fillText(data.title, 540, center + 100);
  ctx.fillStyle = color('--gold'); ctx.font = '800 64px "Barlow", sans-serif';
  if (data.score !== undefined) ctx.fillText(`${data.score.toLocaleString('nl-NL')} punten`, 540, center + 205);
  if (data.leaders) data.leaders.forEach((leader, i) => { let s = 32; ctx.font = `600 ${s}px "Barlow", sans-serif`; while (ctx.measureText(leader).width > 880 && s > 14) { s -= 1; ctx.font = `600 ${s}px "Barlow", sans-serif`; } ctx.fillText(leader, 540, center + 170 + i * 52); });
  if (data.detail) { ctx.fillStyle = color('--foreground'); let s = 36; ctx.font = `600 ${s}px "Barlow", sans-serif`; while (ctx.measureText(data.detail).width > 880 && s > 14) { s -= 1; ctx.font = `600 ${s}px "Barlow", sans-serif`; } ctx.fillText(data.detail, 540, center + 280); }
  ctx.fillStyle = color('--foreground'); ctx.font = '700 34px "Barlow", sans-serif'; ctx.fillText(data.detail ? 'Raak de korf. Breek je record.' : 'Speel jouw vereniging naar de top.', 540, canvas.height - 200);
  ctx.fillStyle = color('--muted-foreground'); ctx.font = '400 23px "Barlow", sans-serif';
  const date = new Intl.DateTimeFormat('nl-NL', { timeZone: 'Europe/Amsterdam', dateStyle: 'medium', timeStyle: 'short' }).format(new Date(data.fetchedAt));
  ctx.fillText(`Momentopname · ${date}`, 540, canvas.height - 130);
  const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('Afbeelding niet beschikbaar');
  const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `korfbal-shoot-${story ? 'story' : 'vierkant'}.png`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}