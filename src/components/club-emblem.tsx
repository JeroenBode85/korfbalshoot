import { useEffect, useRef, useState } from 'react';
import { initials } from '@/lib/standings';

const failedLogos = new Set<string>();

export function ClubEmblem({ name, logoUrl }: { name: string; logoUrl?: string | undefined }) {
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const src = logoUrl && failedUrl !== logoUrl && !failedLogos.has(logoUrl) ? logoUrl : undefined;
  useEffect(() => {
    const image = imageRef.current;
    if (!src || !image?.complete) return;
    if (image.naturalWidth > 0) setLoadedUrl(src);
    else { failedLogos.add(src); setFailedUrl(src); }
  }, [src]);
  return <span className="club-emblem">
    <span aria-hidden="true" className={loadedUrl === src && src ? 'invisible' : undefined}>{initials(name)}</span>
    {src && <img ref={imageRef} src={src} alt={`Logo van ${name}`} loading="lazy" decoding="async" className={loadedUrl === src ? 'club-logo' : 'club-logo invisible'} onLoad={() => setLoadedUrl(src)} onError={() => { failedLogos.add(src); setFailedUrl(src); }}/>}</span>;
}