import { useState } from 'react';
import { initials } from '@/lib/standings';

const failedLogos = new Set<string>();

export function ClubEmblem({ name, logoUrl }: { name: string; logoUrl?: string }) {
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const showImage = logoUrl && failedUrl !== logoUrl && !failedLogos.has(logoUrl);
  return <span className="club-emblem">
    <span aria-hidden="true" className={loadedUrl === logoUrl && showImage ? 'invisible' : undefined}>{initials(name)}</span>
    {showImage && <img src={logoUrl} alt={`Logo van ${name}`} loading="lazy" decoding="async" className={loadedUrl === logoUrl ? 'club-logo' : 'club-logo invisible'} onLoad={() => setLoadedUrl(logoUrl)} onError={() => { failedLogos.add(logoUrl); setFailedUrl(logoUrl); }}/>}</span>;
}