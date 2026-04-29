import React from 'react';

type GalleryTemplateKey =
  | 'classic_grid'
  | 'masonry_moments'
  | 'filmstrip_story'
  | 'polaroid_cards'
  | 'spotlight_stack';

type WeddingGalleryProps = {
  images: string[];
  templateKey?: string;
  animation?: string;
  animationDurationMs?: number;
  animationDelayMs?: number;
};

function toTemplateKey(value?: string): GalleryTemplateKey {
  const key = (value || '').trim();
  if (key === 'masonry_moments') return key;
  if (key === 'filmstrip_story') return key;
  if (key === 'polaroid_cards') return key;
  if (key === 'spotlight_stack') return key;
  return 'classic_grid';
}

export default function WeddingGallery({
  images,
  templateKey,
  animation = 'reveal-fade',
  animationDurationMs = 850,
  animationDelayMs = 0,
}: WeddingGalleryProps) {
  const style = toTemplateKey(templateKey);
  const animAttrs = (index = 0) => ({
    'data-animate': animation,
    'data-anim-duration': String(Math.max(100, animationDurationMs)),
    'data-anim-delay': String(Math.max(0, animationDelayMs + index * 100)),
  });

  if (style === 'filmstrip_story') {
    return (
      <div className="overflow-x-auto py-2">
        <div className="flex gap-4 px-2 min-w-max">
          {images.map((src, i) => (
            <div key={`${src}-${i}`} className="relative overflow-hidden rounded-xl" style={{ width: 320, height: 220 }}>
              <img
                src={src}
                alt={`Wedding photo ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 reveal-on-scroll"
                {...animAttrs(i)}
              />
              <div className="absolute inset-0" style={{ background: 'rgba(20,10,5,0.08)' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (style === 'masonry_moments') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
        {images.map((src, i) => {
          const isHero = i === 0;
          return (
            <div
              key={`${src}-${i}`}
              className={`relative overflow-hidden ${isHero ? 'md:col-span-2 md:row-span-2' : ''}`}
              style={{ height: isHero ? 'min(58vw, 520px)' : 'min(28vw, 260px)' }}
            >
              <img
                src={src}
                alt={`Wedding photo ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 reveal-on-scroll"
                {...animAttrs(i)}
              />
              <div className="absolute inset-0" style={{ background: 'rgba(20,10,5,0.08)' }} />
            </div>
          );
        })}
      </div>
    );
  }

  if (style === 'polaroid_cards') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 py-6">
        {images.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="p-3 bg-white shadow-sm reveal-on-scroll"
            {...animAttrs(i)}
            style={{
              transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (2 + (i % 3))}deg)`,
              border: '1px solid rgba(232,213,183,0.8)',
            }}
          >
            <div className="relative overflow-hidden" style={{ height: 230 }}>
              <img src={src} alt={`Wedding photo ${i + 1}`} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (style === 'spotlight_stack') {
    const [first, ...rest] = images;
    return (
      <div className="px-2 py-2">
        {first && (
          <div className="relative overflow-hidden mb-3" style={{ height: 'min(62vw, 520px)' }}>
            <img src={first} alt="Wedding photo 1" className="w-full h-full object-cover reveal-on-scroll" {...animAttrs(0)} />
            <div className="absolute inset-0" style={{ background: 'rgba(20,10,5,0.08)' }} />
          </div>
        )}
        {rest.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {rest.map((src, i) => (
              <div key={`${src}-${i + 1}`} className="relative overflow-hidden" style={{ height: 170 }}>
                <img src={src} alt={`Wedding photo ${i + 2}`} className="w-full h-full object-cover reveal-on-scroll" {...animAttrs(i + 1)} />
                <div className="absolute inset-0" style={{ background: 'rgba(20,10,5,0.08)' }} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3" style={{ minHeight: 'clamp(260px, 40vw, 480px)' }}>
      {images.map((src, i) => (
        <div key={`${src}-${i}`} className="relative overflow-hidden" style={{ height: 'clamp(200px, 35vw, 480px)' }}>
          <img
            src={src}
            alt={`Wedding photo ${i + 1}`}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 reveal-on-scroll"
            data-animate={i % 2 === 0 ? 'slide-in-left' : 'slide-in-right'}
            data-anim-duration={String(Math.max(100, animationDurationMs))}
            data-anim-delay={String(Math.max(0, animationDelayMs + i * 100))}
          />
          <div className="absolute inset-0" style={{ background: 'rgba(20,10,5,0.08)' }} />
        </div>
      ))}
    </div>
  );
}
