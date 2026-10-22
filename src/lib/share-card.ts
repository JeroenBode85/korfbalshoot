import { initials } from './standings';

export type ShareEntry = { position: number; name: string; detail?: string | undefined; score: number; meta?: string | undefined; emblemName?: string | undefined; logoUrl?: string | undefined };
export type ShareData = { title: string; subtitle: string; score?: number; position?: number; fetchedAt: string; url: string; detail?: string; entries: ShareEntry[] };

function loadImage(url: string | undefined): Promise<HTMLImageElement | null> {
  if (!url) return Promise.resolve(null);
  return new Promise(resolve => {
    const img = new Image(); img.crossOrigin = 'anonymous';
    const timer = setTimeout(() => resolve(null), 5000);
    img.onload = () => { clearTimeout(timer); resolve(img.naturalWidth > 0 ? img : null); };
    img.onerror = () => { clearTimeout(timer); resolve(null); };
    img.src = url;
  });
}

export async function downloadShareCard(data: ShareData, story: boolean) {
  await document.fonts.ready;
  const canvas = document.createElement('canvas');
  canvas.width = 1080; canvas.height = story ? 1920 : 1080;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Afbeelding niet beschikbaar');
  const styles = getComputedStyle(document.documentElement);
  const color = (token: string) => styles.getPropertyValue(token).trim();
  const fit = (text: string, weight: number, start: number, max: number) => { let s = start; ctx.font = `${weight} ${s}px "Barlow", sans-serif`; while (ctx.measureText(text).width > max && s > 12) { s -= 1; ctx.font = `${weight} ${s}px "Barlow", sans-serif`; } };
  const logos = await Promise.all(data.entries.map(e => loadImage(e.logoUrl)));

  ctx.fillStyle = color('--background'); ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = color('--foreground'); ctx.font = '900 64px "Barlow", sans-serif'; ctx.fillText('KORFBAL SHOOT!', 540, story ? 260 : 130);
  ctx.fillStyle = color('--gold'); fit(data.subtitle.toUpperCase(), 700, 28, 900); ctx.fillText(data.subtitle.toUpperCase(), 540, story ? 320 : 186);
  ctx.fillStyle = color('--foreground'); fit(data.title, 800, 52, 920); ctx.fillText(data.title, 540, story ? 420 : 262);

  const single = data.entries.length === 1;
  const k = single ? 1.25 : 0.95;
  const w = single ? 560 : 300, gap = 24, h = 540 * k;
  const order = data.entries.length === 3 ? [1, 0, 2] : data.entries.map((_, i) => i);
  const total = order.length * w + (order.length - 1) * gap;
  const baseTop = story ? (single ? 620 : 760) : (single ? 340 : 400);
  order.forEach((index, slot) => {
    const e = data.entries[index]; if (!e) return;
    const x = 540 - total / 2 + slot * (w + gap), cx = x + w / 2;
    const first = e.position === 1;
    const t = baseTop - (first && !single ? 40 : 0);
    ctx.fillStyle = first ? color('--muted') : color('--secondary');
    ctx.beginPath(); ctx.roundRect(x, t, w, h, 28); ctx.fill();
    ctx.lineWidth = first ? 3 : 2; ctx.strokeStyle = first ? color('--gold') : color('--border'); ctx.stroke();
    const medal = e.position === 1 ? color('--gold') : e.position === 2 ? color('--silver') : e.position === 3 ? color('--bronze') : color('--muted');
    ctx.fillStyle = medal; ctx.beginPath(); ctx.arc(cx, t, 42 * k, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = color('--primary-foreground'); ctx.font = `900 ${44 * k}px "Barlow", sans-serif`; ctx.textBaseline = 'middle'; ctx.fillText(String(e.position), cx, t + 2); ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = first ? color('--gold') : color('--muted-foreground'); ctx.font = `800 ${24 * k}px "Barlow", sans-serif`; ctx.fillText(`${e.position}E PLAATS`, cx, t + 90 * k);
    const ly = t + 180 * k, r = 62 * k, logo = logos[index];
    ctx.save(); ctx.beginPath(); ctx.arc(cx, ly, r, 0, Math.PI * 2); ctx.fillStyle = color('--background'); ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = color('--border'); ctx.stroke(); ctx.clip();
    if (logo) { const s = Math.min((r * 1.6) / logo.naturalWidth, (r * 1.6) / logo.naturalHeight); const lw = logo.naturalWidth * s, lh = logo.naturalHeight * s; ctx.drawImage(logo, cx - lw / 2, ly - lh / 2, lw, lh); }
    else { ctx.fillStyle = color('--foreground'); ctx.font = `800 ${40 * k}px "Barlow", sans-serif`; ctx.textBaseline = 'middle'; ctx.fillText(initials(e.emblemName ?? e.name), cx, ly); ctx.textBaseline = 'alphabetic'; }
    ctx.restore();
    ctx.fillStyle = color('--foreground'); fit(e.name, 800, 38 * k, w - 32); ctx.fillText(e.name, cx, t + 305 * k);
    if (e.detail) { ctx.fillStyle = color('--muted-foreground'); fit(e.detail, 500, 26 * k, w - 32); ctx.fillText(e.detail, cx, t + 348 * k); }
    ctx.fillStyle = color('--gold'); ctx.font = `900 ${96 * k}px "Barlow", sans-serif`; ctx.fillText(e.score.toLocaleString('nl-NL'), cx, t + 455 * k);
    ctx.fillStyle = color('--muted-foreground'); const meta = `punten${e.meta ? ` · ${e.meta}` : ''}`; fit(meta, 500, 24 * k, w - 32); ctx.fillText(meta, cx, t + 500 * k);
  });

  ctx.fillStyle = color('--foreground'); ctx.font = '700 34px "Barlow", sans-serif'; ctx.fillText(data.detail ? 'Raak de korf. Breek je record.' : 'Speel jouw vereniging naar de top.', 540, canvas.height - (story ? 260 : 110));
  ctx.fillStyle = color('--muted-foreground'); ctx.font = '400 23px "Barlow", sans-serif';
  const date = data.fetchedAt ? new Intl.DateTimeFormat('nl-NL', { timeZone: 'Europe/Amsterdam', dateStyle: 'medium', timeStyle: 'short' }).format(new Date(data.fetchedAt)) : '—';
  ctx.fillText(`Momentopname · ${date}`, 540, canvas.height - (story ? 200 : 60));
  const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('Afbeelding niet beschikbaar');
  const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `korfbal-shoot-${story ? 'story' : 'vierkant'}.png`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
