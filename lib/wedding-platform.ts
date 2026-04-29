import { createClient } from '@supabase/supabase-js';
import { defaultWeddingContent, defaultSectionConfigs, type WeddingContent } from '@/lib/cms-defaults';

type WeddingRow = {
  id: string;
  slug: string;
  title: string;
  theme_key?: string;
};

type CoupleRow = {
  bride_name: string;
  groom_name: string;
  bride_nickname: string;
  groom_nickname: string;
  bride_image: string;
  groom_image: string;
};

type DetailRow = {
  blessing_text: string;
  hero_subtitle: string;
  wedding_date_value?: string | null;
  ceremony_time_value?: string | null;
  wedding_date_label: string;
  wedding_time_label: string;
  event_day_label?: string;
  event_time_note?: string;
  event_location_label?: string;
  invitation_eyebrow: string;
  invitation_title: string;
  invitation_text: string;
  story_title: string;
  story_description: string;
  event_title: string;
  programme_title: string;
  venue_title: string;
  venue_description: string;
  venue_address_line1: string;
  venue_address_line2: string;
  map_link: string;
  hero_image_url: string;
  venue_image_url: string;
  rsvp_title: string;
  rsvp_deadline_label: string;
  footer_message: string;
  gift_registry_title: string;
  gift_registry_description: string;
  dress_code_title: string;
  dress_code_description: string;
  entourage_verse?: string;
};

type SectionRow = {
  section_key: string;
  name: string;
  is_enabled: boolean;
  sort_order: number;
  content_text?: string;
  animation?: string;
};

type EventRow = {
  event_name: string;
  date_label: string;
  time_label: string;
  location_label: string;
  icon: 'heart' | 'clock' | 'camera' | 'music' | 'utensils' | 'calendar' | 'map-pin';
  category: 'event_detail' | 'programme' | string;
  sort_order: number;
  is_visible: boolean;
};

type FaqRow = {
  id: string;
  question: string;
  answer: string;
  is_visible: boolean;
  sort_order: number;
};

type GalleryRow = {
  id: string;
  image_url: string;
  title: string;
  category: string;
  is_visible: boolean;
  sort_order: number;
};

type EntourageRow = {
  id: string;
  name: string;
  role: string;
  group_name: string;
  sort_order: number;
  is_visible: boolean;
};

export type WeddingSiteData = {
  wedding: WeddingRow;
  content: WeddingContent;
  sections: Record<string, boolean>;
  sectionConfig: Record<string, { content: string; animation: string }>;
  sectionList: SectionRow[];
  faqs: Array<{ id: string; question: string; answer: string; is_enabled: boolean; sort_order: number }>;
  gallery: Array<{ id: string; image_url: string; title: string; is_enabled: boolean; sort_order: number }>;
  giftRegistry: { title: string; description: string };
  dressCode: { title: string; description: string };
};

export function createPublicSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) return null;
  return createClient(supabaseUrl, supabaseAnonKey);
}

function getDefaultWedding(): WeddingRow {
  return {
    id: 'default',
    slug: process.env.NEXT_PUBLIC_DEFAULT_WEDDING_SLUG || 'claire-james',
    title: `${defaultWeddingContent.brideName} & ${defaultWeddingContent.groomName}`,
    theme_key: 'classic_grid',
  };
}

function toSectionMap(sectionRows: SectionRow[]): Record<string, boolean> {
  const base = defaultSectionConfigs.reduce<Record<string, boolean>>((acc, row) => {
    acc[row.key] = row.is_enabled;
    return acc;
  }, {});

  for (const row of sectionRows) {
    base[row.section_key] = row.is_enabled;
  }

  return base;
}

function toSectionConfigMap(sectionRows: SectionRow[]): Record<string, { content: string; animation: string }> {
  return sectionRows.reduce<Record<string, { content: string; animation: string }>>((acc, row) => {
    acc[row.section_key] = {
      content: row.content_text || '',
      animation: row.animation || 'reveal-fade',
    };
    return acc;
  }, {});
}

function buildContentFromRows(
  couple?: CoupleRow | null,
  details?: DetailRow | null,
  events: EventRow[] = [],
  gallery: GalleryRow[] = [],
  entourage: EntourageRow[] = [],
): WeddingContent {
  const parsedDate = details?.wedding_date_value ? new Date(`${details.wedding_date_value}T00:00:00`) : null;
  const weekdayFromDate =
    parsedDate && !Number.isNaN(parsedDate.getTime())
      ? parsedDate.toLocaleDateString('en-US', { weekday: 'long' })
      : '';
  const fullDateFromDate =
    parsedDate && !Number.isNaN(parsedDate.getTime())
      ? parsedDate.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })
      : '';

  const timeFromValue = (() => {
    const raw = (details?.ceremony_time_value || '').trim();
    const match = raw.match(/^(\d{1,2}):(\d{2})/);
    if (!match) return '';
    const hh = Number(match[1]);
    const mm = Number(match[2]);
    if (Number.isNaN(hh) || Number.isNaN(mm)) return '';
    const suffix = hh >= 12 ? 'PM' : 'AM';
    const h12 = hh % 12 === 0 ? 12 : hh % 12;
    return `Ceremony at ${h12}:${String(mm).padStart(2, '0')} ${suffix}`;
  })();

  const programmeEvents = events.filter((item) => item.is_visible);
  const visibleGallery = gallery.filter((item) => item.is_visible).sort((a, b) => a.sort_order - b.sort_order);

  const byGroup = (group: string) =>
    entourage
      .filter((item) => item.is_visible && item.group_name === group)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((item) => item.name);

  const firstRole = (role: string) =>
    entourage.find((item) => item.is_visible && item.role.toLowerCase() === role.toLowerCase())?.name || '';

  return {
    ...defaultWeddingContent,
    brideName: couple?.bride_name || defaultWeddingContent.brideName,
    groomName: couple?.groom_name || defaultWeddingContent.groomName,
    blessingText: details?.blessing_text || defaultWeddingContent.blessingText,
    heroSubtitle: details?.hero_subtitle || defaultWeddingContent.heroSubtitle,
    weddingDateLabel: details?.wedding_date_label || fullDateFromDate || defaultWeddingContent.weddingDateLabel,
    heroImageUrl: details?.hero_image_url || defaultWeddingContent.heroImageUrl,
    invitationEyebrow: details?.invitation_eyebrow || defaultWeddingContent.invitationEyebrow,
    invitationTitle: details?.invitation_title || defaultWeddingContent.invitationTitle,
    invitationText: details?.invitation_text || defaultWeddingContent.invitationText,
    eventTitle: details?.event_title || defaultWeddingContent.eventTitle,
    eventDetails: [
      {
        icon: 'calendar' as const,
        title: 'Date',
        line1: details?.event_day_label || weekdayFromDate,
        line2: details?.wedding_date_label || fullDateFromDate,
      },
      {
        icon: 'clock' as const,
        title: 'Time',
        line1: details?.wedding_time_label || timeFromValue,
        line2: details?.event_time_note || '',
      },
      {
        icon: 'map-pin' as const,
        title: 'Venue',
        line1: details?.venue_title || '',
        line2: details?.event_location_label || details?.venue_address_line2 || '',
      },
    ].filter((card) => card.line1 || card.line2),
    programmeTitle: details?.programme_title || defaultWeddingContent.programmeTitle,
    programmeItems:
      programmeEvents.length > 0
        ? programmeEvents
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((item) => ({
              time: item.time_label || item.date_label,
              label: item.event_name,
              icon: (['heart', 'clock', 'camera', 'music', 'utensils'].includes(item.icon)
                ? item.icon
                : 'heart') as 'heart' | 'clock' | 'camera' | 'music' | 'utensils',
            }))
        : [],
    galleryImages: visibleGallery.length > 0 ? visibleGallery.map((item) => item.image_url) : [],
    entourage: {
      ...defaultWeddingContent.entourage,
      groomParents: byGroup('groom_parents'),
      brideParents: byGroup('bride_parents'),
      officiatingMinister: firstRole('Officiating Minister'),
      principalSponsorsMale: byGroup('principal_sponsors_male'),
      principalSponsorsFemale: byGroup('principal_sponsors_female'),
      bestMan: byGroup('best_man')[0] || firstRole('Best Man'),
      groomsmen: byGroup('groomsmen'),
      maidOfHonor: byGroup('maid_of_honor')[0] || firstRole('Maid of Honor'),
      bridesmaid: byGroup('bridesmaid'),
      coinBearer: byGroup('coin_bearer'),
      bibleBearer: byGroup('bible_bearer'),
      ringBearer: byGroup('ring_bearer'),
      flower: byGroup('flower'),
      verse: details?.entourage_verse || defaultWeddingContent.entourage.verse,
    },
    venueTitle: details?.venue_title || defaultWeddingContent.venueTitle,
    venueDescription: details?.venue_description || defaultWeddingContent.venueDescription,
    venueAddressLine1: details?.venue_address_line1 || defaultWeddingContent.venueAddressLine1,
    venueAddressLine2: details?.venue_address_line2 || defaultWeddingContent.venueAddressLine2,
    venueMapUrl: details?.map_link || defaultWeddingContent.venueMapUrl,
    venueImageUrl: details?.venue_image_url || defaultWeddingContent.venueImageUrl,
    rsvpTitle: details?.rsvp_title || defaultWeddingContent.rsvpTitle,
    rsvpDeadlineLabel: details?.rsvp_deadline_label || defaultWeddingContent.rsvpDeadlineLabel,
    footerMessage: details?.footer_message || defaultWeddingContent.footerMessage,
  };
}

export async function getWeddingSiteData(slug?: string): Promise<WeddingSiteData> {
  const supabase = createPublicSupabaseClient();

  if (!supabase) {
    const defaultWedding = getDefaultWedding();
    return {
      wedding: defaultWedding,
      content: defaultWeddingContent,
      sections: toSectionMap([]),
      sectionConfig: {},
      sectionList: [],
      faqs: [],
      gallery: [],
      giftRegistry: { title: 'Gift Registry', description: '' },
      dressCode: { title: 'Dress Code', description: '' },
    };
  }

  const requestedSlug = (slug || process.env.NEXT_PUBLIC_DEFAULT_WEDDING_SLUG || 'claire-james').trim();

  let weddingRes = await supabase.from('weddings').select('*').eq('slug', requestedSlug).maybeSingle();
  if (!weddingRes.data && requestedSlug) {
    weddingRes = await supabase.from('weddings').select('*').ilike('slug', requestedSlug).limit(1).maybeSingle();
  }
  const wedding = (weddingRes.data as WeddingRow | null) || getDefaultWedding();

  if (!weddingRes.data) {
    return {
      wedding,
      content: defaultWeddingContent,
      sections: toSectionMap([]),
      sectionConfig: {},
      sectionList: [],
      faqs: [],
      gallery: [],
      giftRegistry: { title: 'Gift Registry', description: '' },
      dressCode: { title: 'Dress Code', description: '' },
    };
  }

  const [coupleRes, detailRes, sectionRes, eventRes, faqRes, galleryRes, entourageRes] = await Promise.all([
    supabase.from('wedding_couples').select('*').eq('wedding_id', wedding.id).maybeSingle(),
    supabase.from('wedding_details').select('*').eq('wedding_id', wedding.id).maybeSingle(),
    supabase.from('wedding_sections').select('*').eq('wedding_id', wedding.id).order('sort_order', { ascending: true }),
    supabase.from('wedding_events').select('*').eq('wedding_id', wedding.id).order('sort_order', { ascending: true }),
    supabase.from('wedding_faqs').select('*').eq('wedding_id', wedding.id).eq('is_visible', true).order('sort_order', { ascending: true }),
    supabase.from('wedding_gallery').select('*').eq('wedding_id', wedding.id).eq('is_visible', true).order('sort_order', { ascending: true }),
    supabase.from('wedding_entourage').select('*').eq('wedding_id', wedding.id).eq('is_visible', true).order('sort_order', { ascending: true }),
  ]);

  const details = detailRes.data as DetailRow | null;

  return {
    wedding,
    content: buildContentFromRows(
      (coupleRes.data as CoupleRow | null) || null,
      details,
      (eventRes.data || []) as EventRow[],
      (galleryRes.data || []) as GalleryRow[],
      (entourageRes.data || []) as EntourageRow[],
    ),
    sections: toSectionMap((sectionRes.data || []) as SectionRow[]),
    sectionConfig: toSectionConfigMap((sectionRes.data || []) as SectionRow[]),
    sectionList: (sectionRes.data || []) as SectionRow[],
    faqs: ((faqRes.data || []) as FaqRow[]).map((item) => ({
      id: item.id,
      question: item.question,
      answer: item.answer,
      is_enabled: item.is_visible,
      sort_order: item.sort_order,
    })),
    gallery: ((galleryRes.data || []) as GalleryRow[]).map((item) => ({
      id: item.id,
      image_url: item.image_url,
      title: item.title,
      is_enabled: item.is_visible,
      sort_order: item.sort_order,
    })),
    giftRegistry: {
      title: details?.gift_registry_title || 'Gift Registry',
      description: details?.gift_registry_description || '',
    },
    dressCode: {
      title: details?.dress_code_title || 'Dress Code',
      description: details?.dress_code_description || '',
    },
  };
}
