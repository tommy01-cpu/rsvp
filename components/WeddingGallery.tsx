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

type GalleryImageProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  animAttrs?: Record<string, string>;
  style?: React.CSSProperties;
};

function toTemplateKey(value?: string): GalleryTemplateKey {
  const key = (value || '').trim();
  if (key === 'masonry_moments') return key;
  if (key === 'filmstrip_story') return key;
  if (key === 'polaroid_cards') return key;
  if (key === 'spotlight_stack') return key;
  return 'classic_grid';
}

function GalleryImage({
  src,
  alt,
  className = '',
  imageClassName = '',
  animAttrs,
  style,
}: GalleryImageProps) {
  return (
    <div className={`relative overflow-hidden gallery-photo-frame ${className}`} style={style}>
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover reveal-on-scroll ${imageClassName}`}
        {...animAttrs}
      />
    </div>
  );
}

export default function WeddingGallery({
  images,
  templateKey,
  animation = 'reveal-fade',
  animationDurationMs = 850,
  animationDelayMs = 0,
}: WeddingGalleryProps) {
  const style = toTemplateKey(templateKey);
  const count = images.length;
  const adaptiveDesktopCols =
    count >= 3
      ? 'md:grid-cols-3'
      : count === 2
        ? 'md:grid-cols-2 md:max-w-5xl md:mx-auto'
        : 'md:grid-cols-1 md:max-w-2xl md:mx-auto';

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
            <GalleryImage
              key={`${src}-${i}`}
              src={src}
              alt={`Wedding photo ${i + 1}`}
              className="rounded-xl"
              imageClassName="transition-transform duration-700"
              animAttrs={animAttrs(i)}
              style={{ width: 320, height: 220 }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (style === 'masonry_moments') {
    const masonryCols = count >= 4 ? 'md:grid-cols-4' : count === 3 ? 'md:grid-cols-3' : count === 2 ? 'md:grid-cols-2 md:max-w-5xl md:mx-auto' : 'md:grid-cols-1 md:max-w-2xl md:mx-auto';
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${masonryCols} gap-2 px-3 md:px-0`}>
        {images.map((src, i) => {
          const isHero = i === 0;
          return (
            <GalleryImage
              key={`${src}-${i}`}
              src={src}
              alt={`Wedding photo ${i + 1}`}
              className={`${isHero ? 'gallery-tile-masonry-hero md:col-span-2 md:row-span-2' : 'gallery-tile-masonry'}`}
              imageClassName="transition-transform duration-700"
              animAttrs={animAttrs(i)}
            />
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
            <GalleryImage
              src={src}
              alt={`Wedding photo ${i + 1}`}
              className="gallery-tile-polaroid"
              imageClassName="transition-transform duration-700"
            />
          </div>
        ))}
      </div>
    );
  }

  if (style === 'spotlight_stack') {
    const [first, ...rest] = images;
    return (
      <div className="px-3 md:px-2 py-2">
        {first && (
          <GalleryImage src={first} alt="Wedding photo 1" className="gallery-tile-spotlight mb-3" animAttrs={animAttrs(0)} />
        )}
        {rest.length > 0 && (
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${rest.length >= 4 ? 'md:grid-cols-4' : rest.length === 3 ? 'md:grid-cols-3' : rest.length === 2 ? 'md:grid-cols-2 md:max-w-5xl md:mx-auto' : 'md:grid-cols-1 md:max-w-2xl md:mx-auto'} gap-2`}>
            {rest.map((src, i) => (
              <GalleryImage key={`${src}-${i + 1}`} src={src} alt={`Wedding photo ${i + 2}`} className="gallery-tile-small" animAttrs={animAttrs(i + 1)} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 ${adaptiveDesktopCols} gap-2 px-3 md:px-0`}>
      {images.map((src, i) => (
        <GalleryImage
          key={`${src}-${i}`}
          src={src}
          alt={`Wedding photo ${i + 1}`}
          className="gallery-tile-classic"
          imageClassName="transition-transform duration-700"
          animAttrs={{
            'data-animate': i % 2 === 0 ? 'slide-in-left' : 'slide-in-right',
            'data-anim-duration': String(Math.max(100, animationDurationMs)),
            'data-anim-delay': String(Math.max(0, animationDelayMs + i * 100)),
          }}
        />
      ))}
    </div>
  );
}
