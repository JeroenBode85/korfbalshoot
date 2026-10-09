export type ShareData = { title: string; subtitle: string; score?: number; position?: number; fetchedAt: string; url: string; leaders?: string[] };

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
  ctx.fillStyle = color('--gold'); ctx.font = '700 30px "Barlow", sans-serif'; ctx.fillText(data.subtitle.toUpperCase(), 540, 238);
  const center = story ? 750 : 480;
  ctx.font = '900 160px "Barlow", sans-serif'; ctx.fillText(data.position ? `#${data.position}` : 'TOP 3', 540, center);
  ctx.fillStyle = color('--foreground');
  let size = 64; ctx.font = `800 ${size}px "Barlow", sans-serif`;
  while (ctx.measureText(data.title).width > 860 && size > 22) { size -= 2; ctx.font = `800 ${size}px "Barlow", sans-serif`; }
  ctx.fillText(data.title, 540, center + 100);
  ctx.fillStyle = color('--gold'); ctx.font = '800 64px "Barlow", sans-serif';
  if (data.score !== undefined) ctx.fillText(`${data.score.toLocaleString('nl-NL')} punten`, 540, center + 205);
  if (data.leaders) { ctx.font = '600 32px "Barlow", sans-serif'; data.leaders.forEach((leader, i) => { let text = leader; while (ctx.measureText(text).width > 860) text = text.slice(0, -2); ctx.fillText(text, 540, center + 170 + i * 52); }); }
  ctx.fillStyle = color('--foreground'); ctx.font = '700 34px "Barlow", sans-serif'; ctx.fillText('Speel jouw vereniging naar de top.', 540, canvas.height - 200);
  ctx.fillStyle = color('--muted-foreground'); ctx.font = '400 23px "Barlow", sans-serif';
  const date = new Intl.DateTimeFormat('nl-NL', { timeZone: 'Europe/Amsterdam', dateStyle: 'medium', timeStyle: 'short' }).format(new Date(data.fetchedAt));
  ctx.fillText(`Momentopname · ${date}`, 540, canvas.height - 130);
  const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('Afbeelding niet beschikbaar');
  const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `korfbal-shoot-${story ? 'story' : 'vierkant'}.png`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}