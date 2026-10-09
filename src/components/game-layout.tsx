import { Link } from '@tanstack/react-router';
import { Download, Play, Trophy } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import appIcon from '@/assets/app-icon.png.asset.json';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { gameConfig } from '@/lib/game-config';

export function PlayButton({ compact = false }: { compact?: boolean }) {
  return <Button variant="game" className={compact ? 'header-download' : ''} asChild><a href={gameConfig.playUrl} target="_blank" rel="noopener noreferrer"><Play fill="currentColor" />{gameConfig.comingSoon ? 'Binnenkort op Google Play' : compact ? 'Download de game' : 'Download op Google Play'}</a></Button>;
}
export function Wordmark() {
  return <Link to="/" className="wordmark" aria-label="Korfbal Shoot! Startpagina"><img className="wordmark-symbol" src={appIcon.url} alt="" width="39" height="39"/><span>KORFBAL<br/><span>SHOOT!</span></span></Link>;
}
export function GameLayout({ children, active = 'home' }: { children: ReactNode; active?: 'home' | 'rankings' }) {
  const [info, setInfo] = useState<'privacy' | 'contact' | null>(null);
  return <><header className="site-header"><div className="container-game header-inner"><Wordmark/><nav className="nav-links" aria-label="Hoofdnavigatie"><Link to="/" data-active={active === 'home'}>De game</Link><Link to="/klassementen/$mode" params={{ mode: 'verenigingen' }} data-active={active === 'rankings'}>Klassementen</Link><Link to="/klassementen/$mode" params={{ mode: 'verenigingen' }}>Verenigingen</Link></nav><PlayButton compact/></div></header><main>{children}</main><section className="download-band"><div className="container-game download-band-inner"><div><h2>Jouw volgende record wacht op je.</h2><p>Pak de bal. Mik op de korf. Speel mee voor jouw vereniging.</p></div><PlayButton/></div></section><footer className="site-footer"><div className="container-game"><div className="footer-inner"><Wordmark/><div className="footer-links"><Button variant="ghost" onClick={() => setInfo('privacy')}>Privacyverklaring</Button><Button variant="ghost" onClick={() => setInfo('contact')}>Contact</Button><a href={gameConfig.playUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 px-3"><Download className="size-4"/>Google Play</a></div></div><p className="copyright">© 2026 Korfbal Shoot! · Met liefde voor korfbal. <Trophy className="ml-1 inline size-3 text-gold"/></p></div></footer><Dialog open={info !== null} onOpenChange={open => { if (!open) setInfo(null); }}><DialogContent><DialogHeader><DialogTitle>{info === 'privacy' ? 'Privacyverklaring' : 'Contact'}</DialogTitle><DialogDescription>{info === 'privacy' ? 'De officiële privacyverklaring wordt hier toegevoegd zodra deze beschikbaar is. Op deze website tonen we alleen openbare verenigingsnamen en geaggregeerde scores.' : 'Contactgegevens worden hier toegevoegd zodra ze beschikbaar zijn.'}</DialogDescription></DialogHeader><Button variant="gameOutline" asChild><a href={gameConfig.playUrl} target="_blank" rel="noopener noreferrer">Bekijk de game op Google Play</a></Button></DialogContent></Dialog></>;
}