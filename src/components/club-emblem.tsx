import { useState } from 'react';
import { initials } from '@/lib/standings';

const failedLogos = new Set<string>();

export function ClubEmblem({ name, logoUrl }: { name: string; logoUrl?: string | undefined }) {
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const src = logoUrl && failedUrl !== logoUrl && !failedLogos.has(logoUrl) ? logoUrl : undefined;
  return <span className="club-emblem">
    <span aria-hidden="true" className={loadedUrl === src && src ? 'invisible' : undefined}>{initials(name)}</span>
    {src && <img src={src} alt={`Logo van ${name}`} loading="lazy" decoding="async" className={loadedUrl === src ? 'club-logo' : 'club-logo invisible'} onLoad={() => setLoadedUrl(src)} onError={() => { failedLogos.add(src); setFailedUrl(src); }}/>}</span>;
}