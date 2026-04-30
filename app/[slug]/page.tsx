import React from 'react';
import { notFound } from 'next/navigation';
import RSVPForm from '@/components/RSVPForm';
import FallingText from '@/components/FallingText';
import ScrollReveal from '@/components/ScrollReveal';
import WeddingGallery from '@/components/WeddingGallery';
import { Heart, MapPin, Clock, Calendar, Music, Utensils, Camera } from 'lucide-react';
import { getWeddingSiteData } from '@/lib/wedding-platform';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function Divider({ gold }: { gold: string }) {
  return (
    <div className="flex items-center justify-center gap-4 my-8">
      <div style={{ width: 60, height: 1, background: gold, opacity: 0.5 }} />
      <Heart className="heart-pulse" style={{ color: gold, fill: gold, width: 14, height: 14 }} />
      <div style={{ width: 60, height: 1, background: gold, opacity: 0.5 }} />
    </div>
  );
}

function EventIcon({ icon }: { icon: 'calendar' | 'clock' | 'map-pin' }) {
  if (icon === 'calendar') return <Calendar className="w-6 h-6" />;
  if (icon === 'clock') return <Clock className="w-6 h-6" />;
  return <MapPin className="w-6 h-6" />;
}

function ProgrammeIcon({ icon }: { icon: 'heart' | 'clock' | 'camera' | 'music' | 'utensils' }) {
  if (icon === 'clock') return <Clock className="w-4 h-4" />;
  if (icon === 'camera') return <Camera className="w-4 h-4" />;
  if (icon === 'music') return <Music className="w-4 h-4" />;
  if (icon === 'utensils') return <Utensils className="w-4 h-4" />;
  return <Heart className="w-4 h-4" />;
}

export default async function WeddingBySlugPage({ params }: { params: { slug: string } }) {
  const site = await getWeddingSiteData(params.slug);
  if (!site.found) {
    notFound();
  }
  const content = site.content;
  const templateKey = (site.wedding.theme_key || 'classic_grid').trim();
  const THEMES = {
    classic_grid: {
      gold: '#C9A96E',
      main: '#FDF8F0',
      section: '#FAF4EC',
      dark: '#2C1810',
      mid: '#6B5744',
      light: '#8B7355',
      border: '#E8D5B7',
      card: '#FFFFFF',
      cardShadow: '0 8px 30px rgba(44,24,16,0.06)',
    },
    masonry_moments: {
      gold: '#9C7A4B',
      main: '#F8F7F4',
      section: '#F0EFEA',
      dark: '#202224',
      mid: '#4E545A',
      light: '#6E747C',
      border: '#D7D5CF',
      card: '#FFFFFF',
      cardShadow: '0 10px 34px rgba(18,22,30,0.08)',
    },
    filmstrip_story: {
      gold: '#B88B5A',
      main: '#FCF4EA',
      section: '#F5E7D6',
      dark: '#3A2518',
      mid: '#6F4E37',
      light: '#8A6850',
      border: '#E2C7A8',
      card: '#FFF9F2',
      cardShadow: '0 8px 28px rgba(58,37,24,0.08)',
    },
    polaroid_cards: {
      gold: '#C68E88',
      main: '#FFF8F8',
      section: '#FDF0EE',
      dark: '#3E2A2B',
      mid: '#6F5557',
      light: '#8E6D70',
      border: '#ECCFCD',
      card: '#FFFFFF',
      cardShadow: '0 9px 28px rgba(122,79,79,0.08)',
    },
    spotlight_stack: {
      gold: '#B4975F',
      main: '#F7F3EA',
      section: '#EFE8DA',
      dark: '#2F2416',
      mid: '#5F4D36',
      light: '#7B664A',
      border: '#DDCBA8',
      card: '#FFFDF8',
      cardShadow: '0 10px 32px rgba(47,36,22,0.09)',
    },
  } as const;
  const theme = THEMES[(templateKey as keyof typeof THEMES) || 'classic_grid'] || THEMES.classic_grid;
  const GOLD = theme.gold;
  const CREAM = theme.main;
  const CREAM_SECTION = theme.section;
  const BROWN_DARK = theme.dark;
  const BROWN_MID = theme.mid;
  const BROWN_LIGHT = theme.light;
  const BORDER = theme.border;

  const normalizeAnim = (value?: string) => {
    const v = (value || '').trim();
    if (!v) return 'reveal-fade';
    if (v === 'animate-fade-in-up') return 'reveal-up';
    if (v === 'animate-fade-in') return 'reveal-fade';
    if (v === 'slide-in-left') return 'reveal-left';
    if (v === 'slide-in-right') return 'reveal-right';
    return v;
  };
  const isSectionEnabled = (key: string) => site.sections[key] ?? true;
  const galleryImages = site.gallery.length ? site.gallery.map((item) => item.image_url) : content.galleryImages;
  const sectionText = (key: string, fallback = '') => (site.sectionConfig[key]?.content || '').trim() || fallback;
  const sectionAnim = (key: string, fallback = 'reveal-fade') => normalizeAnim(site.sectionConfig[key]?.animation || fallback);
  const sectionDuration = (key: string, fallback = 850) => Math.max(100, site.sectionConfig[key]?.durationMs || fallback);
  const sectionDelay = (key: string, fallback = 0) => Math.max(0, site.sectionConfig[key]?.delayMs || fallback);
  const sectionAnimAttrs = (key: string, fallback = 'reveal-fade') => ({
    'data-animate': sectionAnim(key, fallback),
    'data-anim-duration': String(sectionDuration(key)),
    'data-anim-delay': String(sectionDelay(key)),
  });
  const sectionAnimAttrsWithOffset = (key: string, fallback = 'reveal-fade', extraDelayMs = 0) => ({
    'data-animate': sectionAnim(key, fallback),
    'data-anim-duration': String(sectionDuration(key)),
    'data-anim-delay': String(Math.max(0, sectionDelay(key) + extraDelayMs)),
  });
  const sectionName = (key: string, fallback: string) =>
    site.sectionList.find((section) => section.section_key === key)?.name || fallback;
  const isDuplicateHeading = (eyebrow: string, title: string) =>
    eyebrow.trim().toLowerCase() === title.trim().toLowerCase();
  const coupleSubtitle = sectionText('couple_info', site.wedding.title);
  const showCoupleSubtitle = isSectionEnabled('couple_info');
  const sectionOrder = ['invitation', 'couple_info', 'story', 'event_details', 'gallery', 'programme', 'entourage', 'venue', 'faq', 'gift_registry', 'dress_code', 'rsvp'];
  const nextAfterInvitation = sectionOrder.slice(sectionOrder.indexOf('invitation') + 1).find((key) => isSectionEnabled(key)) || 'rsvp';
  const heroVisible =
    isSectionEnabled('hero_title') ||
    isSectionEnabled('hero_subtitle') ||
    isSectionEnabled('hero_couple_text');
  const headingSize = 'clamp(2rem, 5vw, 3.2rem)';
  const headingWeight = 300;
  const bodyStyle = { color: BROWN_MID, lineHeight: 1.8 };
  const invitationImage = galleryImages[0] || content.heroImageUrl;
  const heroOverlay =
    templateKey === 'spotlight_stack'
      ? 'linear-gradient(to bottom, rgba(12,8,6,0.42) 0%, rgba(12,8,6,0.65) 60%, rgba(12,8,6,0.82) 100%)'
      : templateKey === 'polaroid_cards'
        ? 'linear-gradient(to bottom, rgba(36,20,16,0.3) 0%, rgba(36,20,16,0.52) 60%, rgba(36,20,16,0.68) 100%)'
        : 'linear-gradient(to bottom, rgba(20,10,5,0.35) 0%, rgba(20,10,5,0.55) 60%, rgba(20,10,5,0.72) 100%)';
  const isEditorial = false;
  const isStorybook = false;
  const isPolaroid = false;
  const isLuxe = false;
  const isClassic = true;
  const inviteSplitLayout = false;
  const mainStyle: React.CSSProperties = {
    background: CREAM,
    minHeight: '100vh',
    fontFamily: 'var(--font-lato), sans-serif',
  };

  return (
    <main className="scroll-smooth" style={mainStyle}>
      {heroVisible && (
      <section id="hero" className="relative overflow-hidden" style={{ minHeight: '100svh' }}>
        <div className="absolute inset-0">
          <img
            src={content.heroImageUrl}
            alt={`${content.brideName} and ${content.groomName}`}
            className="w-full h-full object-cover hero-zoom"
          />
          <div
            className="absolute inset-0"
            style={{
              background: heroOverlay,
            }}
          />
        </div>

        <div
          className={`relative z-10 flex flex-col justify-center px-6 py-24 reveal-on-scroll opacity-0 ${isEditorial || isLuxe ? 'items-start text-left' : 'items-center text-center'}`}
          data-animate="reveal-fade"
          data-anim-duration="700"
          data-anim-delay="0"
          style={{ minHeight: '100svh', paddingLeft: isEditorial || isLuxe ? 'min(9vw, 100px)' : undefined }}
        >
          <div
            style={{
              maxWidth: isEditorial || isLuxe ? 760 : 900,
              background: isStorybook ? 'rgba(255,249,242,0.12)' : undefined,
              border: isStorybook ? `1px solid ${BORDER}` : undefined,
              borderRadius: isStorybook ? 20 : undefined,
              padding: isStorybook ? '22px 24px' : undefined,
              backdropFilter: isStorybook ? 'blur(2px)' : undefined,
            }}
          >
          <p
            className="font-sans-body text-xs tracking-[0.35em] uppercase mb-6 reveal-on-scroll opacity-0"
            {...sectionAnimAttrsWithOffset('hero_title', 'reveal-fade', 40)}
            style={{ color: '#E8D5B7' }}
          >
            {sectionText('hero_title', content.blessingText)}
          </p>

          {isSectionEnabled('hero_couple_text') && (
            <h1
              className="font-serif reveal-on-scroll opacity-0"
              {...sectionAnimAttrsWithOffset('hero_couple_text', 'reveal-up', 120)}
              data-highlight-char="&"
              data-highlight-color={GOLD}
              data-allow-fall-letters="1"
              data-original-text={`${content.brideName} & ${content.groomName}`}
              style={{
                fontSize: isEditorial ? 'clamp(2.8rem, 8vw, 6rem)' : 'clamp(3rem, 10vw, 7rem)',
                fontWeight: isLuxe ? 400 : 300,
                color: '#FFFDF9',
                lineHeight: 1.1,
                letterSpacing: isEditorial ? '0.01em' : '-0.01em',
              }}
            >
              {content.brideName}
              <span style={{ color: GOLD, fontStyle: 'italic' }}> &amp; </span>
              {content.groomName}
            </h1>
          )}

          <p
            className="font-serif italic reveal-on-scroll opacity-0 mt-2"
            {...sectionAnimAttrsWithOffset('hero_subtitle', 'reveal-up', 260)}
            style={{
              fontSize: 'clamp(1.1rem, 3vw, 1.6rem)',
              color: '#E8D5B7',
              fontWeight: 300,
            }}
          >
            {content.heroSubtitle}
          </p>

          <div className="mt-10 opacity-0 animate-fade-in-up delay-600" style={{ animationFillMode: 'forwards' }}>
            <div
              className="px-8 py-4 rounded-full inline-block"
              style={{
                border: `1.5px solid ${GOLD}`,
                background: 'rgba(201, 169, 110, 0.12)',
                backdropFilter: 'blur(4px)',
              }}
            >
              <p className="font-serif" style={{ color: '#FFFDF9', fontSize: '1.1rem', letterSpacing: '0.05em' }}>
                {content.weddingDateLabel}
              </p>
            </div>
          </div>

          <div className="mt-16 opacity-0 animate-fade-in delay-800" style={{ animationFillMode: 'forwards' }}>
            <div style={{ width: 1, height: 60, background: `linear-gradient(to bottom, ${GOLD}, transparent)`, margin: '0 auto' }} />
            <p className="font-sans-body text-xs tracking-[0.3em] uppercase mt-4" style={{ color: '#C9A96E' }}>
              scroll
            </p>
          </div>
          </div>
        </div>
      </section>
      )}

      <div className="block md:hidden" style={{ height: 120 }} />

      {isSectionEnabled('invitation') && (
        <section id="invitation" className="px-6 py-20 text-center reveal-on-scroll opacity-0" {...sectionAnimAttrs('invitation', 'reveal-fade')} style={{ background: CREAM, position: 'relative', zIndex: 2 }}>
          {inviteSplitLayout ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center" style={{ maxWidth: 1080, margin: '0 auto' }}>
              <div className={`relative overflow-hidden ${isLuxe ? 'rounded-[2rem]' : 'rounded-2xl'}`} style={{ height: isLuxe ? 460 : 420, border: `1px solid ${BORDER}`, boxShadow: theme.cardShadow }}>
                <img src={invitationImage} alt="Invitation visual" className="w-full h-full object-contain" style={{ background: '#F7F0E4' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(20,10,5,0.42), rgba(20,10,5,0.06))' }} />
              </div>
              <div className="text-center md:text-left">
                <p className="font-sans-body text-xs tracking-[0.35em] uppercase mb-4" style={{ color: GOLD }}>
                  {content.invitationEyebrow}
                </p>
                <h2
                  className="font-serif mb-4"
                  style={{ fontSize: headingSize, fontWeight: headingWeight, color: BROWN_DARK, lineHeight: 1.15 }}
                >
                  {content.invitationTitle}
                </h2>
                <Divider gold={GOLD} />
                <FallingText
                  className="font-serif italic leading-relaxed"
                  style={{ fontSize: 'clamp(1.05rem, 2.2vw, 1.24rem)', ...bodyStyle }}
                >
                  {sectionText('invitation', content.invitationText)}
                </FallingText>
                <a
                  href={`#${nextAfterInvitation}`}
                  className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full font-sans-body text-sm tracking-[0.18em] uppercase"
                  style={{ border: `1.5px solid ${GOLD}`, color: BROWN_DARK, background: 'rgba(201,169,110,0.12)' }}
                >
                  Continue
                </a>
              </div>
            </div>
          ) : (
            <div style={{ maxWidth: 680, margin: '0 auto' }}>
              <p className="font-sans-body text-xs tracking-[0.35em] uppercase mb-4" style={{ color: GOLD }}>
                {content.invitationEyebrow}
              </p>
              <h2
                className="font-serif mb-6"
                style={{ fontSize: headingSize, fontWeight: headingWeight, color: BROWN_DARK, lineHeight: 1.2,  }}
              >
                {content.invitationTitle}
              </h2>
              <Divider gold={GOLD} />
              <FallingText
                className="font-serif italic leading-relaxed"
                style={{ fontSize: 'clamp(1.05rem, 2.5vw, 1.3rem)', ...bodyStyle }}
              >
                {sectionText('invitation', content.invitationText)}
              </FallingText>
              {!isClassic && (
                <div className="mt-10 reveal-on-scroll opacity-0" {...sectionAnimAttrsWithOffset('invitation', 'reveal-up', 120)}>
                  <div className="relative overflow-hidden rounded-2xl mx-auto" style={{ maxWidth: 560, height: templateKey === 'filmstrip_story' ? 240 : 220, border: `1px solid ${BORDER}` }}>
                    <img src={invitationImage} alt="Invitation visual" className="w-full h-full object-contain" style={{ background: '#F7F0E4' }} />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(20,10,5,0.38), rgba(20,10,5,0.05))' }} />
                  </div>
                  <a
                    href={`#${nextAfterInvitation}`}
                    className="inline-flex items-center gap-2 mt-5 px-6 py-3 rounded-full font-sans-body text-sm tracking-[0.18em] uppercase"
                    style={{ border: `1.5px solid ${GOLD}`, color: BROWN_DARK, background: templateKey === 'polaroid_cards' ? '#fff' : 'rgba(201,169,110,0.12)' }}
                  >
                    Continue
                  </a>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {isSectionEnabled('couple_info') && (
        <section id="couple_info" className="px-6 py-14 text-center reveal-on-scroll opacity-0" {...sectionAnimAttrs('couple_info', 'reveal-fade')} style={{ background: CREAM }}>
          <div style={{ maxWidth: 980, margin: '0 auto' }}>
            <h2 className="font-serif mb-3" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 300, color: GOLD }}>
              {sectionName('couple_info', 'Couple Info')}
            </h2>
            {showCoupleSubtitle && !!coupleSubtitle && (
              <p className="font-sans-body mb-8" style={{ color: BROWN_MID }}>
                {coupleSubtitle}
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="rounded-2xl overflow-hidden" style={{ background: theme.card, border: `1px solid ${BORDER}`, boxShadow: theme.cardShadow }}>
                <div style={{ background: '#F7F0E4' }}>
                  <img src={content.brideImageUrl || content.heroImageUrl} alt={content.brideName} className="w-full h-72 object-cover" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-serif" style={{ color: BROWN_DARK, fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>{content.brideName}</h3>
                  <p className="font-sans-body mt-2" style={{ color: BROWN_MID }}>{content.brideDetails}</p>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden" style={{ background: theme.card, border: `1px solid ${BORDER}`, boxShadow: theme.cardShadow }}>
                <div style={{ background: '#F7F0E4' }}>
                  <img src={content.groomImageUrl || content.heroImageUrl} alt={content.groomName} className="w-full h-72 object-cover" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-serif" style={{ color: BROWN_DARK, fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>{content.groomName}</h3>
                  <p className="font-sans-body mt-2" style={{ color: BROWN_MID }}>{content.groomDetails}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {isSectionEnabled('story') && (
        <section id="story" className="px-6 py-20 text-center reveal-on-scroll opacity-0" {...sectionAnimAttrs('story', 'reveal-fade')} style={{ background: CREAM_SECTION }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            {!isDuplicateHeading(sectionName('story', 'Our Story'), sectionName('story', 'Our Story')) && (
              <p className="font-sans-body text-xs tracking-[0.35em] uppercase mb-3" style={{ color: GOLD }}>
                {sectionName('story', 'Our Story')}
              </p>
            )}
            <h2 className="font-serif mb-6" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 300, color: GOLD }}>
              {sectionName('story', 'Our Story')}
            </h2>
            <p className="font-sans-body leading-relaxed" style={{ color: BROWN_MID }}>
              {sectionText('story', content.invitationText)}
            </p>
          </div>
        </section>
      )}

      {isSectionEnabled('event_details') && (
        <section id="event_details" className="px-6 py-20 reveal-on-scroll opacity-0" {...sectionAnimAttrs('event_details', 'reveal-fade')} style={{ background: CREAM_SECTION }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div className="text-center mb-14">
              <p className="font-sans-body text-xs tracking-[0.35em] uppercase mb-3" style={{ color: GOLD }}>
                {sectionName('event_details', 'Event Details')}
              </p>
              <h2 className="font-serif" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 300, color: GOLD }}>
                {content.eventTitle}
              </h2>
              
            </div>

            {isStorybook || isPolaroid ? (
              <div className="space-y-4" style={{ maxWidth: 760, margin: '0 auto' }}>
                {content.eventDetails.map((card, idx) => (
                  <div
                    key={card.title}
                    className="rounded-2xl p-5 reveal-on-scroll opacity-0"
                    data-animate={sectionAnim('event_details', 'reveal-up')}
                    style={{
                      background: theme.card,
                      border: `1px solid ${BORDER}`,
                      boxShadow: theme.cardShadow,
                      transform: isPolaroid ? `rotate(${idx % 2 === 0 ? -0.7 : 0.7}deg)` : undefined,
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${GOLD}22`, color: GOLD }}>
                        <EventIcon icon={card.icon} />
                      </div>
                      <div className="text-left">
                        <p className="font-sans-body text-xs tracking-[0.3em] uppercase mb-1" style={{ color: BROWN_LIGHT }}>
                          {card.title}
                        </p>
                        <p className="font-serif" style={{ fontSize: '1.2rem', color: BROWN_DARK, lineHeight: 1.35 }}>
                          {card.line1}
                        </p>
                        <p className="font-serif italic mt-0.5" style={{ fontSize: '1rem', color: BROWN_MID }}>
                          {card.line2}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {content.eventDetails.map((card) => (
                  <div
                    key={card.title}
                    className="text-center p-8 rounded-2xl reveal-on-scroll opacity-0"
                    data-animate={isClassic ? 'slide-in-right' : sectionAnim('event_details', 'reveal-right')}
                    style={isClassic ? { background: CREAM, border: `1px solid ${BORDER}` } : { background: theme.card, border: `1px solid ${BORDER}`, boxShadow: theme.cardShadow }}
                  >
                    <div className="flex items-center justify-center mb-4" style={{ color: GOLD }}>
                      <EventIcon icon={card.icon} />
                    </div>
                    <p className="font-sans-body text-xs tracking-[0.3em] uppercase mb-3" style={{ color: BROWN_LIGHT }}>
                      {card.title}
                    </p>
                    <p className="font-serif" style={{ fontSize: '1.2rem', color: BROWN_DARK, lineHeight: 1.5 }}>
                      {card.line1}
                    </p>
                    <p className="font-serif italic mt-1" style={{ fontSize: '1rem', color: BROWN_MID }}>
                      {card.line2}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {isSectionEnabled('gallery') && (
        <section id="gallery" className="py-0 reveal-on-scroll opacity-0" {...sectionAnimAttrs('gallery', 'reveal-fade')}>
          <WeddingGallery
            images={galleryImages}
            templateKey="classic_grid"
            animation={sectionAnim('gallery', 'reveal-fade')}
            animationDurationMs={sectionDuration('gallery')}
            animationDelayMs={sectionDelay('gallery')}
          />
        </section>
      )}

      {isSectionEnabled('programme') && (
        <section id="programme" className="px-6 py-20 text-center reveal-on-scroll opacity-0" {...sectionAnimAttrs('programme', 'reveal-fade')} style={{ background: CREAM, position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <h2 className="font-serif mb-12" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 300, color: GOLD }}>
              {content.programmeTitle}
            </h2>
            

            {isClassic ? (
              <div className="space-y-0">
                {content.programmeItems.map((item, i, arr) => (
                  <div
                    key={`${item.time}-${item.label}-${i}`}
                    className="relative flex items-start gap-6 pb-0 reveal-on-scroll opacity-0"
                    {...sectionAnimAttrsWithOffset('programme', sectionAnim('programme', 'reveal-up'), i * 120)}
                  >
                    {i < arr.length - 1 && (
                      <div
                        className="absolute top-10 w-px"
                        style={{
                          left: 'calc(6rem + 1.5rem + 0.75rem)',
                          height: 48,
                          background: BORDER,
                        }}
                      />
                    )}
                    <div className="flex-shrink-0 w-24 text-right" style={{ marginTop: 12 }}>
                      <span className="font-sans-body text-xs tracking-wide" style={{ color: BROWN_LIGHT, display: 'inline-block' }}>
                        {item.time}
                      </span>
                    </div>
                    <div
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
                      style={{ background: GOLD, color: '#fff', marginTop: 12 }}
                    >
                      <span style={{ transform: 'scale(0.65)', display: 'block' }}>
                        <ProgrammeIcon icon={item.icon} />
                      </span>
                    </div>
                    <div className="pb-10 text-left" style={{ marginTop: 12 }}>
                      <p className="font-serif" style={{ fontSize: '1.1rem', color: BROWN_DARK }}>
                        {item.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : isEditorial ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ maxWidth: 900, margin: '0 auto' }}>
                {content.programmeItems.map((item, i) => (
                  <div
                    key={`${item.time}-${item.label}-${i}`}
                    className="rounded-2xl p-5 text-left reveal-on-scroll opacity-0"
                    data-animate={sectionAnim('programme', 'reveal-right')}
                    style={{ background: theme.card, border: `1px solid ${BORDER}`, boxShadow: theme.cardShadow }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${GOLD}1f`, color: GOLD }}>
                        <ProgrammeIcon icon={item.icon} />
                      </div>
                      <span className="font-sans-body text-xs tracking-[0.15em] uppercase" style={{ color: BROWN_LIGHT }}>
                        {item.time}
                      </span>
                    </div>
                    <p className="font-serif" style={{ fontSize: '1.2rem', color: BROWN_DARK }}>
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-0" style={{ maxWidth: 520, margin: '0 auto' }}>
                {content.programmeItems.map((item, i, arr) => (
                  <div
                    key={`${item.time}-${item.label}-${i}`}
                    className="relative grid grid-cols-[74px_30px_1fr] items-start gap-4 pb-8 reveal-on-scroll opacity-0"
                    {...sectionAnimAttrsWithOffset('programme', sectionAnim('programme', 'reveal-up'), i * 140)}
                  >
                    <div className="text-right pt-0.5">
                      <span className="font-sans-body text-xs tracking-wide" style={{ color: BROWN_LIGHT, display: 'inline-block' }}>
                        {item.time}
                      </span>
                    </div>

                    <div className="relative flex justify-center">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center relative z-10"
                        style={{ background: GOLD, color: '#fff' }}
                      >
                        <span style={{ transform: 'scale(0.65)', display: 'block' }}>
                          <ProgrammeIcon icon={item.icon} />
                        </span>
                      </div>
                      {i < arr.length - 1 && (
                        <span
                          aria-hidden
                          className="absolute"
                          style={{ top: 28, left: '50%', transform: 'translateX(-50%)', width: 1, height: 54, background: '#DFC9A2' }}
                        />
                      )}
                    </div>

                    <div className="text-left pt-0.5">
                      <p className="font-serif" style={{ fontSize: '1.1rem', color: BROWN_DARK, lineHeight: 1.4 }}>
                        {item.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {isSectionEnabled('entourage') && (
        <section id="entourage" className="px-6 py-20 text-center reveal-on-scroll opacity-0" {...sectionAnimAttrs('entourage', 'reveal-fade')} style={{ background: CREAM }}>
          <div style={{ maxWidth: 980, margin: '0 auto' }}>
            <h2 className="font-serif mb-8" style={{ fontSize: 'clamp(1.9rem, 4vw, 3rem)', fontWeight: 300, color: GOLD }}>
              {content.entourageTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 items-start">
              <div className="text-center md:text-left">
                <div className="reveal-on-scroll opacity-0" {...sectionAnimAttrsWithOffset('entourage', sectionAnim('entourage', 'reveal-right'), 120)}>
                  <p className="font-sans-body text-sm uppercase mb-2" style={{ color: BROWN_LIGHT }}>Parents of the Groom</p>
                  {content.entourage.groomParents.map((name) => (
                    <p key={name} className={`font-serif ${isClassic ? 'font-semibold' : 'font-normal'}`} style={{ color: BROWN_DARK }}>
                      {name}
                    </p>
                  ))}
                </div>
              </div>
              <div className="text-center md:text-right">
                <div className="reveal-on-scroll opacity-0" {...sectionAnimAttrsWithOffset('entourage', sectionAnim('entourage', 'reveal-left'), 140)}>
                  <p className="font-sans-body text-sm uppercase mb-2" style={{ color: BROWN_LIGHT }}>Parents of the Bride</p>
                  {content.entourage.brideParents.map((name) => (
                    <p key={name} className={`font-serif ${isClassic ? 'font-semibold' : 'font-normal'}`} style={{ color: BROWN_DARK }}>
                      {name}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center mb-10 reveal-on-scroll opacity-0" {...sectionAnimAttrsWithOffset('entourage', sectionAnim('entourage', 'reveal-fade'), 160)}>
              <p className="font-sans-body text-sm tracking-wide uppercase mb-2" style={{ color: BROWN_LIGHT }}>Officiating Minister</p>
              <p className={`font-serif ${isClassic ? 'font-semibold' : 'font-normal'}`} style={{ color: BROWN_DARK, fontSize: '1.25rem' }}>
                {content.entourage.officiatingMinister}
              </p>
            </div>

            <div className="mb-10 reveal-on-scroll opacity-0" {...sectionAnimAttrsWithOffset('entourage', sectionAnim('entourage', 'reveal-fade'), 120)}>
              <p className="font-sans-body text-sm tracking-wide uppercase mb-6" style={{ color: BROWN_LIGHT }}>Principal Sponsors</p>

              <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
                <div className="text-center md:text-right reveal-on-scroll opacity-0" {...sectionAnimAttrsWithOffset('entourage', sectionAnim('entourage', 'reveal-right'), 180)}>
                  <div className="space-y-2">
                    {content.entourage.principalSponsorsMale.map((name) => (
                      <p key={name} className={`font-serif ${isClassic ? 'font-semibold' : 'font-normal'}`}>
                        {name}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="text-center md:text-left reveal-on-scroll opacity-0" {...sectionAnimAttrsWithOffset('entourage', sectionAnim('entourage', 'reveal-left'), 200)}>
                  <div className="space-y-2">
                    {content.entourage.principalSponsorsFemale.map((name) => (
                      <p key={name} className={`font-serif ${isClassic ? 'font-semibold' : 'font-normal'}`}>
                        {name}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center" style={{ color: BROWN_DARK }}>
              <p className="font-sans-body text-sm tracking-wide uppercase mb-6" style={{ color: BROWN_LIGHT }}>Secondary Sponsors</p>

              <div className="grid grid-cols-2 gap-8 max-w-3xl mx-auto mb-8">
                <div className="text-center md:text-left reveal-on-scroll opacity-0" {...sectionAnimAttrsWithOffset('entourage', sectionAnim('entourage', 'reveal-right'), 220)}>
                  <p className="font-sans-body text-sm uppercase" style={{ color: BROWN_LIGHT }}>Best Man</p>
                  <p className={`font-serif ${isClassic ? 'font-semibold' : 'font-normal'} mt-2`}>{content.entourage.bestMan}</p>

                  <p className="font-sans-body text-sm uppercase mt-6" style={{ color: BROWN_LIGHT }}>Groomsmen</p>
                  <div className="mt-2 space-y-1">
                    {content.entourage.groomsmen.map((name) => (
                      <p key={name} className={`font-serif ${isClassic ? 'font-semibold' : 'font-normal'}`}>
                        {name}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="text-center md:text-right reveal-on-scroll opacity-0" {...sectionAnimAttrsWithOffset('entourage', sectionAnim('entourage', 'reveal-left'), 240)}>
                  <p className="font-sans-body text-sm uppercase" style={{ color: BROWN_LIGHT }}>Maid of Honor</p>
                  <p className={`font-serif ${isClassic ? 'font-semibold' : 'font-normal'} mt-2`}>{content.entourage.maidOfHonor}</p>

                  <p className="font-sans-body text-sm uppercase mt-6" style={{ color: BROWN_LIGHT }}>Bridesmaid</p>
                  <div className="mt-2 space-y-1">
                    {content.entourage.bridesmaid.map((name) => (
                      <p key={name} className={`font-serif ${isClassic ? 'font-semibold' : 'font-normal'}`}>
                        {name}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                <div className="reveal-on-scroll opacity-0" {...sectionAnimAttrsWithOffset('entourage', sectionAnim('entourage', 'reveal-right'), 260)}>
                  <p className="font-sans-body text-sm uppercase" style={{ color: BROWN_LIGHT }}>Coin Bearer</p>
                  {content.entourage.coinBearer.map((name) => (
                    <p key={name} className={`font-serif ${isClassic ? 'font-semibold' : 'font-normal'} mt-2`}>
                      {name}
                    </p>
                  ))}
                </div>
                <div className="reveal-on-scroll opacity-0" {...sectionAnimAttrsWithOffset('entourage', sectionAnim('entourage', 'reveal-fade'), 280)}>
                  <p className="font-sans-body text-sm uppercase" style={{ color: BROWN_LIGHT }}>Bible Bearer</p>
                  {content.entourage.bibleBearer.map((name) => (
                    <p key={name} className={`font-serif ${isClassic ? 'font-semibold' : 'font-normal'} mt-2`}>
                      {name}
                    </p>
                  ))}
                </div>
                <div className="reveal-on-scroll opacity-0" {...sectionAnimAttrsWithOffset('entourage', sectionAnim('entourage', 'reveal-left'), 300)}>
                  <p className="font-sans-body text-sm uppercase" style={{ color: BROWN_LIGHT }}>Ring Bearer</p>
                  {content.entourage.ringBearer.map((name) => (
                    <p key={name} className={`font-serif ${isClassic ? 'font-semibold' : 'font-normal'} mt-2`}>
                      {name}
                    </p>
                  ))}
                </div>
              </div>

              <div className="mt-8 reveal-on-scroll opacity-0" {...sectionAnimAttrsWithOffset('entourage', sectionAnim('entourage', 'reveal-fade'), 320)}>
                <p className="font-sans-body text-sm uppercase" style={{ color: BROWN_LIGHT }}>Flower</p>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  {content.entourage.flower.map((name) => (
                    <p key={name} className={`font-serif ${isClassic ? 'font-semibold' : 'font-normal'}`}>
                      {name}
                    </p>
                  ))}
                </div>
              </div>

              <p className="font-serif italic mt-8" style={{ color: BROWN_MID, fontSize: '0.98rem' }}>
                {content.entourage.verse}
              </p>
            </div>
          </div>
        </section>
      )}

      {isSectionEnabled('venue') && (
        <section id="venue" className="overflow-hidden reveal-on-scroll opacity-0" {...sectionAnimAttrs('venue', 'reveal-fade')} style={{ background: CREAM_SECTION }}>
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ minHeight: 420 }}>
            <div className="relative reveal-on-scroll opacity-0" {...sectionAnimAttrsWithOffset('venue', sectionAnim('venue', 'reveal-left'), 340)} style={{ minHeight: 280 }}>
              <img src={content.venueImageUrl} alt="Wedding venue" className="w-full h-full object-contain" style={{ minHeight: 280, background: '#F7F0E4' }} />
              <div className="absolute inset-0" style={{ background: 'rgba(20,10,5,0.12)' }} />
            </div>
            <div className="flex flex-col justify-center px-8 md:px-14 py-14">
              <p className="font-sans-body text-xs tracking-[0.35em] uppercase mb-3" style={{ color: GOLD }}>
                {sectionName('venue', 'Venue')}
              </p>
              <h2 className="font-serif mb-4" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.3rem)', fontWeight: 300, color: BROWN_DARK }}>
                {content.venueTitle}
              </h2>
              <div className="mb-5" style={{ width: 48, height: 2, background: GOLD }} />
              <p className="font-sans-body mb-6 leading-relaxed" style={{ color: BROWN_MID, fontSize: '0.95rem' }}>
                {sectionText('venue', content.venueDescription)}
              </p>
              <div className="flex items-start gap-3 mb-3">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: GOLD }} />
                <div>
                  <p className="font-sans-body text-sm" style={{ color: BROWN_DARK }}>{content.venueAddressLine1}</p>
                  <p className="font-sans-body text-sm" style={{ color: BROWN_MID }}>{content.venueAddressLine2}</p>
                </div>
              </div>
              <a
                href={content.venueMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 font-sans-body text-sm tracking-wide transition-all duration-200"
                style={{ color: GOLD, textDecoration: 'underline', textUnderlineOffset: '4px' }}
              >
                View on Google Maps
              </a>
            </div>
          </div>
        </section>
      )}

      {isSectionEnabled('faq') && site.faqs.length > 0 && (
        <section id="faq" className="px-6 py-20 reveal-on-scroll opacity-0" {...sectionAnimAttrs('faq', 'reveal-fade')} style={{ background: CREAM_SECTION }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div className="text-center mb-10">
              <p className="font-sans-body text-xs tracking-[0.35em] uppercase mb-3" style={{ color: GOLD }}>
                {sectionName('faq', 'FAQ')}
              </p>
              <h2 className="font-serif" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 300, color: BROWN_DARK }}>
                Frequently Asked Questions
              </h2>
              {!!sectionText('faq') && (
                <p className="font-sans-body mt-3" style={{ color: BROWN_MID }}>
                  {sectionText('faq')}
                </p>
              )}
            </div>

            <div className="space-y-4">
              {site.faqs.map((faq) => (
                <details
                  key={faq.id}
                  className="rounded-2xl px-6 py-5 reveal-on-scroll opacity-0"
                  data-animate={sectionAnim('faq', 'reveal-up')}
                  style={{
                    background: theme.card,
                    border: `1px solid ${BORDER}`,
                    boxShadow: theme.cardShadow,
                  }}
                >
                  <summary
                    className="font-serif cursor-pointer list-none flex items-center justify-between gap-3"
                    style={{ color: BROWN_DARK, fontSize: '1.2rem' }}
                  >
                    <span>{faq.question}</span>
                    <span
                      aria-hidden
                      className="inline-flex items-center justify-center rounded-full"
                      style={{ width: 28, height: 28, border: `1px solid ${BORDER}`, color: '#C9A96E', fontSize: '1rem' }}
                    >
                      +
                    </span>
                  </summary>
                  <div style={{ height: 1, background: BORDER, opacity: 0.7, marginTop: 14, marginBottom: 14 }} />
                  <p className="font-sans-body" style={{ color: BROWN_MID, lineHeight: 1.75 }}>
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {isSectionEnabled('gift_registry') && (
        <section id="gift_registry" className="px-6 py-20 text-center reveal-on-scroll opacity-0" {...sectionAnimAttrs('gift_registry', 'reveal-fade')} style={{ background: CREAM_SECTION }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            {!isDuplicateHeading(sectionName('gift_registry', 'Gift Registry'), site.giftRegistry.title) && (
              <p className="font-sans-body text-xs tracking-[0.35em] uppercase mb-3" style={{ color: GOLD }}>
                {sectionName('gift_registry', 'Gift Registry')}
              </p>
            )}
            <h2 className="font-serif mb-4" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 300, color: GOLD }}>
              {site.giftRegistry.title}
            </h2>
            <p className="font-sans-body leading-relaxed" style={{ color: BROWN_MID }}>
              {sectionText('gift_registry', site.giftRegistry.description || 'Your presence is the best gift, but if you wish to bless us, we are grateful.')}
            </p>
          </div>
        </section>
      )}

      {isSectionEnabled('dress_code') && (
        <section id="dress_code" className="px-6 py-20 text-center reveal-on-scroll opacity-0" {...sectionAnimAttrs('dress_code', 'reveal-fade')} style={{ background: CREAM }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            {!isDuplicateHeading(sectionName('dress_code', 'Dress Code'), site.dressCode.title) && (
              <p className="font-sans-body text-xs tracking-[0.35em] uppercase mb-3" style={{ color: GOLD }}>
                {sectionName('dress_code', 'Dress Code')}
              </p>
            )}
            <h2 className="font-serif mb-4" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 300, color: GOLD }}>
              {site.dressCode.title}
            </h2>
            <p className="font-sans-body leading-relaxed" style={{ color: BROWN_MID }}>
              {sectionText('dress_code', site.dressCode.description || 'Formal attire is appreciated.')}
            </p>
            {site.dressCode.images.length > 0 && (
              <div
                className={[
                  'mt-8 gap-4',
                  site.dressCode.images.length === 1 ? 'grid grid-cols-1 max-w-sm mx-auto' : '',
                  site.dressCode.images.length === 2 ? 'grid grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto' : '',
                  site.dressCode.images.length >= 3 ? 'grid grid-cols-1 md:grid-cols-3' : '',
                ].join(' ')}
              >
                {site.dressCode.images.slice(0, 3).map((imageUrl, idx) => (
                  <div
                    key={`${imageUrl}-${idx}`}
                    className="rounded-2xl overflow-hidden reveal-on-scroll opacity-0"
                    data-animate={sectionAnim('dress_code', 'reveal-up')}
                    style={{ border: `1px solid ${BORDER}`, background: '#fff' }}
                  >
                    <img src={imageUrl} alt={`Dress code reference ${idx + 1}`} className="w-full h-44 object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {isSectionEnabled('rsvp') && (
        <section className="px-6 py-20 reveal-on-scroll opacity-0" {...sectionAnimAttrs('rsvp', 'reveal-fade')} style={{ background: CREAM }} id="rsvp">
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <div className="text-center mb-10">
              <p className="font-sans-body text-xs tracking-[0.35em] uppercase mb-3" style={{ color: GOLD }}>
                {sectionName('rsvp', 'RSVP')}
              </p>
              <h2 className="font-serif mb-4" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 300, color: GOLD }}>
                {content.rsvpTitle}
              </h2>
              <p className="font-sans-body text-sm" style={{ color: BROWN_LIGHT }}>
                {sectionText('rsvp', `Please RSVP by ${content.rsvpDeadlineLabel}`)}
              </p>
              <Divider gold={GOLD} />
            </div>

            <div className="rounded-2xl p-7 md:p-10" style={{ background: theme.card, border: `1px solid ${BORDER}`, boxShadow: theme.cardShadow }}>
              <RSVPForm coupleNames={`${content.brideName} & ${content.groomName}`} weddingId={site.wedding.id} />
            </div>
          </div>
        </section>
      )}

      <ScrollReveal />

      <footer className="px-6 py-14 text-center" style={{ background: BROWN_DARK }}>
        <h3 className="font-serif mb-3" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.6rem)', color: '#FFFDF9', fontWeight: 300 }}>
          {content.brideName} <span style={{ color: GOLD, fontStyle: 'italic' }}>&amp;</span> {content.groomName}
        </h3>
        <p className="font-serif italic mb-6" style={{ color: '#C4A882', fontSize: '1rem' }}>
          {content.weddingDateLabel} • {content.venueTitle}
        </p>
        <div className="flex items-center justify-center gap-3">
          <div style={{ width: 40, height: 1, background: GOLD, opacity: 0.4 }} />
          <Heart className="w-4 h-4" style={{ color: GOLD, fill: GOLD }} />
          <div style={{ width: 40, height: 1, background: GOLD, opacity: 0.4 }} />
        </div>
        <p className="font-sans-body text-xs mt-6" style={{ color: '#6B5744' }}>
          {content.footerMessage}
        </p>
      </footer>
    </main>
  );
}






