'use client';

import { useEffect } from 'react';
import { Download, Printer } from 'lucide-react';

type InvitationPrintToolbarProps = {
  slug: string;
  autoPrint: boolean;
};

export default function InvitationPrintToolbar({ slug, autoPrint }: InvitationPrintToolbarProps) {
  useEffect(() => {
    if (!autoPrint) return;

    let cancelled = false;
    let timer: number | null = null;

    const waitForAssetsThenPrint = async () => {
      try {
        if (document.fonts?.ready) {
          await document.fonts.ready;
        }
      } catch {
        // ignore font readiness errors
      }

      const images = Array.from(document.images);
      await Promise.all(
        images.map(
          (img) =>
            new Promise<void>((resolve) => {
              if (img.complete && img.naturalWidth > 0) {
                resolve();
                return;
              }
              const done = () => resolve();
              img.addEventListener('load', done, { once: true });
              img.addEventListener('error', done, { once: true });
            }),
        ),
      );

      if (cancelled) return;
      timer = window.setTimeout(() => window.print(), 150);
    };

    waitForAssetsThenPrint();

    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [autoPrint]);

  return (
    <div
      className="print-hidden sticky top-0 z-20 px-4 py-3 flex flex-wrap items-center gap-2 justify-center"
      style={{ background: 'rgba(255,255,255,0.95)', borderBottom: '1px solid #E8D5B7' }}
    >
      <a
        href={`/${slug}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex px-3 py-2 rounded-lg text-sm"
        style={{ background: '#fff', color: '#6B5744', border: '1.5px solid #E8D5B7' }}
      >
        Open Frontend
      </a>
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
        style={{ background: '#C9A96E', color: '#fff' }}
      >
        <Printer className="w-4 h-4" /> Print
      </button>
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
        style={{ background: '#fff', color: '#6B5744', border: '1.5px solid #E8D5B7' }}
      >
        <Download className="w-4 h-4" /> Save as PDF
      </button>
    </div>
  );
}
