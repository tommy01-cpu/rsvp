import React from 'react';
import { Calendar, Clock, MapPin, Heart, Camera, Music, Utensils } from 'lucide-react';
import { getWeddingSiteData } from '@/lib/wedding-platform';
import InvitationPrintToolbar from '@/components/InvitationPrintToolbar';

type PrintPageProps = {
  params: { slug: string };
  searchParams?: { autoprint?: string; layout?: string };
};

const THEMES = {
  classic_grid: {
    gold: '#C9A96E',
    main: '#FDF8F0',
    section: '#FAF4EC',
    dark: '#2C1810',
    mid: '#6B5744',
    light: '#8B7355',
    border: '#E8D5B7',
  },
  masonry_moments: {
    gold: '#9C7A4B',
    main: '#F8F7F4',
    section: '#F0EFEA',
    dark: '#202224',
    mid: '#4E545A',
    light: '#6E747C',
    border: '#D7D5CF',
  },
  filmstrip_story: {
    gold: '#B88B5A',
    main: '#FCF4EA',
    section: '#F5E7D6',
    dark: '#3A2518',
    mid: '#6F4E37',
    light: '#8A6850',
    border: '#E2C7A8',
  },
  polaroid_cards: {
    gold: '#C68E88',
    main: '#FFF8F8',
    section: '#FDF0EE',
    dark: '#3E2A2B',
    mid: '#6F5557',
    light: '#8E6D70',
    border: '#ECCFCD',
  },
  spotlight_stack: {
    gold: '#B4975F',
    main: '#F7F3EA',
    section: '#EFE8DA',
    dark: '#2F2416',
    mid: '#5F4D36',
    light: '#7B664A',
    border: '#DDCBA8',
  },
} as const;

async function toPrintableImageSrc(input?: string): Promise<string> {
  const url = (input || '').trim();
  if (!url) return '';

  try {
    const res = await fetch(url, { cache: 'force-cache' });
    if (!res.ok) return url;

    const type = (res.headers.get('content-type') || '').toLowerCase();
    if (!type.startsWith('image/')) return url;

    const bytes = await res.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    return `data:${type};base64,${base64}`;
  } catch {
    return url;
  }
}

function cleanList(items: string[] | undefined): string[] {
  return (items || []).filter(Boolean);
}

function ProgrammeIcon({ icon }: { icon: 'heart' | 'clock' | 'camera' | 'music' | 'utensils' }) {
  const style = { width: 11, height: 11 } as const;
  if (icon === 'clock') return <Clock style={style} />;
  if (icon === 'camera') return <Camera style={style} />;
  if (icon === 'music') return <Music style={style} />;
  if (icon === 'utensils') return <Utensils style={style} />;
  return <Heart style={style} />;
}

export default async function WeddingPrintPage({ params, searchParams }: PrintPageProps) {
  const site = await getWeddingSiteData(params.slug);
  const content = site.content;

  const templateKey = (site.wedding.theme_key || 'classic_grid').trim() as keyof typeof THEMES;
  const theme = THEMES[templateKey] || THEMES.classic_grid;
  const GOLD = theme.gold;
  const CREAM = theme.main;
  const CREAM_SECTION = theme.section;
  const BROWN_DARK = theme.dark;
  const BROWN_MID = theme.mid;
  const BROWN_LIGHT = theme.light;
  const BORDER = theme.border;

  const autoPrint = searchParams?.autoprint === '1';
  const layout = (searchParams?.layout || '').toLowerCase();
  const isHalfLayout = layout === 'fold-half';
  const isFoldLayout = layout === 'fold' || isHalfLayout;

  const heroRawImage = content.heroImageUrl || site.gallery[0]?.image_url || content.venueImageUrl || '';
  const venueRawImage = content.venueImageUrl || '';
  const heroPrintImage = await toPrintableImageSrc(heroRawImage);
  const venuePrintImage = await toPrintableImageSrc(venueRawImage);
  const dateCard = content.eventDetails.find((item) => item.title.toLowerCase() === 'date');
  const timeCard = content.eventDetails.find((item) => item.title.toLowerCase() === 'time');
  const venueCard = content.eventDetails.find((item) => item.title.toLowerCase() === 'venue');

  const sectionText = (key: string, fallback = '') => (site.sectionConfig[key]?.content || '').trim() || fallback;
  const programmeTop = content.programmeItems || [];
  const sponsorMale = cleanList(content.entourage.principalSponsorsMale);
  const sponsorFemale = cleanList(content.entourage.principalSponsorsFemale);
  const groomsmen = cleanList(content.entourage.groomsmen);
  const bridesmaid = cleanList(content.entourage.bridesmaid);
  const groomParents = cleanList(content.entourage.groomParents);
  const brideParents = cleanList(content.entourage.brideParents);
  const coinBearer = cleanList(content.entourage.coinBearer);
  const bibleBearer = cleanList(content.entourage.bibleBearer);
  const ringBearer = cleanList(content.entourage.ringBearer);
  const flower = cleanList(content.entourage.flower);
  const sponsorCount = sponsorMale.length + sponsorFemale.length;
  const entourageCount =
    groomParents.length +
    brideParents.length +
    groomsmen.length +
    bridesmaid.length +
    coinBearer.length +
    bibleBearer.length +
    ringBearer.length +
    flower.length +
    (content.entourage.bestMan ? 1 : 0) +
    (content.entourage.maidOfHonor ? 1 : 0);
  const programmeCount = programmeTop.length;
  const denseMode = sponsorCount > 18 || entourageCount > 22 || programmeCount > 9;
  const compactMode = sponsorCount > 24 || entourageCount > 30 || programmeCount > 11;
  const insideScale = compactMode ? 0.9 : denseMode ? 0.95 : 1;
  const rightPanelLineCount =
    sponsorMale.length +
    sponsorFemale.length +
    groomParents.length +
    brideParents.length +
    groomsmen.length +
    bridesmaid.length +
    coinBearer.length +
    bibleBearer.length +
    ringBearer.length +
    flower.length +
    (content.entourage.bestMan ? 1 : 0) +
    (content.entourage.maidOfHonor ? 1 : 0);
  const wrapLines = (items: string[]) =>
    items.reduce((sum, value) => sum + Math.max(1, Math.ceil((value || '').trim().length / 22)), 0);
  const wrappedRightPanelLines =
    wrapLines(sponsorMale) +
    wrapLines(sponsorFemale) +
    wrapLines(groomParents) +
    wrapLines(brideParents) +
    wrapLines(groomsmen) +
    wrapLines(bridesmaid) +
    wrapLines(coinBearer) +
    wrapLines(bibleBearer) +
    wrapLines(ringBearer) +
    wrapLines(flower) +
    (content.entourage.bestMan ? Math.max(1, Math.ceil(content.entourage.bestMan.trim().length / 22)) : 0) +
    (content.entourage.maidOfHonor ? Math.max(1, Math.ceil(content.entourage.maidOfHonor.trim().length / 22)) : 0);
  const notesLineEstimate = Math.max(1, Math.ceil((content.entourage.verse || '').trim().length / 64));
  const totalRightPanelLines = wrappedRightPanelLines + notesLineEstimate + 20;
  const density = Math.max(0, Math.min(1, (totalRightPanelLines - 44) / 20));
  const nameSize = `${(0.98 - density * 0.14).toFixed(3)}rem`;
  const labelSize = `${(0.76 - density * 0.10).toFixed(3)}rem`;
  const lineGap = density > 0.65 ? 1 : density > 0.35 ? 2 : 3;

  const renderCoverSpread = () => (
    <div className="booklet-grid grid grid-cols-2">
      <article style={{ borderRight: `1px dashed ${BORDER}`, minHeight: 650, background: CREAM_SECTION, padding: 26 }}>
        <div style={{ color: BROWN_DARK, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <p className="font-sans-body" style={{ textTransform: 'uppercase', letterSpacing: '0.3em', fontSize: 11, color: GOLD }}>Venue</p>
            <h3 className="font-serif" style={{ fontSize: '2rem', fontWeight: 300, color: BROWN_DARK, lineHeight: 1.2 }}>{content.venueTitle}</h3>
            <p className="font-sans-body" style={{ color: BROWN_MID }}>{content.venueAddressLine1}</p>
            <p className="font-sans-body" style={{ color: BROWN_MID }}>{content.venueAddressLine2}</p>
            {venuePrintImage ? (
              <div style={{ marginTop: 14, border: `1px solid ${BORDER}`, padding: 6, maxWidth: '84%', background: CREAM }}>
                <img src={venuePrintImage} alt="Venue" style={{ width: '100%', height: 250, objectFit: 'cover', display: 'block' }} />
              </div>
            ) : null}
          </div>
          <p className="font-serif italic" style={{ color: BROWN_MID }}>{content.footerMessage}</p>
        </div>
      </article>

      <article style={{ position: 'relative', minHeight: 650, overflow: 'hidden' }}>
        {heroPrintImage ? (
          <img src={heroPrintImage} alt="Front cover" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : null}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(20,10,5,0.32), rgba(20,10,5,0.72))' }} />
        <div style={{ position: 'relative', zIndex: 2, color: '#FFFDF9', padding: 28, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p className="font-sans-body" style={{ textTransform: 'uppercase', letterSpacing: '0.35em', fontSize: 11, color: '#E8D5B7' }}>
            {sectionText('hero', content.blessingText)}
          </p>
          <h1 className="font-serif" style={{ fontSize: '3.3rem', fontWeight: 300, lineHeight: 1.06 }}>
            {content.brideName}
            <span style={{ color: GOLD, fontStyle: 'italic' }}> &amp; </span>
            {content.groomName}
          </h1>
          <p className="font-serif italic" style={{ color: '#E8D5B7', fontSize: '1.2rem' }}>{content.heroSubtitle}</p>
          <p className="font-serif" style={{ marginTop: 12, display: 'inline-block', alignSelf: 'center', padding: '8px 16px', border: `1.5px solid ${GOLD}`, borderRadius: 999, background: 'rgba(201, 169, 110, 0.14)' }}>
            {content.weddingDateLabel}
          </p>
        </div>
      </article>
    </div>
  );

  const renderInsideSpread = () => (
    <div
      className="booklet-grid grid grid-cols-2 print-scale-inside"
      style={
        insideScale < 1
          ? ({ '--inside-scale': String(insideScale) } as React.CSSProperties)
          : undefined
      }
    >
      <article style={{ borderRight: `1px dashed ${BORDER}`, padding: 22, background: CREAM, position: 'relative', height: '100%' }}>
        <p className="font-sans-body" style={{ textTransform: 'uppercase', letterSpacing: '0.3em', fontSize: 11, color: GOLD }}>
          {content.invitationEyebrow}
        </p>
        <h2 className="font-serif" style={{ color: BROWN_DARK, fontSize: '2rem', fontWeight: 300 }}>{content.invitationTitle}</h2>
        <p className="font-serif italic" style={{ color: BROWN_MID, lineHeight: denseMode ? 1.45 : 1.65, marginTop: 10, fontSize: denseMode ? '0.93rem' : '1rem' }}>
          {sectionText('invitation', content.invitationText)}
        </p>
        <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${BORDER}` }}>
          <h3 className="font-serif" style={{ color: BROWN_DARK, fontSize: '1.35rem', fontWeight: 300 }}>
            {content.eventTitle || 'Mark Your Calendar'}
          </h3>
          <div className="space-y-2 mt-2">
            <p className="font-sans-body" style={{ color: BROWN_MID }}>
              <strong>Date:</strong> {dateCard?.line1 || ''} {dateCard?.line2 || content.weddingDateLabel}
            </p>
            <p className="font-sans-body" style={{ color: BROWN_MID }}>
              <strong>Time:</strong> {timeCard?.line1 || ''} {timeCard?.line2 || ''}
            </p>
            <p className="font-sans-body" style={{ color: BROWN_MID }}>
              <strong>Venue:</strong> {venueCard?.line1 || content.venueTitle}
            </p>
          </div>
        </div>
        <div style={{ marginTop: 14, paddingTop: 10, borderTop: `1px solid ${BORDER}` }}>
          <p className="font-sans-body text-xs uppercase tracking-[0.2em]" style={{ color: BROWN_LIGHT, marginBottom: 4 }}>Programme</p>
          {programmeTop.length ? (
            programmeTop.map((item, i, arr) => (
              <div
                key={`${item.time}-${item.label}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '72px 24px 1fr',
                  alignItems: 'start',
                  gap: 8,
                  paddingBottom: i < arr.length - 1 ? 8 : 0,
                }}
              >
                <div style={{ textAlign: 'left', paddingTop: 1 }}>
                  <span className="font-sans-body" style={{ color: BROWN_LIGHT, fontSize: compactMode ? '0.75rem' : '0.82rem', letterSpacing: '0.02em' }}>
                    {item.time}
                  </span>
                </div>

                <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                  <span
                    aria-hidden
                    style={{
                      width: compactMode ? 14 : 16,
                      height: compactMode ? 14 : 16,
                      borderRadius: 999,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: GOLD,
                      color: '#fff',
                      position: 'relative',
                      zIndex: 2,
                    }}
                  >
                    <ProgrammeIcon icon={item.icon} />
                  </span>
                  {i < arr.length - 1 ? (
                    <span
                      aria-hidden
                      style={{
                        position: 'absolute',
                        top: compactMode ? 14 : 16,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 1,
                        height: 'calc(100% + 8px)',
                        background: BORDER,
                      }}
                    />
                  ) : null}
                </div>

                <p className="font-serif" style={{ color: BROWN_DARK, fontSize: compactMode ? '0.9rem' : '0.98rem', lineHeight: 1.3 }}>
                  {item.label}
                </p>
              </div>
            ))
          ) : (
            <p className="font-sans-body" style={{ color: BROWN_MID, fontSize: '0.93rem' }}>No programme items yet.</p>
          )}
        </div>
        <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 6, position: 'absolute', left: 22, right: 22, bottom: 0, background: CREAM }}>
          <p className="font-sans-body text-xs uppercase tracking-[0.2em]" style={{ color: BROWN_LIGHT, marginBottom: 2, fontSize: labelSize }}>Notes</p>
          <p className="font-serif italic" style={{ color: BROWN_MID, fontSize: compactMode ? '0.75rem' : '0.82rem', lineHeight: 1.3 }}>
            {content.entourage.verse || ' '}
          </p>
        </div>
      </article>

      <article
        style={{
          background: CREAM,
          position: 'relative',
          breakInside: 'avoid',
          pageBreakInside: 'avoid',
          minHeight: 650,
          height: '100%',
        }}
      >
        <div
          style={
            {
              padding: compactMode ? 16 : 22,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              gap: compactMode ? 8 : 12,
            } as React.CSSProperties
          }
        >
        <div>
          <p className="font-sans-body text-xs uppercase tracking-[0.2em]" style={{ color: BROWN_LIGHT, marginBottom: 6, fontSize: labelSize }}>
            Entourage
          </p>
          <div className="grid grid-cols-2 gap-4" style={{ columnGap: compactMode ? 10 : 16 }}>
            <div>
              <p className="font-sans-body text-xs uppercase tracking-[0.14em]" style={{ color: BROWN_LIGHT, fontSize: labelSize }}>Parents of Groom</p>
              {groomParents.map((name) => (
                <p key={name} className="font-serif" style={{ color: BROWN_DARK, fontSize: nameSize, lineHeight: 1.25, marginBottom: lineGap }}>{name}</p>
              ))}
            </div>
            <div>
              <p className="font-sans-body text-xs uppercase tracking-[0.14em]" style={{ color: BROWN_LIGHT, fontSize: labelSize }}>Parents of Bride</p>
              {brideParents.map((name) => (
                <p key={name} className="font-serif" style={{ color: BROWN_DARK, fontSize: nameSize, lineHeight: 1.25, marginBottom: lineGap }}>{name}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4" style={{ columnGap: compactMode ? 10 : 16 }}>
          <div>
            <p className="font-sans-body text-xs uppercase tracking-[0.14em]" style={{ color: BROWN_LIGHT, fontSize: labelSize }}>Best Man</p>
            {content.entourage.bestMan ? (
              <p className="font-serif" style={{ color: BROWN_DARK, fontSize: nameSize, lineHeight: 1.25, marginBottom: lineGap }}>{content.entourage.bestMan}</p>
            ) : <p className="font-sans-body" style={{ color: BROWN_MID, fontSize: '0.82rem' }}>No entries yet.</p>}
          </div>
          <div>
            <p className="font-sans-body text-xs uppercase tracking-[0.14em]" style={{ color: BROWN_LIGHT, fontSize: labelSize }}>Maid of Honor</p>
            {content.entourage.maidOfHonor ? (
              <p className="font-serif" style={{ color: BROWN_DARK, fontSize: nameSize, lineHeight: 1.25, marginBottom: lineGap }}>{content.entourage.maidOfHonor}</p>
            ) : <p className="font-sans-body" style={{ color: BROWN_MID, fontSize: '0.82rem' }}>No entries yet.</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4" style={{ columnGap: compactMode ? 10 : 16 }}>
          <div>
            <p className="font-sans-body text-xs uppercase tracking-[0.14em]" style={{ color: BROWN_LIGHT, fontSize: labelSize }}>Groomsmen</p>
            {groomsmen.map((name) => (
              <p key={name} className="font-serif" style={{ color: BROWN_DARK, fontSize: nameSize, lineHeight: 1.25, marginBottom: lineGap }}>{name}</p>
            ))}
          </div>
          <div>
            <p className="font-sans-body text-xs uppercase tracking-[0.14em]" style={{ color: BROWN_LIGHT, fontSize: labelSize }}>Bridesmaid</p>
            {bridesmaid.map((name) => (
              <p key={name} className="font-serif" style={{ color: BROWN_DARK, fontSize: nameSize, lineHeight: 1.25, marginBottom: lineGap }}>{name}</p>
            ))}
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 10 }}>
          <div className="grid grid-cols-2 gap-4 mt-1" style={{ columnGap: compactMode ? 10 : 16 }}>
            <div>
              <p className="font-sans-body text-xs uppercase tracking-[0.2em]" style={{ color: BROWN_LIGHT, marginBottom: 4, fontSize: labelSize }}>
                Principal Sponsors (Male)
              </p>
              {sponsorMale.map((name) => (
                <p key={name} className="font-serif" style={{ color: BROWN_DARK, fontSize: nameSize, lineHeight: 1.25, marginBottom: lineGap }}>
                  {name}
                </p>
              ))}
              {!sponsorMale.length ? <p className="font-sans-body" style={{ color: BROWN_MID, fontSize: '0.82rem' }}>No entries yet.</p> : null}
            </div>
            <div>
              <p className="font-sans-body text-xs uppercase tracking-[0.2em]" style={{ color: BROWN_LIGHT, marginBottom: 4, fontSize: labelSize }}>
                Principal Sponsors (Female)
              </p>
              {sponsorFemale.map((name) => (
                <p key={name} className="font-serif" style={{ color: BROWN_DARK, fontSize: nameSize, lineHeight: 1.25, marginBottom: lineGap }}>
                  {name}
                </p>
              ))}
              {!sponsorFemale.length ? <p className="font-sans-body" style={{ color: BROWN_MID, fontSize: '0.82rem' }}>No entries yet.</p> : null}
            </div>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 10 }}>
          <div className="grid grid-cols-2 gap-4" style={{ columnGap: compactMode ? 10 : 16 }}>
            <div>
              <p className="font-sans-body text-xs uppercase tracking-[0.14em]" style={{ color: BROWN_LIGHT, fontSize: labelSize }}>Coin Bearer</p>
              {coinBearer.map((name) => (
                <p key={name} className="font-serif" style={{ color: BROWN_DARK, fontSize: nameSize, lineHeight: 1.25, marginBottom: lineGap }}>{name}</p>
              ))}
            </div>
            <div>
              <p className="font-sans-body text-xs uppercase tracking-[0.14em]" style={{ color: BROWN_LIGHT, fontSize: labelSize }}>Bible Bearer</p>
              {bibleBearer.map((name) => (
                <p key={name} className="font-serif" style={{ color: BROWN_DARK, fontSize: nameSize, lineHeight: 1.25, marginBottom: lineGap }}>{name}</p>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 10 }}>
          <div className="grid grid-cols-2 gap-4" style={{ columnGap: compactMode ? 10 : 16 }}>
            <div>
              <p className="font-sans-body text-xs uppercase tracking-[0.14em]" style={{ color: BROWN_LIGHT, fontSize: labelSize }}>Ring Bearer</p>
              {ringBearer.map((name) => (
                <p key={name} className="font-serif" style={{ color: BROWN_DARK, fontSize: nameSize, lineHeight: 1.25, marginBottom: lineGap }}>{name}</p>
              ))}
            </div>
            <div>
              <p className="font-sans-body text-xs uppercase tracking-[0.14em]" style={{ color: BROWN_LIGHT, fontSize: labelSize }}>Flower</p>
              {flower.map((name) => (
                <p key={name} className="font-serif" style={{ color: BROWN_DARK, fontSize: nameSize, lineHeight: 1.25, marginBottom: lineGap }}>{name}</p>
              ))}
            </div>
          </div>
        </div>
        </div>
      </article>
    </div>
  );

  return (
    <div style={{ background: CREAM, minHeight: '100vh' }}>
      <style>{`
        @page {
          size: A4 ${isFoldLayout ? 'landscape' : 'portrait'};
          margin: 6mm;
        }
        @media print {
          .print-hidden { display: none !important; }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body { background: #fff !important; }
          .print-sheet {
            box-shadow: none !important;
            border: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          .avoid-break {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          .booklet-side {
            break-after: page;
            page-break-after: always;
            height: calc(210mm - 12mm);
            overflow: hidden;
          }
          .booklet-side:last-child {
            break-after: auto;
            page-break-after: auto;
          }
          .booklet-grid {
            height: calc(210mm - 12mm);
            min-height: calc(210mm - 12mm);
            align-items: stretch;
          }
          .half-stack {
            display: grid;
            grid-template-rows: 1fr 1fr;
            gap: 3mm;
            min-height: 196mm;
            padding: 3mm;
          }
          .half-copy-frame {
            position: relative;
            overflow: hidden;
            border: 1px solid ${BORDER};
            background: ${CREAM};
          }
          .half-copy-scale {
            position: absolute;
            inset: 0;
            width: 200%;
            height: 200%;
            transform: scale(0.5);
            transform-origin: top left;
          }
          .print-scale-inside {
            zoom: var(--inside-scale, 1);
            transform-origin: top left;
          }
        }
      `}</style>

      <InvitationPrintToolbar slug={params.slug} autoPrint={autoPrint} />

      {!isFoldLayout ? (
        <main
          className="print-sheet"
          style={{
            maxWidth: 900,
            margin: '16px auto',
            background: CREAM,
            border: `1px solid ${BORDER}`,
            boxShadow: '0 6px 28px rgba(44,24,16,0.08)',
          }}
        >
          <section
            style={{
              position: 'relative',
              minHeight: 260,
              overflow: 'hidden',
              borderBottom: `1px solid ${BORDER}`,
            }}
            className="avoid-break"
          >
            {heroPrintImage ? (
              <img
                src={heroPrintImage}
                alt={`${content.brideName} and ${content.groomName}`}
                loading="eager"
                style={{ width: '100%', height: 260, objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <div style={{ width: '100%', height: 260, background: CREAM_SECTION }} />
            )}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, rgba(20,10,5,0.35) 0%, rgba(20,10,5,0.68) 100%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: 16,
              }}
            >
              <div style={{ color: '#FFFDF9', maxWidth: 720 }}>
                <p className="font-sans-body" style={{ textTransform: 'uppercase', letterSpacing: '0.3em', fontSize: 10, color: '#E8D5B7' }}>
                  {sectionText('hero', content.blessingText)}
                </p>
                <h1 className="font-serif" style={{ fontSize: '3rem', fontWeight: 300, lineHeight: 1.05 }}>
                  {content.brideName}
                  <span style={{ color: GOLD, fontStyle: 'italic' }}> &amp; </span>
                  {content.groomName}
                </h1>
                <p className="font-serif italic" style={{ color: '#E8D5B7', fontSize: '1rem' }}>
                  {content.heroSubtitle}
                </p>
                <p
                  className="font-serif"
                  style={{
                    marginTop: 8,
                    display: 'inline-block',
                    padding: '6px 14px',
                    borderRadius: 999,
                    border: `1.5px solid ${GOLD}`,
                    background: 'rgba(201, 169, 110, 0.14)',
                  }}
                >
                  {content.weddingDateLabel}
                </p>
              </div>
            </div>
          </section>

          <section className="avoid-break" style={{ padding: 18, background: CREAM }}>
            <p className="font-sans-body" style={{ textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.3em', fontSize: 11, color: GOLD }}>
              {content.invitationEyebrow}
            </p>
            <h2 className="font-serif" style={{ textAlign: 'center', color: BROWN_DARK, fontSize: '2rem', fontWeight: 300, lineHeight: 1.2 }}>
              {content.invitationTitle}
            </h2>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, margin: '12px 0' }}>
              <div style={{ width: 48, height: 1, background: GOLD, opacity: 0.45 }} />
              <Heart style={{ width: 12, height: 12, color: GOLD, fill: GOLD }} />
              <div style={{ width: 48, height: 1, background: GOLD, opacity: 0.45 }} />
            </div>
            <p className="font-serif italic" style={{ color: BROWN_MID, lineHeight: 1.58, textAlign: 'center', fontSize: '1.02rem', maxWidth: 760, margin: '0 auto' }}>
              {sectionText('invitation', content.invitationText)}
            </p>
          </section>

          <section className="avoid-break" style={{ padding: 18, background: CREAM_SECTION, borderTop: `1px solid ${BORDER}` }}>
            <h3 className="font-serif" style={{ textAlign: 'center', color: BROWN_DARK, fontSize: '1.6rem', fontWeight: 300, marginBottom: 12 }}>
              {content.eventTitle || 'Mark Your Calendar'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div style={{ background: CREAM, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 12, textAlign: 'center' }}>
                <Calendar className="mx-auto mb-2" style={{ color: GOLD }} />
                <p className="font-sans-body" style={{ color: BROWN_LIGHT, textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: 11 }}>Date</p>
                <p className="font-serif" style={{ color: BROWN_DARK, fontSize: '1.05rem' }}>{content.eventDetails[0]?.line1 || content.weddingDateLabel}</p>
                <p className="font-serif italic" style={{ color: BROWN_MID }}>{content.eventDetails[0]?.line2 || content.weddingDateLabel}</p>
              </div>
              <div style={{ background: CREAM, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 12, textAlign: 'center' }}>
                <Clock className="mx-auto mb-2" style={{ color: GOLD }} />
                <p className="font-sans-body" style={{ color: BROWN_LIGHT, textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: 11 }}>Time</p>
                <p className="font-serif" style={{ color: BROWN_DARK, fontSize: '1.05rem' }}>{content.eventDetails[1]?.line1 || ''}</p>
                <p className="font-serif italic" style={{ color: BROWN_MID }}>{content.eventDetails[1]?.line2 || ''}</p>
              </div>
              <div style={{ background: CREAM, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 12, textAlign: 'center' }}>
                <MapPin className="mx-auto mb-2" style={{ color: GOLD }} />
                <p className="font-sans-body" style={{ color: BROWN_LIGHT, textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: 11 }}>Venue</p>
                <p className="font-serif" style={{ color: BROWN_DARK, fontSize: '1.05rem' }}>{content.venueTitle}</p>
                <p className="font-serif italic" style={{ color: BROWN_MID }}>{content.venueAddressLine2}</p>
              </div>
            </div>
          </section>

          <footer style={{ padding: 12, textAlign: 'center', borderTop: `1px solid ${BORDER}`, background: CREAM }}>
            <p className="font-sans-body" style={{ color: BROWN_LIGHT }}>{content.venueAddressLine1}</p>
            <p className="font-sans-body" style={{ color: BROWN_LIGHT }}>{content.venueAddressLine2}</p>
            <p className="font-serif italic" style={{ marginTop: 8, color: BROWN_MID }}>{content.footerMessage}</p>
          </footer>
        </main>
      ) : (
        <main className="print-sheet" style={{ maxWidth: 1200, margin: '16px auto', display: 'grid', gap: 12 }}>
          <p className="print-hidden text-sm" style={{ color: BROWN_MID }}>
            Folded Mode: print duplex (back-to-back) on A4 landscape. Recommended printer setting: flip on short edge.
          </p>

          <section className="booklet-side" style={{ background: CREAM, border: `1px solid ${BORDER}` }}>
            {isHalfLayout ? (
              <div className="half-stack">
                <div className="half-copy-frame">
                  <div className="half-copy-scale">{renderCoverSpread()}</div>
                </div>
                <div className="half-copy-frame">
                  <div className="half-copy-scale">{renderCoverSpread()}</div>
                </div>
              </div>
            ) : (
              renderCoverSpread()
            )}
          </section>

          <section className="booklet-side" style={{ background: CREAM, border: `1px solid ${BORDER}` }}>
            {isHalfLayout ? (
              <div className="half-stack">
                <div className="half-copy-frame">
                  <div className="half-copy-scale">{renderInsideSpread()}</div>
                </div>
                <div className="half-copy-frame">
                  <div className="half-copy-scale">{renderInsideSpread()}</div>
                </div>
              </div>
            ) : (
              renderInsideSpread()
            )}
          </section>
        </main>
      )}
    </div>
  );
}
