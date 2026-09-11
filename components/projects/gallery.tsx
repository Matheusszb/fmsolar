'use client';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X, Share2 } from 'lucide-react';
import type { ProjectImage } from '@/lib/projects/types';
import { company } from '@/config/company';
export function Gallery({ images }: { images: ProjectImage[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const touch = useRef(0);
  const move = (n: number) => setIndex((i) => (i + n + images.length) % images.length);
  if (!images.length) return null;
  return (
    <>
      <div className="gallery-grid">
        {images.map((im, i) => (
          <button
            key={im.id}
            onClick={() => {
              setIndex(i);
              dialog.current?.showModal();
            }}
            aria-label={`Abrir foto ${i + 1}: ${im.alt_text}`}
          >
            <Image
              src={im.url!}
              alt={im.alt_text || `Foto ${i + 1} do projeto`}
              fill
              sizes="(max-width:700px) 50vw,25vw"
              unoptimized
            />
          </button>
        ))}
      </div>
      <dialog
        className="lightbox"
        ref={dialog}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') move(-1);
          if (e.key === 'ArrowRight') move(1);
        }}
      >
        <div className="lightbox-top">
          <span>
            {index + 1} / {images.length}
          </span>
          <button
            className="icon-button"
            aria-label="Fechar galeria"
            onClick={() => dialog.current?.close()}
          >
            <X />
          </button>
        </div>
        <div
          className="lightbox-photo"
          onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            const delta = e.changedTouches[0].clientX - touch.current;
            if (Math.abs(delta) > 45) move(delta < 0 ? 1 : -1);
          }}
        >
          <Image
            src={images[index].url!}
            alt={images[index].alt_text || 'Foto do projeto'}
            fill
            sizes="100vw"
            unoptimized
          />
        </div>
        <div className="lightbox-controls">
          <button className="icon-button" aria-label="Foto anterior" onClick={() => move(-1)}>
            <ChevronLeft />
          </button>
          <p>{images[index].caption}</p>
          <button className="icon-button" aria-label="Próxima foto" onClick={() => move(1)}>
            <ChevronRight />
          </button>
        </div>
      </dialog>
    </>
  );
}
export function BeforeAfter({ before, after }: { before: string; after: string }) {
  const [value, setValue] = useState(50);
  return (
    <section className="case-section">
      <h2>Uma nova perspectiva. A mesma propriedade.</h2>
      <div className="before-after">
        <Image src={before} alt="Antes da instalação" fill sizes="100vw" unoptimized />
        <div style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
          <Image src={after} alt="Depois da instalação" fill sizes="100vw" unoptimized />
        </div>
        <span style={{ left: `${value}%` }} />
        <b>Depois</b>
        <b>Antes</b>
      </div>
      <label className="field">
        Arraste para comparar antes e depois
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />
      </label>
    </section>
  );
}
export function ShareProject({ title, slug }: { title: string; slug: string }) {
  const [msg, setMsg] = useState('');
  const url = `${company.siteUrl}/obras/${slug}`;
  return (
    <div className="share-project">
      <h3>Compartilhar projeto</h3>
      <div className="button-row">
        <button
          className="button light small"
          onClick={async () => {
            try {
              if (navigator.share) await navigator.share({ title, url });
              else {
                await navigator.clipboard.writeText(url);
                setMsg('Link copiado.');
              }
            } catch {
              setMsg('Não foi possível compartilhar. Use os links abaixo.');
            }
          }}
        >
          <Share2 size={16} />
          Compartilhar
        </button>
        {[
          ['WhatsApp', `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`],
          ['Facebook', `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`],
          [
            'LinkedIn',
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          ],
        ].map(([t, u]) => (
          <a className="button light small" href={u} target="_blank" rel="noreferrer" key={t}>
            {t}
          </a>
        ))}
        <button
          className="button light small"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(url);
              setMsg('Link copiado.');
            } catch {
              setMsg(`Copie este endereço: ${url}`);
            }
          }}
        >
          Copiar link
        </button>
      </div>
      <p role="status">{msg}</p>
    </div>
  );
}
