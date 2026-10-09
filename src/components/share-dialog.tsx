import { useState } from 'react';
import { Copy, Download, Share2, Smartphone, Square } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { downloadShareCard, type ShareData } from '@/lib/share-card';
import { formatTime } from '@/lib/standings';

export function ShareDialog({ data, onClose }: { data: ShareData | null; onClose: () => void }) {
  const [feedback, setFeedback] = useState('');
  const [busy, setBusy] = useState(false);
  async function copy() {
    if (!data) return;
    try { await navigator.clipboard.writeText(data.url); setFeedback('Link gekopieerd!'); }
    catch { setFeedback('Kopiëren niet beschikbaar. Selecteer de link hieronder.'); }
  }
  async function share() {
    if (!data) return;
    try { if (navigator.share) await navigator.share({ title: `${data.title} · Korfbal Shoot!`, text: data.position ? `${data.title} staat op plek ${data.position}! Speel mee in Korfbal Shoot!` : 'Bekijk de klassementen van Korfbal Shoot!', url: data.url }); else await copy(); }
    catch (error) { if (!(error instanceof DOMException && error.name === 'AbortError')) setFeedback('Delen is niet beschikbaar. Kopieer de link.'); }
  }
  async function download(story: boolean) {
    if (!data) return;
    setBusy(true);
    try { await downloadShareCard(data, story); setFeedback('Je deelafbeelding is gedownload.'); } catch { setFeedback('Downloaden lukt niet. Probeer het opnieuw.'); } finally { setBusy(false); }
  }
  return <Dialog open={data !== null} onOpenChange={open => { if (!open) { onClose(); setFeedback(''); } }}><DialogContent className="max-h-[90dvh] w-[calc(100%-32px)] overflow-y-auto rounded-2xl"><DialogHeader><DialogTitle>Deel de korfbalpret</DialogTitle><DialogDescription>Een record om trots op te zijn.</DialogDescription></DialogHeader>{data && <><div className="share-preview"><p className="eyebrow">KORFBAL SHOOT! · {data.subtitle}</p><strong>{data.position ? `#${data.position}` : 'TOP 3'}</strong><h3>{data.title}</h3>{data.detail && <p>{data.detail}</p>}{data.score !== undefined && <p>{data.score.toLocaleString('nl-NL')} punten</p>}{data.leaders?.map(leader => <p key={leader}>{leader}</p>)}<p>Momentopname · {formatTime(data.fetchedAt)}</p></div><div className="share-controls"><Button variant="game" onClick={share}><Share2/>Delen</Button><Button variant="gameOutline" onClick={copy}><Copy/>Kopieer link</Button><Button variant="gameOutline" disabled={busy} onClick={() => download(false)}><Square/><Download/>Vierkant</Button><Button variant="gameOutline" disabled={busy} onClick={() => download(true)}><Smartphone/><Download/>Story</Button></div><input className="w-full rounded-lg border border-border bg-secondary p-3 text-xs text-muted-foreground" aria-label="Deelbare link" value={data.url} readOnly onFocus={event => event.target.select()}/><p className="share-feedback" role="status">{feedback}</p></>}</DialogContent></Dialog>;
}