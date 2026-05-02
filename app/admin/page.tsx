'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { usePathname, useRouter } from 'next/navigation';
import { Download, LogOut, Save, Trash2, Upload, Plus, Printer } from 'lucide-react';

type WeddingRow = { id: string; slug: string; title: string; theme_key?: string };
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
  wedding_date_value: string;
  ceremony_time_value: string;
  wedding_date_label: string;
  wedding_time_label: string;
  event_day_label: string;
  event_time_note: string;
  event_location_label: string;
  invitation_eyebrow: string;
  invitation_title: string;
  invitation_text: string;
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
  dress_code_image_1: string;
  dress_code_image_2: string;
  dress_code_image_3: string;
  dress_code_image_1_visible: boolean;
  dress_code_image_2_visible: boolean;
  dress_code_image_3_visible: boolean;
  entourage_verse: string;
  invitation_link: string;
};
type SectionRow = {
  id: string;
  section_key: string;
  name: string;
  is_enabled: boolean;
  sort_order: number;
  content_text: string;
  animation: string;
  animation_duration_ms: number;
  animation_delay_ms: number;
};
type FaqRow = { id: string; question: string; answer: string; is_visible: boolean; sort_order: number };
type GalleryRow = { id: string; title: string; image_url: string; category: string; is_visible: boolean; sort_order: number };
type RSVPRow = {
  id: string;
  guest_name: string;
  email: string;
  phone: string;
  attending: boolean;
  number_of_guests: number;
  message: string;
  meal_preference: string;
  created_at: string;
};
type EventRow = {
  id: string;
  event_name: string;
  date_label: string;
  time_label: string;
  location_label: string;
  icon: string;
  category: string;
  sort_order: number;
  is_visible: boolean;
};
type EntourageRow = {
  id: string;
  name: string;
  role: string;
  group_name: string;
  sort_order: number;
  is_visible: boolean;
};
type CmsUserRow = {
  id: string;
  wedding_id: string;
  username: string;
  password: string;
  created_at: string;
  updated_at: string;
};
type AccessScope = {
  role: 'admin' | 'editor';
  username: string;
  wedding_id: string | null;
};
type ImageMeta = {
  width: number;
  height: number;
};
type DressCodeSlot = 1 | 2 | 3;
type ContentImageSlot = 'hero' | 'venue';
type CoupleImageSlot = 'bride' | 'groom';

const DEFAULT_COUPLE: CoupleRow = {
  bride_name: '',
  groom_name: '',
  bride_nickname: '',
  groom_nickname: '',
  bride_image: '',
  groom_image: '',
};

const DEFAULT_DETAILS: DetailRow = {
  blessing_text: '',
  hero_subtitle: '',
  wedding_date_value: '',
  ceremony_time_value: '',
  wedding_date_label: '',
  wedding_time_label: '',
  event_day_label: '',
  event_time_note: '',
  event_location_label: '',
  invitation_eyebrow: '',
  invitation_title: '',
  invitation_text: '',
  event_title: '',
  programme_title: '',
  venue_title: '',
  venue_description: '',
  venue_address_line1: '',
  venue_address_line2: '',
  map_link: '',
  hero_image_url: '',
  venue_image_url: '',
  rsvp_title: 'Kindly Reply',
  rsvp_deadline_label: '',
  footer_message: '',
  gift_registry_title: 'Gift Registry',
  gift_registry_description: '',
  dress_code_title: 'Dress Code',
  dress_code_description: '',
  dress_code_image_1: '',
  dress_code_image_2: '',
  dress_code_image_3: '',
  dress_code_image_1_visible: true,
  dress_code_image_2_visible: true,
  dress_code_image_3_visible: true,
  entourage_verse: '',
  invitation_link: '',
};

const SECTION_KEYS = [
  { key: 'hero_title', label: 'Hero Title' },
  { key: 'hero_subtitle', label: 'Hero Subtitle' },
  { key: 'hero_couple_text', label: 'Hero Couple Text' },
  { key: 'invitation', label: 'Invitation' },
  { key: 'couple_info', label: 'Couple Info' },
  { key: 'story', label: 'Story' },
  { key: 'venue', label: 'Venue' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'faq', label: 'FAQ' },
  { key: 'entourage', label: 'Entourage' },
  { key: 'rsvp', label: 'RSVP' },
  { key: 'gift_registry', label: 'Gift Registry' },
  { key: 'dress_code', label: 'Dress Code' },
  { key: 'event_details', label: 'Event Details' },
  { key: 'programme', label: 'Programme' },
];

const SECTION_DISPLAY_ORDER: Record<string, number> = SECTION_KEYS.reduce<Record<string, number>>((acc, item, idx) => {
  acc[item.key] = idx;
  return acc;
}, {});

const ANIMATION_OPTIONS = [
  'reveal-fade',
  'reveal-up',
  'reveal-left',
  'reveal-right',
  'zoom-in',
  'reveal-blur-up',
  'reveal-rotate-in',
  'reveal-flip-up',
  'reveal-fall-letters',
  'reveal-image-rise',
  'reveal-image-zoom',
];

const LEGACY_ANIMATION_MAP: Record<string, string> = {
  'animate-fade-in-up': 'reveal-up',
  'animate-fade-in': 'reveal-fade',
  'slide-in-left': 'reveal-left',
  'slide-in-right': 'reveal-right',
};

const EVENT_ICON_OPTIONS = ['heart', 'clock', 'camera', 'music', 'utensils', 'calendar', 'map-pin'];
const ENTOURAGE_GROUP_OPTIONS = [
  'groom_parents',
  'bride_parents',
  'officiating_official',
  'best_man',
  'maid_of_honor',
  'principal_sponsors_male',
  'principal_sponsors_female',
  'groomsmen',
  'bridesmaid',
  'coin_bearer',
  'bible_bearer',
  'ring_bearer',
  'flower',
];

const formatSelectLabel = (value: string) =>
  value
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

const TEMPLATE_OPTIONS = [
  { key: 'classic_grid', label: 'Champagne Gold' },
  { key: 'masonry_moments', label: 'Taupe Stone' },
  { key: 'filmstrip_story', label: 'Warm Terracotta' },
  { key: 'polaroid_cards', label: 'Rose Blush' },
  { key: 'spotlight_stack', label: 'Olive Bronze' },
];

export default function AdminPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'success' | 'error'>('success');
  const [tab, setTab] = useState<'preview' | 'core' | 'sections' | 'events' | 'entourage' | 'faq' | 'gallery' | 'rsvps' | 'users'>('preview');
  const [previewVersion, setPreviewVersion] = useState(0);

  const [weddings, setWeddings] = useState<WeddingRow[]>([]);
  const [selectedWeddingId, setSelectedWeddingId] = useState('');
  const [couple, setCouple] = useState<CoupleRow>(DEFAULT_COUPLE);
  const [details, setDetails] = useState<DetailRow>(DEFAULT_DETAILS);
  const [sections, setSections] = useState<SectionRow[]>([]);
  const [faqs, setFaqs] = useState<FaqRow[]>([]);
  const [gallery, setGallery] = useState<GalleryRow[]>([]);
  const [rsvps, setRsvps] = useState<RSVPRow[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [entourageMembers, setEntourageMembers] = useState<EntourageRow[]>([]);
  const [userAccounts, setUserAccounts] = useState<CmsUserRow[]>([]);
  const [accessScope, setAccessScope] = useState<AccessScope>({ role: 'admin', username: '', wedding_id: null });

  const [newWedding, setNewWedding] = useState({ slug: '', title: '' });
  const [editWedding, setEditWedding] = useState({ slug: '', title: '' });
  const [newUser, setNewUser] = useState({ wedding_id: '', username: '', password: '' });
  const [heroMeta, setHeroMeta] = useState<ImageMeta | null>(null);
  const [venueMeta, setVenueMeta] = useState<ImageMeta | null>(null);
  const [printPreset, setPrintPreset] = useState<'normal' | 'fold' | 'fold-half'>('normal');
  const [pendingDressCodeFiles, setPendingDressCodeFiles] = useState<Partial<Record<DressCodeSlot, File>>>({});
  const [dressCodePreviewUrls, setDressCodePreviewUrls] = useState<Partial<Record<DressCodeSlot, string>>>({});
  const [pendingContentFiles, setPendingContentFiles] = useState<Partial<Record<ContentImageSlot, File>>>({});
  const [contentPreviewUrls, setContentPreviewUrls] = useState<Partial<Record<ContentImageSlot, string>>>({});
  const [pendingCoupleFiles, setPendingCoupleFiles] = useState<Partial<Record<CoupleImageSlot, File>>>({});
  const [couplePreviewUrls, setCouplePreviewUrls] = useState<Partial<Record<CoupleImageSlot, string>>>({});
  const [newGalleryDraft, setNewGalleryDraft] = useState<{ file: File | null; previewUrl: string; title: string; is_visible: boolean }>({
    file: null,
    previewUrl: '',
    title: '',
    is_visible: true,
  });
  const [sectionTimingDrafts, setSectionTimingDrafts] = useState<Record<string, { duration?: string; delay?: string }>>({});
  const [savedSnapshot, setSavedSnapshot] = useState('');
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [newEvent, setNewEvent] = useState({
    event_name: '',
    time_label: '',
    icon: 'heart',
  });
  const [newEntourage, setNewEntourage] = useState({
    name: '',
    role: '',
    group_name: 'groomsmen',
    sort_order: 10,
  });

  const selectedWedding = weddings.find((w) => w.id === selectedWeddingId) || null;
  const buildSnapshot = (input?: {
    couple?: CoupleRow;
    details?: DetailRow;
    sections?: SectionRow[];
    faqs?: FaqRow[];
    gallery?: GalleryRow[];
    events?: EventRow[];
    entourage?: EntourageRow[];
  }) => {
    const c = input?.couple || couple;
    const d = input?.details || details;
    const s = (input?.sections || sections).map((row) => ({
      id: row.id,
      section_key: row.section_key,
      is_enabled: row.is_enabled,
      sort_order: row.sort_order,
      content_text: row.content_text,
      animation: row.animation,
      animation_duration_ms: row.animation_duration_ms,
      animation_delay_ms: row.animation_delay_ms,
    }));
    const f = (input?.faqs || faqs).map((row) => ({
      id: row.id,
      question: row.question,
      answer: row.answer,
      is_visible: row.is_visible,
      sort_order: row.sort_order,
    }));
    const g = (input?.gallery || gallery).map((row) => ({
      id: row.id,
      title: row.title,
      image_url: row.image_url,
      is_visible: row.is_visible,
      sort_order: row.sort_order,
    }));
    const e = (input?.events || events).map((row) => ({
      id: row.id,
      event_name: row.event_name,
      time_label: row.time_label,
      icon: row.icon,
      is_visible: row.is_visible,
      sort_order: row.sort_order,
    }));
    const m = (input?.entourage || entourageMembers).map((row) => ({
      id: row.id,
      name: row.name,
      role: row.role,
      group_name: row.group_name,
      sort_order: row.sort_order,
      is_visible: row.is_visible,
    }));
    return JSON.stringify({
      selectedWeddingId,
      couple: c,
      details: d,
      sections: s,
      faqs: f,
      gallery: g,
      events: e,
      entourage: m,
      pendingDressCodeFiles: Object.keys(pendingDressCodeFiles).sort(),
      pendingContentFiles: Object.keys(pendingContentFiles).sort(),
      pendingCoupleFiles: Object.keys(pendingCoupleFiles).sort(),
      hasDraftGallery: Boolean(newGalleryDraft.file),
      newGalleryDraftTitle: newGalleryDraft.title,
      newGalleryDraftVisible: newGalleryDraft.is_visible,
    });
  };
  const currentSnapshot = useMemo(
    () => buildSnapshot(),
    [
      selectedWeddingId,
      couple,
      details,
      sections,
      faqs,
      gallery,
      events,
      entourageMembers,
      pendingDressCodeFiles,
      pendingContentFiles,
      pendingCoupleFiles,
      newGalleryDraft.file,
      newGalleryDraft.title,
      newGalleryDraft.is_visible,
    ],
  );
  const hasUnsavedChanges = Boolean(savedSnapshot) && currentSnapshot !== savedSnapshot;
  const dirtyFieldLabels = useMemo(() => {
    if (!savedSnapshot || !hasUnsavedChanges) return [] as string[];
    try {
      const saved = JSON.parse(savedSnapshot) as Record<string, unknown>;
      const dirty: string[] = [];
      const check = (label: string, a: unknown, b: unknown) => {
        if (JSON.stringify(a) !== JSON.stringify(b)) dirty.push(label);
      };
      check('Couple Info', (saved as any).couple, couple);
      check('Core Details', (saved as any).details, details);
      check('Sections', (saved as any).sections, sections.map((row) => ({
        id: row.id,
        section_key: row.section_key,
        is_enabled: row.is_enabled,
        sort_order: row.sort_order,
        content_text: row.content_text,
        animation: row.animation,
      })));
      check('Programme', (saved as any).events, events.map((row) => ({
        id: row.id,
        event_name: row.event_name,
        time_label: row.time_label,
        icon: row.icon,
        is_visible: row.is_visible,
        sort_order: row.sort_order,
      })));
      check('Entourage', (saved as any).entourage, entourageMembers.map((row) => ({
        id: row.id,
        name: row.name,
        role: row.role,
        group_name: row.group_name,
        sort_order: row.sort_order,
        is_visible: row.is_visible,
      })));
      check('FAQs', (saved as any).faqs, faqs.map((row) => ({
        id: row.id,
        question: row.question,
        answer: row.answer,
        is_visible: row.is_visible,
        sort_order: row.sort_order,
      })));
      check('Gallery Items', (saved as any).gallery, gallery.map((row) => ({
        id: row.id,
        title: row.title,
        image_url: row.image_url,
        is_visible: row.is_visible,
        sort_order: row.sort_order,
      })));
      if (Object.keys(pendingContentFiles).length > 0) dirty.push('Hero/Venue Draft Uploads');
      if (Object.keys(pendingCoupleFiles).length > 0) dirty.push('Couple Draft Uploads');
      if (Object.keys(pendingDressCodeFiles).length > 0) dirty.push('Dress Code Draft Uploads');
      if (newGalleryDraft.file) dirty.push('New Gallery Draft');
      return Array.from(new Set(dirty));
    } catch {
      return ['Unsaved changes'];
    }
  }, [savedSnapshot, hasUnsavedChanges, couple, details, sections, events, entourageMembers, faqs, gallery, pendingContentFiles, pendingCoupleFiles, pendingDressCodeFiles, newGalleryDraft.file]);
  const dirtyLabelSet = useMemo(() => new Set(dirtyFieldLabels), [dirtyFieldLabels]);
  const hasDirtyLabel = (label: string) => dirtyLabelSet.has(label);
  const isCoreFieldDirty = (field: keyof CoupleRow | keyof DetailRow) => {
    if (!savedSnapshot || !hasUnsavedChanges) return false;
    try {
      const saved = JSON.parse(savedSnapshot) as any;
      const savedCouple = saved.couple || {};
      const savedDetails = saved.details || {};
      if (field in couple) {
        return JSON.stringify((savedCouple as any)[field]) !== JSON.stringify((couple as any)[field]);
      }
      return JSON.stringify((savedDetails as any)[field]) !== JSON.stringify((details as any)[field]);
    } catch {
      return false;
    }
  };
  const isSectionRowDirty = (sectionId: string) => {
    if (!savedSnapshot || !hasUnsavedChanges) return false;
    try {
      const saved = JSON.parse(savedSnapshot) as any;
      const savedSections = ((saved.sections || []) as Array<any>).find((row) => row.id === sectionId);
      const current = sections.find((row) => row.id === sectionId);
      if (!current) return false;
      return JSON.stringify(savedSections || {}) !== JSON.stringify({
        id: current.id,
        section_key: current.section_key,
        is_enabled: current.is_enabled,
        sort_order: current.sort_order,
        content_text: current.content_text,
        animation: current.animation,
        animation_duration_ms: current.animation_duration_ms,
        animation_delay_ms: current.animation_delay_ms,
      });
    } catch {
      return false;
    }
  };
  const isEventFieldDirty = (eventId: string, field: 'event_name' | 'time_label' | 'icon' | 'is_visible') => {
    if (!savedSnapshot || !hasUnsavedChanges) return false;
    try {
      const saved = JSON.parse(savedSnapshot) as any;
      const savedRow = ((saved.events || []) as Array<any>).find((row) => row.id === eventId);
      const current = events.find((row) => row.id === eventId);
      if (!current) return false;
      return JSON.stringify(savedRow?.[field]) !== JSON.stringify((current as any)[field]);
    } catch {
      return false;
    }
  };
  const isEntourageFieldDirty = (id: string, field: 'name' | 'role' | 'group_name' | 'sort_order' | 'is_visible') => {
    if (!savedSnapshot || !hasUnsavedChanges) return false;
    try {
      const saved = JSON.parse(savedSnapshot) as any;
      const savedRow = ((saved.entourage || []) as Array<any>).find((row) => row.id === id);
      const current = entourageMembers.find((row) => row.id === id);
      if (!current) return false;
      return JSON.stringify(savedRow?.[field]) !== JSON.stringify((current as any)[field]);
    } catch {
      return false;
    }
  };
  const isFaqFieldDirty = (id: string, field: 'question' | 'answer' | 'is_visible' | 'sort_order') => {
    if (!savedSnapshot || !hasUnsavedChanges) return false;
    try {
      const saved = JSON.parse(savedSnapshot) as any;
      const savedRow = ((saved.faqs || []) as Array<any>).find((row) => row.id === id);
      const current = faqs.find((row) => row.id === id);
      if (!current) return false;
      return JSON.stringify(savedRow?.[field]) !== JSON.stringify((current as any)[field]);
    } catch {
      return false;
    }
  };
  const isGalleryFieldDirty = (id: string, field: 'title' | 'image_url' | 'is_visible' | 'sort_order') => {
    if (!savedSnapshot || !hasUnsavedChanges) return false;
    try {
      const saved = JSON.parse(savedSnapshot) as any;
      const savedRow = ((saved.gallery || []) as Array<any>).find((row) => row.id === id);
      const current = gallery.find((row) => row.id === id);
      if (!current) return false;
      return JSON.stringify(savedRow?.[field]) !== JSON.stringify((current as any)[field]);
    } catch {
      return false;
    }
  };

  const discardUnsavedChanges = () => {
    if (!savedSnapshot) return;
    try {
      const saved = JSON.parse(savedSnapshot) as any;
      setCouple(saved.couple || DEFAULT_COUPLE);
      setDetails(saved.details || DEFAULT_DETAILS);
      setSections((saved.sections || []) as SectionRow[]);
      setFaqs((saved.faqs || []) as FaqRow[]);
      setGallery((saved.gallery || []) as GalleryRow[]);
      setEvents((saved.events || []) as EventRow[]);
      setEntourageMembers((saved.entourage || []) as EntourageRow[]);
      setPendingDressCodeFiles({});
      setPendingContentFiles({});
      setPendingCoupleFiles({});
      Object.values(dressCodePreviewUrls).forEach((url) => url && URL.revokeObjectURL(url));
      Object.values(contentPreviewUrls).forEach((url) => url && URL.revokeObjectURL(url));
      Object.values(couplePreviewUrls).forEach((url) => url && URL.revokeObjectURL(url));
      setDressCodePreviewUrls({});
      setContentPreviewUrls({});
      setCouplePreviewUrls({});
      if (newGalleryDraft.previewUrl) URL.revokeObjectURL(newGalleryDraft.previewUrl);
      setNewGalleryDraft({ file: null, previewUrl: '', title: '', is_visible: true });
    } catch {
      // no-op fallback
    }
  };
  const confirmDiscardChanges = () => {
    if (!hasUnsavedChanges) return true;
    return window.confirm('You have unsaved changes. Leave without saving?');
  };
  const buildInvitationLink = (domain: string, slug?: string) => {
    const cleanDomain = (domain || '').trim().replace(/\/+$/, '');
    const cleanSlug = (slug || '').trim().replace(/^\/+|\/+$/g, '');
    if (!cleanDomain) return '';
    if (!cleanSlug) return cleanDomain;
    return `${cleanDomain}/${cleanSlug}`;
  };
  const invitationDomain = (details.invitation_link || '').trim().replace(/\/+$/, '');
  const invitationPreviewLink = buildInvitationLink(invitationDomain, selectedWedding?.slug);
  const selectedPrintUrl = useMemo(() => {
    if (!selectedWedding) return '#';
    if (printPreset === 'fold') return `/${selectedWedding.slug}/print?layout=fold&autoprint=1`;
    if (printPreset === 'fold-half') return `/${selectedWedding.slug}/print?layout=fold-half&autoprint=1`;
    return `/${selectedWedding.slug}/print?autoprint=1`;
  }, [selectedWedding, printPreset]);
  const refreshPreview = () => setPreviewVersion((v) => v + 1);
  const normalizeAnimation = (value?: string) => {
    const raw = (value || '').trim();
    if (!raw) return 'reveal-fade';
    return LEGACY_ANIMATION_MAP[raw] || raw;
  };
  const managedInSeparateTab = (sectionKey: string) =>
    sectionKey === 'event_details' || sectionKey === 'programme' || sectionKey === 'entourage';
  const hasDedicatedSectionField = (sectionKey: string) =>
    sectionKey === 'hero_title' ||
    sectionKey === 'hero_subtitle' ||
    sectionKey === 'hero_couple_text';
  const usesCoreDetailField = (sectionKey: string) =>
    sectionKey === 'hero_title' || sectionKey === 'hero_subtitle';
  const usesSectionContentField = (sectionKey: string) =>
    sectionKey === 'hero_couple_text';
  const isSectionContentEditable = (sectionKey: string) =>
    !managedInSeparateTab(sectionKey) && !hasDedicatedSectionField(sectionKey);

  const toMinutesFromLabel = (label: string): number | null => {
    const value = (label || '').trim().toUpperCase();
    if (!value) return null;
    const m = value.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/);
    if (!m) return null;
    let h = Number(m[1]);
    const mins = Number(m[2]);
    const meridiem = m[3] || '';
    if (Number.isNaN(h) || Number.isNaN(mins) || mins > 59 || h < 0 || h > 23) return null;
    if (meridiem) {
      if (h < 1 || h > 12) return null;
      if (meridiem === 'AM') h = h === 12 ? 0 : h;
      if (meridiem === 'PM') h = h === 12 ? 12 : h + 12;
    }
    return h * 60 + mins;
  };

  const toTimeInputValue = (label: string): string => {
    const minutes = toMinutesFromLabel(label);
    if (minutes === null) return '';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const fromTimeInputValue = (value: string): string => {
    if (!value || !value.includes(':')) return '';
    const [hh, mm] = value.split(':').map(Number);
    if (Number.isNaN(hh) || Number.isNaN(mm)) return '';
    const suffix = hh >= 12 ? 'PM' : 'AM';
    const hour12 = hh % 12 === 0 ? 12 : hh % 12;
    return `${hour12}:${String(mm).padStart(2, '0')} ${suffix}`;
  };

  const toLongDateLabel = (value: string): string => {
    if (!value) return '';
    const parsed = new Date(`${value}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return '';
    return parsed.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });
  };

  const toWeekdayLabel = (value: string): string => {
    if (!value) return '';
    const parsed = new Date(`${value}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return '';
    return parsed.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const readImageMeta = (url: string, setter: (meta: ImageMeta | null) => void) => {
    const source = (url || '').trim();
    if (!source) {
      setter(null);
      return;
    }

    const img = new Image();
    img.onload = () => setter({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => setter(null);
    img.src = source;
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    readImageMeta(details.hero_image_url, setHeroMeta);
  }, [details.hero_image_url]);

  useEffect(() => {
    readImageMeta(details.venue_image_url, setVenueMeta);
  }, [details.venue_image_url]);

  const notify = (message: string, type: 'success' | 'error' = 'success') => {
    setStatusType(type);
    setStatus(message);
    window.setTimeout(() => {
      setStatus((prev) => (prev === message ? null : prev));
    }, 2600);
  };

  const init = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      router.push('/admin/login');
      return;
    }
    const email = (session.user.email || '').trim().toLowerCase();
    let scope: AccessScope = { role: 'admin', username: email, wedding_id: null };
    if (email) {
      const { data: mappedUser } = await supabase
        .from('users')
        .select('id, wedding_id, username')
        .eq('username', email)
        .maybeSingle();
      if (mappedUser) {
        scope = {
          role: 'editor',
          username: mappedUser.username,
          wedding_id: mappedUser.wedding_id,
        };
      }
    }
    const inUsersPortal = pathname.startsWith('/users');
    if (scope.role === 'editor' && !inUsersPortal) {
      router.replace('/users');
      return;
    }
    if (scope.role === 'admin' && inUsersPortal) {
      router.replace('/admin');
      return;
    }
    setAccessScope(scope);
    await loadWeddings(scope.wedding_id);
    if (scope.role === 'admin') {
      await loadUsers();
    }
  };

  const loadWeddings = async (forcedWeddingId?: string | null) => {
    setLoading(true);
    const { data, error: weddingsError } = await supabase.from('weddings').select('*').order('created_at');
    if (weddingsError) {
      setError(`Failed to load weddings: ${weddingsError.message}`);
      setLoading(false);
      return;
    }

    const allRows = (data || []) as WeddingRow[];
    const rows = forcedWeddingId ? allRows.filter((row) => row.id === forcedWeddingId) : allRows;
    setWeddings(rows);

    const chosen = forcedWeddingId || selectedWeddingId || rows[0]?.id || '';
    setSelectedWeddingId(chosen);
    if (chosen) await loadWeddingData(chosen);
    setLoading(false);
  };

  const loadUsers = async () => {
    const { data, error: usersError } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    if (usersError) {
      notify(`Failed to load users: ${usersError.message}`, 'error');
      return;
    }
    setUserAccounts((data || []) as CmsUserRow[]);
  };

  const ensureSections = async (weddingId: string, existingSections?: Array<Pick<SectionRow, 'section_key'>>) => {
    const source = existingSections || sections;
    const existing = new Set(source.map((s) => s.section_key));
    const missing = SECTION_KEYS.filter((item) => !existing.has(item.key));
    if (!missing.length) return false;

    const { error } = await supabase.from('wedding_sections').insert(
      missing.map((item, idx) => ({
        wedding_id: weddingId,
        section_key: item.key,
        name: item.label,
        is_enabled: true,
        sort_order: (idx + 1) * 10,
        content_text: '',
        animation: 'reveal-fade',
        animation_duration_ms: 850,
        animation_delay_ms: 0,
      })),
    );
    if (error) {
      notify(`Failed to auto-create missing sections: ${error.message}`, 'error');
      return false;
    }
    return true;
  };

  const loadWeddingData = async (weddingId: string) => {
    const [coupleRes, detailsRes, sectionsRes, faqsRes, galleryRes, rsvpsRes, eventsRes, entourageRes] = await Promise.all([
      supabase.from('wedding_couples').select('*').eq('wedding_id', weddingId).maybeSingle(),
      supabase.from('wedding_details').select('*').eq('wedding_id', weddingId).maybeSingle(),
      supabase.from('wedding_sections').select('*').eq('wedding_id', weddingId).order('sort_order'),
      supabase.from('wedding_faqs').select('*').eq('wedding_id', weddingId).order('sort_order'),
      supabase.from('wedding_gallery').select('*').eq('wedding_id', weddingId).order('sort_order'),
      supabase.from('wedding_rsvps').select('*').eq('wedding_id', weddingId).order('created_at', { ascending: false }),
      supabase.from('wedding_events').select('*').eq('wedding_id', weddingId).order('sort_order'),
      supabase.from('wedding_entourage').select('*').eq('wedding_id', weddingId).order('sort_order'),
    ]);

    const nextCouple = { ...DEFAULT_COUPLE, ...(coupleRes.data || {}) };
    const nextDetails = { ...DEFAULT_DETAILS, ...(detailsRes.data || {}) };
    let nextSections = ((sectionsRes.data || []) as Partial<SectionRow>[]).map((row) => ({
        id: row.id || '',
        section_key: row.section_key || '',
        name: row.name || '',
        is_enabled: Boolean(row.is_enabled),
        sort_order: row.sort_order || 0,
        content_text: row.content_text || '',
        animation: normalizeAnimation(row.animation),
        animation_duration_ms: row.animation_duration_ms || 850,
        animation_delay_ms: row.animation_delay_ms || 0,
      }));
    const insertedMissingSections = await ensureSections(weddingId, nextSections);
    if (insertedMissingSections) {
      const refreshedSectionsRes = await supabase
        .from('wedding_sections')
        .select('*')
        .eq('wedding_id', weddingId)
        .order('sort_order');
      nextSections = ((refreshedSectionsRes.data || []) as Partial<SectionRow>[]).map((row) => ({
        id: row.id || '',
        section_key: row.section_key || '',
        name: row.name || '',
        is_enabled: Boolean(row.is_enabled),
        sort_order: row.sort_order || 0,
        content_text: row.content_text || '',
        animation: normalizeAnimation(row.animation),
        animation_duration_ms: row.animation_duration_ms || 850,
        animation_delay_ms: row.animation_delay_ms || 0,
      }));
    }
    const nextFaqs = (faqsRes.data || []) as FaqRow[];
    const nextGallery = (galleryRes.data || []) as GalleryRow[];
    const nextEvents = (eventsRes.data || []) as EventRow[];
    const nextEntourage = (entourageRes.data || []) as EntourageRow[];

    setCouple(nextCouple);
    setDetails(nextDetails);
    setSections(nextSections);
    setFaqs(nextFaqs);
    setGallery(nextGallery);
    setRsvps((rsvpsRes.data || []) as RSVPRow[]);
    setEvents(nextEvents);
    setEntourageMembers(nextEntourage);
    setPendingDressCodeFiles({});
    setPendingContentFiles({});
    setPendingCoupleFiles({});
    setDressCodePreviewUrls({});
    setContentPreviewUrls({});
    setCouplePreviewUrls({});
    if (newGalleryDraft.previewUrl) URL.revokeObjectURL(newGalleryDraft.previewUrl);
    setNewGalleryDraft({ file: null, previewUrl: '', title: '', is_visible: true });
    setSavedSnapshot(
      JSON.stringify({
        selectedWeddingId: weddingId,
        couple: nextCouple,
        details: nextDetails,
        sections: nextSections.map((row) => ({
          id: row.id,
          section_key: row.section_key,
          is_enabled: row.is_enabled,
          sort_order: row.sort_order,
          content_text: row.content_text,
          animation: row.animation,
          animation_duration_ms: row.animation_duration_ms,
          animation_delay_ms: row.animation_delay_ms,
        })),
        faqs: nextFaqs.map((row) => ({ id: row.id, question: row.question, answer: row.answer, is_visible: row.is_visible, sort_order: row.sort_order })),
        gallery: nextGallery.map((row) => ({ id: row.id, title: row.title, image_url: row.image_url, is_visible: row.is_visible, sort_order: row.sort_order })),
        events: nextEvents.map((row) => ({ id: row.id, event_name: row.event_name, time_label: row.time_label, icon: row.icon, is_visible: row.is_visible, sort_order: row.sort_order })),
        entourage: nextEntourage.map((row) => ({ id: row.id, name: row.name, role: row.role, group_name: row.group_name, sort_order: row.sort_order, is_visible: row.is_visible })),
        pendingDressCodeFiles: [],
        pendingContentFiles: [],
        pendingCoupleFiles: [],
        hasDraftGallery: false,
        newGalleryDraftTitle: '',
        newGalleryDraftVisible: true,
      }),
    );
  };

  useEffect(() => {
    if (selectedWeddingId) {
      loadWeddingData(selectedWeddingId);
    }
  }, [selectedWeddingId]);

  useEffect(() => {
    if (!selectedWedding) {
      setEditWedding({ slug: '', title: '' });
      return;
    }
    setEditWedding({ slug: selectedWedding.slug || '', title: selectedWedding.title || '' });
  }, [selectedWeddingId, selectedWedding?.slug, selectedWedding?.title]);

  useEffect(() => {
    const syncMissingSections = async () => {
      if (tab !== 'sections' || !selectedWeddingId) return;
      const insertedMissingSections = await ensureSections(selectedWeddingId, sections);
      if (insertedMissingSections) {
        await loadWeddingData(selectedWeddingId);
      }
    };
    syncMissingSections();
  }, [tab, selectedWeddingId]);

  const handleLogout = async () => {
    if (!confirmDiscardChanges()) return;
    await supabase.auth.signOut();
    router.push(pathname.startsWith('/users') ? '/users/login' : '/admin/login');
  };

  const createWedding = async () => {
    if (accessScope.role !== 'admin') return;
    const normalizedSlug = newWedding.slug.trim().toLowerCase().replace(/\s+/g, '-');
    if (!normalizedSlug || !newWedding.title.trim()) return;
    const { data, error: createError } = await supabase
      .from('weddings')
      .insert({ slug: normalizedSlug, title: newWedding.title.trim(), theme_key: 'classic_grid' })
      .select('*')
      .maybeSingle();

    if (createError || !data) {
      notify(`Create wedding failed: ${createError?.message || 'unknown error'}`, 'error');
      return;
    }

    await supabase.from('wedding_couples').upsert({
      wedding_id: data.id,
      bride_name: 'Bride',
      groom_name: 'Groom',
    });
    await supabase.from('wedding_details').upsert({
      wedding_id: data.id,
      invitation_title: 'A Celebration of Love',
      rsvp_title: 'Kindly Reply',
      gift_registry_title: 'Gift Registry',
      dress_code_title: 'Dress Code',
    });

    setNewWedding({ slug: '', title: '' });
    setSelectedWeddingId(data.id);
    refreshPreview();
    notify('Wedding created.');
    await loadWeddings();
  };

  const saveWeddingMeta = async () => {
    if (accessScope.role !== 'admin') return;
    if (!selectedWeddingId) return;
    const normalizedSlug = editWedding.slug.trim().toLowerCase().replace(/\s+/g, '-');
    const normalizedTitle = editWedding.title.trim();
    if (!normalizedSlug || !normalizedTitle) {
      notify('Slug and wedding title are required.', 'error');
      return;
    }

    const { error: updateError } = await supabase
      .from('weddings')
      .update({ slug: normalizedSlug, title: normalizedTitle })
      .eq('id', selectedWeddingId);

    if (updateError) {
      notify(`Update wedding failed: ${updateError.message}`, 'error');
      return;
    }
    notify('Wedding updated.');
    await loadWeddings();
  };

  const deleteWedding = async () => {
    if (accessScope.role !== 'admin') return;
    if (!selectedWeddingId || !selectedWedding) return;
    const ok = window.confirm(`Delete wedding "${selectedWedding.title}"? This cannot be undone.`);
    if (!ok) return;

    const { error: deleteError } = await supabase.from('weddings').delete().eq('id', selectedWeddingId);
    if (deleteError) {
      notify(`Delete wedding failed: ${deleteError.message}`, 'error');
      return;
    }

    const remaining = weddings.filter((w) => w.id !== selectedWeddingId);
    const nextId = remaining[0]?.id || '';
    setSelectedWeddingId(nextId);
    notify('Wedding deleted.');
    await loadWeddings();
  };

  const createCmsUser = async () => {
    if (accessScope.role !== 'admin') return;
    const username = newUser.username.trim().toLowerCase();
    const password = newUser.password.trim();
    if (!newUser.wedding_id || !username || !password) {
      notify('Wedding, username, and password are required.', 'error');
      return;
    }

    const { error: createError } = await supabase.from('users').insert({
      wedding_id: newUser.wedding_id,
      username,
      password,
    });

    if (createError) {
      notify(`Create user failed: ${createError.message}`, 'error');
      return;
    }

    setNewUser({ wedding_id: '', username: '', password: '' });
    notify('User created.');
    await loadUsers();
  };

  const deleteCmsUser = async (id: string) => {
    if (accessScope.role !== 'admin') return;
    const { error: deleteError } = await supabase.from('users').delete().eq('id', id);
    if (deleteError) {
      notify(`Delete user failed: ${deleteError.message}`, 'error');
      return;
    }
    notify('User deleted.');
    await loadUsers();
  };

  const saveWeddingTemplate = async (themeKey: string, silent = false) => {
    if (!selectedWeddingId) return;
    const { error: updateError } = await supabase
      .from('weddings')
      .update({ theme_key: themeKey })
      .eq('id', selectedWeddingId);
    if (updateError) {
      notify(`Theme save failed: ${updateError.message}`, 'error');
      return;
    }
    setWeddings((prev) => prev.map((w) => (w.id === selectedWeddingId ? { ...w, theme_key: themeKey } : w)));
    setPreviewVersion((v) => v + 1);
    if (!silent) notify('Theme color saved.');
  };

  const saveWedding = async () => {
    if (!selectedWeddingId) return;
    await ensureSections(selectedWeddingId);
    let nextCouple = { ...couple };
    const oldBrideImage = couple.bride_image;
    const oldGroomImage = couple.groom_image;

    if (pendingCoupleFiles.bride) {
      try {
        nextCouple.bride_image = await uploadAsset(pendingCoupleFiles.bride, 'content');
      } catch (e) {
        notify(`Bride image upload failed: ${(e as Error).message}`, 'error');
        return;
      }
    }
    if (pendingCoupleFiles.groom) {
      try {
        nextCouple.groom_image = await uploadAsset(pendingCoupleFiles.groom, 'content');
      } catch (e) {
        notify(`Groom image upload failed: ${(e as Error).message}`, 'error');
        return;
      }
    }

    const [coupleSave, detailsSave] = await Promise.all([
      supabase.from('wedding_couples').upsert({ wedding_id: selectedWeddingId, ...nextCouple }),
      supabase.from('wedding_details').upsert({ wedding_id: selectedWeddingId, ...details }),
    ]);

    if (coupleSave.error || detailsSave.error) {
      notify(`Save failed: ${coupleSave.error?.message || detailsSave.error?.message}`, 'error');
      return;
    }
    if (pendingCoupleFiles.bride && oldBrideImage && oldBrideImage !== nextCouple.bride_image) {
      await deleteStorageObjectByPublicUrl(oldBrideImage);
    }
    if (pendingCoupleFiles.groom && oldGroomImage && oldGroomImage !== nextCouple.groom_image) {
      await deleteStorageObjectByPublicUrl(oldGroomImage);
    }
    setCouple(nextCouple);
    setPendingCoupleFiles({});
    setCouplePreviewUrls((prev) => {
      Object.values(prev).forEach((url) => url && URL.revokeObjectURL(url));
      return {};
    });
    refreshPreview();
    notify('Wedding details saved.');
    await loadWeddingData(selectedWeddingId);
  };

  const saveSection = async (section: SectionRow) => {
    const contentText =
      isSectionContentEditable(section.section_key) || usesSectionContentField(section.section_key)
        ? section.content_text || ''
        : '';
    const { error: sectionError } = await supabase
      .from('wedding_sections')
      .update({
        is_enabled: section.is_enabled,
        content_text: contentText,
        animation: normalizeAnimation(section.animation),
        animation_duration_ms: section.animation_duration_ms || 850,
        animation_delay_ms: section.animation_delay_ms || 0,
      })
      .eq('id', section.id);
    if (!sectionError) {
      if (
        (section.section_key === 'hero_title' || section.section_key === 'hero_subtitle') &&
        selectedWeddingId
      ) {
        const { error: heroTextError } = await supabase
          .from('wedding_details')
          .upsert({
            wedding_id: selectedWeddingId,
            blessing_text: details.blessing_text || '',
            hero_subtitle: details.hero_subtitle || '',
          });
        if (heroTextError) {
          notify(`Save hero title/subtitle failed: ${heroTextError.message}`, 'error');
          return;
        }
      }
      const updatedSections = sections.map((row) =>
        row.id === section.id ? { ...section, content_text: contentText } : row,
      );
      setSections(updatedSections);
      // Refresh saved baseline immediately so dirty highlight clears after successful save.
      setSavedSnapshot(buildSnapshot({ sections: updatedSections }));
      refreshPreview();
      notify(`Section ${section.name} saved.`);
    }
  };

  const sectionFallbackFromCore = (sectionKey: string): string => {
    if (sectionKey === 'hero') return '';
    if (sectionKey === 'hero_title') return details.blessing_text || '';
    if (sectionKey === 'hero_subtitle') return details.hero_subtitle || '';
    if (sectionKey === 'hero_couple_text') return `${couple.bride_name || ''} & ${couple.groom_name || ''}`.trim();
    if (sectionKey === 'couple_info') return `${couple.bride_name || ''} & ${couple.groom_name || ''}`.trim();
    if (sectionKey === 'story') return details.invitation_text || '';
    if (sectionKey === 'invitation') return details.invitation_text || '';
    if (sectionKey === 'event_details') return '';
    if (sectionKey === 'programme') return '';
    if (sectionKey === 'entourage') return '';
    if (sectionKey === 'venue') return details.venue_description || '';
    if (sectionKey === 'rsvp') return details.rsvp_deadline_label ? `Please RSVP by ${details.rsvp_deadline_label}` : '';
    if (sectionKey === 'gift_registry') return details.gift_registry_description || '';
    if (sectionKey === 'dress_code') return details.dress_code_description || '';
    if (sectionKey === 'faq') return '';
    if (sectionKey === 'gallery') return '';
    return '';
  };

  const getEffectiveSectionContent = (section: SectionRow) => {
    if (usesCoreDetailField(section.section_key)) {
      return sectionFallbackFromCore(section.section_key);
    }
    return section.content_text || sectionFallbackFromCore(section.section_key);
  };

  const addFaq = async () => {
    if (!selectedWeddingId || !newFaq.question.trim() || !newFaq.answer.trim()) return;
    const nextSort = faqs.length ? Math.max(...faqs.map((f) => f.sort_order || 0)) + 10 : 10;
    const { error: addError } = await supabase.from('wedding_faqs').insert({
      wedding_id: selectedWeddingId,
      question: newFaq.question.trim(),
      answer: newFaq.answer.trim(),
      is_visible: true,
      sort_order: nextSort,
    });
    if (!addError) {
      setNewFaq({ question: '', answer: '' });
      await loadWeddingData(selectedWeddingId);
      refreshPreview();
      notify('FAQ added.');
    }
  };

  const saveFaq = async (faq: FaqRow) => {
    const { error: saveError } = await supabase
      .from('wedding_faqs')
      .update({ question: faq.question, answer: faq.answer, is_visible: faq.is_visible, sort_order: faq.sort_order })
      .eq('id', faq.id);
    if (!saveError) {
      refreshPreview();
      notify('FAQ saved.');
    }
  };

  const deleteFaq = async (id: string) => {
    await supabase.from('wedding_faqs').delete().eq('id', id);
    if (selectedWeddingId) await loadWeddingData(selectedWeddingId);
    refreshPreview();
    notify('FAQ deleted.');
  };

  const uploadAsset = async (file: File, folder: 'content' | 'gallery') => {
    const filename = `${Date.now()}-${file.name.replace(/\\s+/g, '-').toLowerCase()}`;
    const path = `${folder}/${filename}`;
    const uploadRes = await supabase.storage.from('wedding-assets').upload(path, file, { upsert: false });
    if (uploadRes.error) throw uploadRes.error;
    return supabase.storage.from('wedding-assets').getPublicUrl(path).data.publicUrl;
  };

  const extractBucketPathFromPublicUrl = (publicUrl: string): string | null => {
    const raw = (publicUrl || '').trim();
    if (!raw) return null;
    const marker = '/storage/v1/object/public/wedding-assets/';
    const idx = raw.indexOf(marker);
    if (idx === -1) return null;
    return raw.slice(idx + marker.length);
  };

  const deleteStorageObjectByPublicUrl = async (publicUrl: string) => {
    const path = extractBucketPathFromPublicUrl(publicUrl);
    if (!path) return;
    await supabase.storage.from('wedding-assets').remove([path]);
  };

  const setContentDraftFile = (
    file: File,
    slot: ContentImageSlot,
    target: 'hero_image_url' | 'venue_image_url',
  ) => {
    setPendingContentFiles((prev) => ({ ...prev, [slot]: file }));
    setContentPreviewUrls((prev) => {
      const previousUrl = prev[slot];
      if (previousUrl) URL.revokeObjectURL(previousUrl);
      return { ...prev, [slot]: URL.createObjectURL(file) };
    });
    notify('Image selected. Click Save to upload and apply.');
  };

  const setCoupleDraftFile = (file: File, slot: CoupleImageSlot) => {
    setPendingCoupleFiles((prev) => ({ ...prev, [slot]: file }));
    setCouplePreviewUrls((prev) => {
      const previousUrl = prev[slot];
      if (previousUrl) URL.revokeObjectURL(previousUrl);
      return { ...prev, [slot]: URL.createObjectURL(file) };
    });
    notify(`Selected ${slot} image. Click Save Wedding to upload and apply.`);
  };

  const saveContentImageSlot = async (slot: ContentImageSlot) => {
    if (!selectedWeddingId) return;
    const target = slot === 'hero' ? 'hero_image_url' : 'venue_image_url';
    const previousUrl = details[target];
    let imageUrl = details[target];
    const pendingFile = pendingContentFiles[slot];

    if (pendingFile) {
      try {
        imageUrl = await uploadAsset(pendingFile, 'content');
      } catch (e) {
        notify(`Upload failed: ${(e as Error).message}`, 'error');
        return;
      }
    }

    const { error: saveError } = await supabase
      .from('wedding_details')
      .upsert({ wedding_id: selectedWeddingId, [target]: imageUrl });

    if (saveError) {
      notify(`Save ${slot} image failed: ${saveError.message}`, 'error');
      return;
    }

    setPendingContentFiles((prev) => {
      const next = { ...prev };
      delete next[slot];
      return next;
    });
    setContentPreviewUrls((prev) => {
      const next = { ...prev };
      if (next[slot]) URL.revokeObjectURL(next[slot] as string);
      delete next[slot];
      return next;
    });

    if (pendingFile && previousUrl && previousUrl !== imageUrl) {
      await deleteStorageObjectByPublicUrl(previousUrl);
    }

    refreshPreview();
    notify(`${slot === 'hero' ? 'Hero' : 'Venue'} image saved.`);
    await loadWeddingData(selectedWeddingId);
  };

  const stageGalleryImage = (file: File) => {
    setNewGalleryDraft((prev) => {
      if (prev.previewUrl) URL.revokeObjectURL(prev.previewUrl);
      return {
        file,
        previewUrl: URL.createObjectURL(file),
        title: file.name.replace(/\.[^.]+$/, ''),
        is_visible: true,
      };
    });
    notify('Gallery image selected. Click Save to upload and add.');
  };

  const saveNewGalleryDraft = async () => {
    if (!selectedWeddingId || !newGalleryDraft.file) return;
    try {
      const publicUrl = await uploadAsset(newGalleryDraft.file, 'gallery');
      const nextSort = gallery.length ? Math.max(...gallery.map((g) => g.sort_order || 0)) + 10 : 10;
      await supabase.from('wedding_gallery').insert({
        wedding_id: selectedWeddingId,
        title: newGalleryDraft.title.trim() || newGalleryDraft.file.name.replace(/\.[^.]+$/, ''),
        image_url: publicUrl,
        category: 'main',
        is_visible: newGalleryDraft.is_visible,
        sort_order: nextSort,
      });
      if (newGalleryDraft.previewUrl) URL.revokeObjectURL(newGalleryDraft.previewUrl);
      setNewGalleryDraft({ file: null, previewUrl: '', title: '', is_visible: true });
      await loadWeddingData(selectedWeddingId);
      refreshPreview();
      notify('Gallery image saved.');
    } catch (e) {
      notify(`Upload failed: ${(e as Error).message}`, 'error');
    }
  };

  const setDressCodeDraftFile = (
    file: File,
    slot: DressCodeSlot,
    target: 'dress_code_image_1' | 'dress_code_image_2' | 'dress_code_image_3',
  ) => {
    setPendingDressCodeFiles((prev) => ({ ...prev, [slot]: file }));
    setDressCodePreviewUrls((prev) => {
      const previousUrl = prev[slot];
      if (previousUrl) URL.revokeObjectURL(previousUrl);
      return { ...prev, [slot]: URL.createObjectURL(file) };
    });
    notify('Image selected. Click Save to upload and apply.');
  };

  const saveDressCodeImageSlot = async (slot: DressCodeSlot) => {
    if (!selectedWeddingId) return;
    const imageKey = `dress_code_image_${slot}` as const;
    const visibleKey = `dress_code_image_${slot}_visible` as const;
    const previousUrl = details[imageKey];
    let imageUrl = details[imageKey];

    const pendingFile = pendingDressCodeFiles[slot];
    if (pendingFile) {
      try {
        imageUrl = await uploadAsset(pendingFile, 'content');
      } catch (e) {
        notify(`Upload failed: ${(e as Error).message}`, 'error');
        return;
      }
    }

    const payload = {
      wedding_id: selectedWeddingId,
      [imageKey]: imageUrl,
      [visibleKey]: details[visibleKey],
    };

    const { error: saveError } = await supabase.from('wedding_details').upsert(payload);
    if (saveError) {
      notify(`Save dress code image ${slot} failed: ${saveError.message}`, 'error');
      return;
    }
    setPendingDressCodeFiles((prev) => {
      const next = { ...prev };
      delete next[slot];
      return next;
    });
    setDressCodePreviewUrls((prev) => {
      const next = { ...prev };
      if (next[slot]) URL.revokeObjectURL(next[slot] as string);
      delete next[slot];
      return next;
    });
    if (pendingFile && previousUrl && previousUrl !== imageUrl) {
      await deleteStorageObjectByPublicUrl(previousUrl);
    }
    refreshPreview();
    notify(`Dress code image ${slot} saved.`);
    await loadWeddingData(selectedWeddingId);
  };

  useEffect(() => {
    return () => {
      Object.values(dressCodePreviewUrls).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
      Object.values(contentPreviewUrls).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
      if (newGalleryDraft.previewUrl) URL.revokeObjectURL(newGalleryDraft.previewUrl);
    };
  }, [dressCodePreviewUrls, contentPreviewUrls, newGalleryDraft.previewUrl]);

  const saveGalleryItem = async (item: GalleryRow) => {
    await supabase
      .from('wedding_gallery')
      .update({
        title: item.title,
        image_url: item.image_url,
        category: item.category,
        is_visible: item.is_visible,
        sort_order: item.sort_order,
      })
      .eq('id', item.id);
    refreshPreview();
    notify('Gallery saved.');
  };

  const deleteGalleryItem = async (id: string) => {
    const item = gallery.find((g) => g.id === id);
    await supabase.from('wedding_gallery').delete().eq('id', id);
    if (item?.image_url) {
      await deleteStorageObjectByPublicUrl(item.image_url);
    }
    if (selectedWeddingId) await loadWeddingData(selectedWeddingId);
    refreshPreview();
    notify('Gallery image deleted.');
  };

  const clearContentImageSlot = async (slot: ContentImageSlot) => {
    if (!selectedWeddingId) return;
    const target = slot === 'hero' ? 'hero_image_url' : 'venue_image_url';
    const previousUrl = details[target];
    const { error: saveError } = await supabase.from('wedding_details').upsert({ wedding_id: selectedWeddingId, [target]: '' });
    if (saveError) {
      notify(`Delete ${slot} image failed: ${saveError.message}`, 'error');
      return;
    }
    if (previousUrl) {
      await deleteStorageObjectByPublicUrl(previousUrl);
    }
    setPendingContentFiles((prev) => {
      const next = { ...prev };
      delete next[slot];
      return next;
    });
    setContentPreviewUrls((prev) => {
      const next = { ...prev };
      if (next[slot]) URL.revokeObjectURL(next[slot] as string);
      delete next[slot];
      return next;
    });
    await loadWeddingData(selectedWeddingId);
    refreshPreview();
    notify(`${slot === 'hero' ? 'Hero' : 'Venue'} image deleted.`);
  };

  const clearDressCodeImageSlot = async (slot: DressCodeSlot) => {
    if (!selectedWeddingId) return;
    const imageKey = `dress_code_image_${slot}` as const;
    const previousUrl = details[imageKey];
    const { error: saveError } = await supabase
      .from('wedding_details')
      .upsert({ wedding_id: selectedWeddingId, [imageKey]: '' });
    if (saveError) {
      notify(`Delete dress code image ${slot} failed: ${saveError.message}`, 'error');
      return;
    }
    if (previousUrl) {
      await deleteStorageObjectByPublicUrl(previousUrl);
    }
    setPendingDressCodeFiles((prev) => {
      const next = { ...prev };
      delete next[slot];
      return next;
    });
    setDressCodePreviewUrls((prev) => {
      const next = { ...prev };
      if (next[slot]) URL.revokeObjectURL(next[slot] as string);
      delete next[slot];
      return next;
    });
    await loadWeddingData(selectedWeddingId);
    refreshPreview();
    notify(`Dress code image ${slot} deleted.`);
  };

  const addEvent = async () => {
    if (!selectedWeddingId || !newEvent.event_name.trim()) return;
    const nextFallbackSort = events.length ? Math.max(...events.map((e) => e.sort_order || 0)) + 10 : 10;
    const derivedSort = toMinutesFromLabel(newEvent.time_label) ?? nextFallbackSort;
    const { error: addError } = await supabase.from('wedding_events').insert({
      wedding_id: selectedWeddingId,
      event_name: newEvent.event_name.trim(),
      date_label: '',
      time_label: newEvent.time_label.trim(),
      location_label: '',
      icon: newEvent.icon,
      category: 'programme',
      sort_order: derivedSort,
      is_visible: true,
    });
    if (addError) {
      notify(`Add event failed: ${addError.message}`, 'error');
      return;
    }
    setNewEvent({ event_name: '', time_label: '', icon: 'heart' });
    await loadWeddingData(selectedWeddingId);
    refreshPreview();
    notify('Event added.');
  };

  const saveEvent = async (event: EventRow) => {
    const { error } = await supabase
      .from('wedding_events')
      .update({
        event_name: event.event_name,
        date_label: '',
        time_label: event.time_label,
        location_label: '',
        icon: event.icon,
        category: 'programme',
        sort_order: toMinutesFromLabel(event.time_label) ?? event.sort_order,
        is_visible: event.is_visible,
      })
      .eq('id', event.id);
    if (error) {
      notify(`Save event failed: ${error.message}`, 'error');
      return;
    }
    refreshPreview();
    notify('Programme item saved.');
    await loadWeddingData(selectedWeddingId);
  };

  const deleteEvent = async (id: string) => {
    await supabase.from('wedding_events').delete().eq('id', id);
    if (selectedWeddingId) await loadWeddingData(selectedWeddingId);
    refreshPreview();
    notify('Event deleted.');
  };

  const addEntourageMember = async () => {
    if (!selectedWeddingId || !newEntourage.name.trim()) return;
    const { error: addError } = await supabase.from('wedding_entourage').insert({
      wedding_id: selectedWeddingId,
      name: newEntourage.name.trim(),
      role: newEntourage.role.trim(),
      group_name: newEntourage.group_name,
      sort_order: newEntourage.sort_order || 10,
      is_visible: true,
    });
    if (addError) {
      notify(`Add entourage failed: ${addError.message}`, 'error');
      return;
    }
    setNewEntourage({ name: '', role: '', group_name: 'groomsmen', sort_order: 10 });
    await loadWeddingData(selectedWeddingId);
    refreshPreview();
    notify('Entourage member added.');
  };

  const saveEntourageMember = async (member: EntourageRow) => {
    const { error } = await supabase
      .from('wedding_entourage')
      .update({
        name: member.name,
        role: member.role,
        group_name: member.group_name,
        sort_order: member.sort_order,
        is_visible: member.is_visible,
      })
      .eq('id', member.id);
    if (error) {
      notify(`Save entourage failed: ${error.message}`, 'error');
      return;
    }
    refreshPreview();
    notify('Entourage item saved.');
    await loadWeddingData(selectedWeddingId);
  };

  const saveEntourageVerse = async () => {
    if (!selectedWeddingId) return;
    const { error: detailError } = await supabase
      .from('wedding_details')
      .upsert({
        wedding_id: selectedWeddingId,
        entourage_verse: details.entourage_verse || '',
      });

    if (detailError) {
      notify(`Save entourage verse failed: ${detailError.message}`, 'error');
      return;
    }
    refreshPreview();
    notify('Entourage verse saved.');
    await loadWeddingData(selectedWeddingId);
  };

  const deleteEntourageMember = async (id: string) => {
    await supabase.from('wedding_entourage').delete().eq('id', id);
    if (selectedWeddingId) await loadWeddingData(selectedWeddingId);
    refreshPreview();
    notify('Entourage member deleted.');
  };

  const exportCSV = () => {
    const headers = ['Guest', 'Email', 'Phone', 'Attending', 'Guests', 'Meal', 'Message', 'Date'];
    const rows = rsvps.map((r) => [
      r.guest_name,
      r.email,
      r.phone,
      r.attending ? 'Yes' : 'No',
      String(r.number_of_guests),
      r.meal_preference || '',
      r.message || '',
      new Date(r.created_at).toLocaleString(),
    ]);
    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell.replace(/\"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wedding-rsvps.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = useMemo(
    () => ({
      total: rsvps.length,
      attending: rsvps.filter((r) => r.attending).length,
      declined: rsvps.filter((r) => !r.attending).length,
      guests: rsvps.filter((r) => r.attending).reduce((sum, row) => sum + row.number_of_guests, 0),
    }),
    [rsvps],
  );

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center" style={{ background: '#FDF8F0' }}>Loading admin...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#FDF8F0' }}>{error}</div>;
  }

  return (
    <div className="min-h-screen" style={{ background: '#FDF8F0' }}>
      {status && (
        <div
          className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-md text-sm"
          style={{
            background: statusType === 'success' ? '#EEF9F0' : '#FEF2F2',
            color: statusType === 'success' ? '#166534' : '#B91C1C',
            border: statusType === 'success' ? '1px solid #BBF7D0' : '1px solid #FECACA',
          }}
        >
          {status}
        </div>
      )}
      <header className="px-6 py-6 border-b" style={{ borderColor: '#E8D5B7', background: '#fff' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl" style={{ color: '#2C1810' }}>J7 Wedding CMS - {accessScope.role === 'admin' ? 'Administrator' : `User `} Panel</h1>
          
            <p className="font-sans-body text-xs mt-1" style={{ color: '#8B7355' }}>
              Access: {accessScope.role === 'admin' ? 'Administrator' : `users (${accessScope.username})`}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={exportCSV} className="px-4 py-2 rounded-lg text-sm flex items-center gap-2" style={{ background: '#C9A96E', color: '#fff' }}>
              <Download className="w-4 h-4" /> Export RSVPs
            </button>
            <button onClick={handleLogout} className="px-4 py-2 rounded-lg text-sm flex items-center gap-2" style={{ background: '#fff', color: '#6B5744', border: '1.5px solid #E8D5B7' }}>
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <section className="p-5 rounded-xl" style={{ background: '#fff', border: '1px solid #E8D5B7' }}>
          <h2 className="font-serif text-xl mb-3" style={{ color: '#2C1810' }}>Wedding Selector</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select
              value={selectedWeddingId}
              onChange={(e) => {
                if (hasUnsavedChanges) {
                  const ok = confirmDiscardChanges();
                  if (!ok) return;
                  discardUnsavedChanges();
                }
                setSelectedWeddingId(e.target.value);
              }}
              disabled={accessScope.role === 'editor'}
              className="px-3 py-2 rounded-lg"
              style={{ border: '1.5px solid #E8D5B7' }}
            >
              {weddings.map((w) => (
                <option key={w.id} value={w.id}>{w.title} ({w.slug})</option>
              ))}
            </select>
            {accessScope.role === 'admin' ? (
              <>
                <input value={newWedding.slug} onChange={(e) => setNewWedding((prev) => ({ ...prev, slug: e.target.value }))} placeholder="new-wedding-slug" className="px-3 py-2 rounded-lg" style={{ border: '1.5px solid #E8D5B7' }} />
                <input value={newWedding.title} onChange={(e) => setNewWedding((prev) => ({ ...prev, title: e.target.value }))} placeholder="Wedding Title" className="px-3 py-2 rounded-lg" style={{ border: '1.5px solid #E8D5B7' }} />
              </>
            ) : (
              <div className="md:col-span-2 px-3 py-2 rounded-lg text-sm" style={{ border: '1.5px solid #E8D5B7', color: '#8B7355', background: '#FFFDF9' }}>
                You can edit only your assigned wedding.
              </div>
            )}
          </div>
          {selectedWedding && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
              <select
                value={selectedWedding.theme_key || 'classic_grid'}
                onChange={async (e) => {
                  const nextTheme = e.target.value;
                  setWeddings((prev) =>
                    prev.map((w) => (w.id === selectedWeddingId ? { ...w, theme_key: nextTheme } : w)),
                  );
                  await saveWeddingTemplate(nextTheme, true);
                }}
                className="px-3 py-2 rounded-lg"
                style={{ border: '1.5px solid #E8D5B7' }}
              >
                {TEMPLATE_OPTIONS.map((item) => (
                  <option key={item.key} value={item.key}>
                    Theme Color: {item.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => saveWeddingTemplate(selectedWedding.theme_key || 'classic_grid')}
                className="px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2"
                style={{ background: '#C9A96E', color: '#fff' }}
              >
                <Save className="w-4 h-4" /> Save Theme
              </button>
            </div>
          )}
          {accessScope.role === 'admin' && selectedWedding && (
            <div className="mt-3 p-3 rounded-lg space-y-2" style={{ border: '1px solid #E8D5B7', background: '#FFFDF9' }}>
              <p className="text-sm font-medium" style={{ color: '#6B5744' }}>Edit Selected Wedding</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  value={editWedding.slug}
                  onChange={(e) => setEditWedding((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="wedding-slug"
                  className="px-3 py-2 rounded-lg"
                  style={{ border: '1.5px solid #E8D5B7' }}
                />
                <input
                  value={editWedding.title}
                  onChange={(e) => setEditWedding((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Wedding title"
                  className="px-3 py-2 rounded-lg"
                  style={{ border: '1.5px solid #E8D5B7' }}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={saveWeddingMeta}
                  className="px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2"
                  style={{ background: '#C9A96E', color: '#fff' }}
                >
                  <Save className="w-4 h-4" /> Save Wedding Info
                </button>
                <button
                  onClick={deleteWedding}
                  className="px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2"
                  style={{ background: '#FEE2E2', color: '#B91C1C' }}
                >
                  <Trash2 className="w-4 h-4" /> Delete Wedding
                </button>
              </div>
            </div>
          )}
          {accessScope.role === 'admin' && (
            <button onClick={createWedding} className="mt-3 px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2" style={{ background: '#C9A96E', color: '#fff' }}>
              <Plus className="w-4 h-4" /> Create Wedding
            </button>
          )}
          {status && <p className="mt-3 text-sm" style={{ color: '#6B5744' }}>{status}</p>}
        </section>

        <div className="flex flex-wrap gap-2">
          {(['preview', 'core', 'sections', 'events', 'entourage', 'faq', 'gallery', 'rsvps', ...(accessScope.role === 'admin' ? (['users'] as const) : [])] as const).map((item) => (
            <button
              key={item}
              onClick={() => {
                if (item === tab) return;
                if (hasUnsavedChanges) {
                  const ok = confirmDiscardChanges();
                  if (!ok) return;
                  discardUnsavedChanges();
                }
                setTab(item);
              }}
              className="px-4 py-2 rounded-lg text-sm capitalize"
              style={{
                background: tab === item ? '#C9A96E' : '#fff',
                color: tab === item ? '#fff' : '#6B5744',
                border: '1.5px solid #E8D5B7',
              }}
            >
              {item}
            </button>
          ))}
        </div>

        {tab === 'preview' && (
          <section className="p-5 rounded-xl space-y-4" style={{ background: '#fff', border: '1px solid #E8D5B7' }}>
            <h2 className="font-serif text-xl" style={{ color: '#2C1810' }}>Wedding Frontend Preview</h2>
            <p className="text-sm" style={{ color: '#6B5744' }}>
              This is a live preview of what users will see on the frontend.
            </p>
            {selectedWedding && (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`/${selectedWedding.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex px-4 py-2 rounded-lg text-sm"
                    style={{ background: '#C9A96E', color: '#fff' }}
                  >
                    Open Full Page: /{selectedWedding.slug}
                  </a>
                  <select
                    value={printPreset}
                    onChange={(e) => setPrintPreset(e.target.value as 'normal' | 'fold' | 'fold-half')}
                    className="px-3 py-2 rounded-lg text-sm"
                    style={{ border: '1.5px solid #E8D5B7', background: '#fff', color: '#6B5744' }}
                  >
                    <option value="normal">Print Layout: Standard</option>
                    <option value="fold">Print Layout: Folded (Duplex)</option>
                    <option value="fold-half">Print Layout: Folded 2-up</option>
                  </select>
                  <a
                    href={selectedPrintUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
                    style={{ background: '#C9A96E', color: '#fff' }}
                  >
                    <Download className="w-4 h-4" /> Print / Save PDF
                  </a>
                </div>
                <iframe
                  key={`${selectedWedding.id}-${selectedWedding.theme_key || 'classic_grid'}-${previewVersion}`}
                  title="Wedding Frontend Preview"
                  src={`/${selectedWedding.slug}?preview=${previewVersion}`}
                  className="w-full rounded-lg"
                  style={{ minHeight: 720, border: '1.5px solid #E8D5B7', background: '#fff' }}
                />
              </div>
            )}
          </section>
        )}

        {tab === 'core' && (
          <section className="p-5 rounded-xl space-y-4" style={{ background: '#fff', border: '1px solid #E8D5B7' }}>
            <h2 className="font-serif text-xl" style={{ color: '#2C1810' }}>Core Wedding Data</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs mb-1" style={{ color: '#6B5744' }}>Bride Name</label>
                <input value={couple.bride_name} onChange={(e) => setCouple((p) => ({ ...p, bride_name: e.target.value }))} placeholder="Bride Name" className="w-full px-3 py-2 rounded-lg" style={{ border: `1.5px solid ${isCoreFieldDirty('bride_name') ? '#DC2626' : '#E8D5B7'}` }} />
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: '#6B5744' }}>Groom Name</label>
                <input value={couple.groom_name} onChange={(e) => setCouple((p) => ({ ...p, groom_name: e.target.value }))} placeholder="Groom Name" className="w-full px-3 py-2 rounded-lg" style={{ border: `1.5px solid ${isCoreFieldDirty('groom_name') ? '#DC2626' : '#E8D5B7'}` }} />
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: '#6B5744' }}>Bride Details</label>
                <textarea
                  rows={2}
                  value={couple.bride_nickname}
                  onChange={(e) => setCouple((p) => ({ ...p, bride_nickname: e.target.value }))}
                  placeholder="Bride details / short bio"
                  className="w-full px-3 py-2 rounded-lg"
                  style={{ border: `1.5px solid ${isCoreFieldDirty('bride_nickname') ? '#DC2626' : '#E8D5B7'}` }}
                />
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: '#6B5744' }}>Groom Details</label>
                <textarea
                  rows={2}
                  value={couple.groom_nickname}
                  onChange={(e) => setCouple((p) => ({ ...p, groom_nickname: e.target.value }))}
                  placeholder="Groom details / short bio"
                  className="w-full px-3 py-2 rounded-lg"
                  style={{ border: `1.5px solid ${isCoreFieldDirty('groom_nickname') ? '#DC2626' : '#E8D5B7'}` }}
                />
              </div>
              <div className="p-3 rounded-lg" style={{ border: `1px solid ${hasDirtyLabel('Couple Draft Uploads') ? '#DC2626' : '#E8D5B7'}` }}>
                <label className="block text-xs mb-2" style={{ color: '#6B5744' }}>Bride Image</label>
                <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-3">
                  <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #E8D5B7', background: '#fff' }}>
                    {(couplePreviewUrls.bride || couple.bride_image) ? (
                      <img src={couplePreviewUrls.bride || couple.bride_image} alt="Bride preview" className="w-full h-24 object-cover" />
                    ) : (
                      <p className="text-xs px-3 py-6" style={{ color: '#8B7355' }}>No image yet.</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <input
                      value={couple.bride_image}
                      onChange={(e) => setCouple((p) => ({ ...p, bride_image: e.target.value }))}
                      placeholder="Bride image URL"
                      className="w-full px-3 py-2 rounded-lg"
                      style={{ border: `1.5px solid ${isCoreFieldDirty('bride_image') ? '#DC2626' : '#E8D5B7'}` }}
                    />
                    <label className="text-sm inline-flex items-center gap-2 px-3 py-2 rounded-lg w-fit" style={{ border: '1.5px solid #E8D5B7' }}>
                      <Upload className="w-4 h-4" />
                      <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && setCoupleDraftFile(e.target.files[0], 'bride')} />
                    </label>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-lg" style={{ border: `1px solid ${hasDirtyLabel('Couple Draft Uploads') ? '#DC2626' : '#E8D5B7'}` }}>
                <label className="block text-xs mb-2" style={{ color: '#6B5744' }}>Groom Image</label>
                <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-3">
                  <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #E8D5B7', background: '#fff' }}>
                    {(couplePreviewUrls.groom || couple.groom_image) ? (
                      <img src={couplePreviewUrls.groom || couple.groom_image} alt="Groom preview" className="w-full h-24 object-cover" />
                    ) : (
                      <p className="text-xs px-3 py-6" style={{ color: '#8B7355' }}>No image yet.</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <input
                      value={couple.groom_image}
                      onChange={(e) => setCouple((p) => ({ ...p, groom_image: e.target.value }))}
                      placeholder="Groom image URL"
                      className="w-full px-3 py-2 rounded-lg"
                      style={{ border: `1.5px solid ${isCoreFieldDirty('groom_image') ? '#DC2626' : '#E8D5B7'}` }}
                    />
                    <label className="text-sm inline-flex items-center gap-2 px-3 py-2 rounded-lg w-fit" style={{ border: '1.5px solid #E8D5B7' }}>
                      <Upload className="w-4 h-4" />
                      <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && setCoupleDraftFile(e.target.files[0], 'groom')} />
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: '#6B5744' }}>Wedding Date</label>
                <input
                  type="date"
                  value={details.wedding_date_value}
                  onChange={(e) =>
                    setDetails((p) => ({
                      ...p,
                      wedding_date_value: e.target.value,
                      wedding_date_label: toLongDateLabel(e.target.value),
                      event_day_label: p.event_day_label || toWeekdayLabel(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg"
                  style={{ border: `1.5px solid ${isCoreFieldDirty('wedding_date_value') ? '#DC2626' : '#E8D5B7'}` }}
                />
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: '#6B5744' }}>Wedding Time</label>
                <input
                  type="time"
                  value={details.ceremony_time_value}
                  onChange={(e) =>
                    setDetails((p) => ({
                      ...p,
                      ceremony_time_value: e.target.value,
                      wedding_time_label: fromTimeInputValue(e.target.value) ? `Ceremony at ${fromTimeInputValue(e.target.value)}` : '',
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg"
                  style={{ border: `1.5px solid ${isCoreFieldDirty('ceremony_time_value') ? '#DC2626' : '#E8D5B7'}` }}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs mb-1" style={{ color: '#6B5744' }}>Venue Name</label>
                <input value={details.venue_title} onChange={(e) => setDetails((p) => ({ ...p, venue_title: e.target.value }))} placeholder="Venue" className="w-full px-3 py-2 rounded-lg" style={{ border: `1.5px solid ${isCoreFieldDirty('venue_title') ? '#DC2626' : '#E8D5B7'}` }} />
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: '#6B5744' }}>Venue Address Line 1</label>
                <input
                  value={details.venue_address_line1}
                  onChange={(e) => setDetails((p) => ({ ...p, venue_address_line1: e.target.value }))}
                  placeholder="347 Diego Cera Avenue, Pulang Lupa"
                  className="w-full px-3 py-2 rounded-lg"
                  style={{ border: `1.5px solid ${isCoreFieldDirty('venue_address_line1') ? '#DC2626' : '#E8D5B7'}` }}
                />
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: '#6B5744' }}>Venue Address Line 2</label>
                <input
                  value={details.venue_address_line2}
                  onChange={(e) => setDetails((p) => ({ ...p, venue_address_line2: e.target.value }))}
                  placeholder="Las Pinas City, Philippines"
                  className="w-full px-3 py-2 rounded-lg"
                  style={{ border: `1.5px solid ${isCoreFieldDirty('venue_address_line2') ? '#DC2626' : '#E8D5B7'}` }}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs mb-1" style={{ color: '#6B5744' }}>Google Map Link</label>
                <input value={details.map_link} onChange={(e) => setDetails((p) => ({ ...p, map_link: e.target.value }))} placeholder="Map Link" className="w-full px-3 py-2 rounded-lg" style={{ border: `1.5px solid ${isCoreFieldDirty('map_link') ? '#DC2626' : '#E8D5B7'}` }} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs mb-1" style={{ color: '#6B5744' }}>Domain</label>
                <input
                  value={invitationDomain}
                  onChange={(e) =>
                    accessScope.role === 'admin' &&
                    setDetails((p) => ({
                      ...p,
                      invitation_link: e.target.value.trim(),
                    }))
                  }
                  placeholder="https://project-jcf0d.vercel.app"
                  readOnly={accessScope.role !== 'admin'}
                  className="w-full px-3 py-2 rounded-lg"
                    style={{
                      border: `1.5px solid ${isCoreFieldDirty('invitation_link') ? '#DC2626' : '#E8D5B7'}`,
                      background: accessScope.role === 'admin' ? '#fff' : '#FFF8EE',
                      color: accessScope.role === 'admin' ? '#2C1810' : '#8B7355',
                    }}
                />

                <label className="block text-xs mt-3 mb-1" style={{ color: '#6B5744' }}>Invitation Link</label>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
                  <input
                    value={invitationPreviewLink}
                    readOnly
                    className="w-full px-3 py-2 rounded-lg"
                    style={{
                      border: '1.5px solid #E8D5B7',
                      background: '#FFF8EE',
                      color: '#8B7355',
                    }}
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      if (!invitationPreviewLink) return;
                      await navigator.clipboard.writeText(invitationPreviewLink);
                      notify('Invitation link copied.');
                    }}
                    className="px-4 py-2 rounded-lg text-sm"
                    style={{ background: '#C9A96E', color: '#fff' }}
                    disabled={!invitationPreviewLink}
                  >
                    Copy Link
                  </button>
                </div>
                <p className="text-xs mt-1" style={{ color: '#8B7355' }}>
                  {accessScope.role === 'admin'
                    ? `Enter domain only. Slug auto-appends from current wedding (${selectedWedding?.slug || 'no-slug'}).`
                    : 'Visible only. Ask admin if this link needs to be changed.'}
                </p>
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: '#6B5744' }}>Mark Calendar: Day Label</label>
                <input value={details.event_day_label} onChange={(e) => setDetails((p) => ({ ...p, event_day_label: e.target.value }))} placeholder="Saturday" className="w-full px-3 py-2 rounded-lg" style={{ border: `1.5px solid ${isCoreFieldDirty('event_day_label') ? '#DC2626' : '#E8D5B7'}` }} />
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: '#6B5744' }}>Mark Calendar: Time Note</label>
                <input value={details.event_time_note} onChange={(e) => setDetails((p) => ({ ...p, event_time_note: e.target.value }))} placeholder="Reception to follow" className="w-full px-3 py-2 rounded-lg" style={{ border: `1.5px solid ${isCoreFieldDirty('event_time_note') ? '#DC2626' : '#E8D5B7'}` }} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs mb-1" style={{ color: '#6B5744' }}>Mark Calendar: Venue Location</label>
                <input value={details.event_location_label} onChange={(e) => setDetails((p) => ({ ...p, event_location_label: e.target.value }))} placeholder="Las Piñas City, Philippines" className="w-full px-3 py-2 rounded-lg" style={{ border: `1.5px solid ${isCoreFieldDirty('event_location_label') ? '#DC2626' : '#E8D5B7'}` }} />
              </div>
            </div>

            <button onClick={saveWedding} className="px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2" style={{ background: '#C9A96E', color: '#fff' }}>
              <Save className="w-4 h-4" /> Save Wedding
            </button>
          </section>
        )}

        {tab === 'sections' && (
          <section className="p-5 rounded-xl space-y-3" style={{ background: '#fff', border: '1px solid #E8D5B7' }}>
            <h2 className="font-serif text-xl" style={{ color: '#2C1810' }}>Section Toggles</h2>
            {[...sections]
              .filter((section) => section.section_key !== 'hero')
              .filter((section) => section.section_key !== 'hero_date')
              .sort((a, b) => {
                const ai = SECTION_DISPLAY_ORDER[a.section_key] ?? 999;
                const bi = SECTION_DISPLAY_ORDER[b.section_key] ?? 999;
                if (ai !== bi) return ai - bi;
                return (a.sort_order || 0) - (b.sort_order || 0);
              })
              .map((section) => (
              <div key={section.id} className="p-3 rounded-lg space-y-3" style={{ border: `1px solid ${isSectionRowDirty(section.id) ? '#DC2626' : '#E8D5B7'}` }}>
                <div className="flex items-center justify-between">
                  <div>
                  <p className="font-serif" style={{ color: '#2C1810' }}>{section.name}</p>
                  </div>
                  <button
                    onClick={() =>
                      setSections((prev) =>
                        prev.map((row) => (row.id === section.id ? { ...row, is_enabled: !row.is_enabled } : row)),
                      )
                    }
                    className="px-3 py-1.5 rounded text-xs"
                    style={{ background: section.is_enabled ? '#DCFCE7' : '#FEE2E2', color: section.is_enabled ? '#166534' : '#B91C1C' }}
                  >
                    {section.is_enabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>

                {section.is_enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {isSectionContentEditable(section.section_key) && (
                      <div className="md:col-span-2">
                        <label className="block text-xs mb-1" style={{ color: '#6B5744' }}>
                          Section Content (shown on this section in frontend)
                        </label>
                        <textarea
                          rows={3}
                          value={getEffectiveSectionContent(section)}
                          onChange={(e) =>
                            setSections((prev) =>
                              prev.map((row) => (row.id === section.id ? { ...row, content_text: e.target.value } : row)),
                            )
                          }
                          className="w-full px-3 py-2 rounded-lg"
                          style={{ border: '1.5px solid #E8D5B7' }}
                        />
                      </div>
                    )}
                    {section.section_key === 'hero_title' && (
                      <div className="md:col-span-2">
                        <label className="block text-xs mb-1" style={{ color: '#6B5744' }}>
                          Hero Title
                        </label>
                        <input
                          value={details.blessing_text}
                          onChange={(e) => setDetails((prev) => ({ ...prev, blessing_text: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg"
                          style={{ border: '1.5px solid #E8D5B7' }}
                        />
                      </div>
                    )}
                    {section.section_key === 'hero_subtitle' && (
                      <div className="md:col-span-2">
                        <label className="block text-xs mb-1" style={{ color: '#6B5744' }}>
                          Hero Subtitle
                        </label>
                        <input
                          value={details.hero_subtitle}
                          onChange={(e) => setDetails((prev) => ({ ...prev, hero_subtitle: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg"
                          style={{ border: '1.5px solid #E8D5B7' }}
                        />
                      </div>
                    )}
                    {section.section_key === 'hero_couple_text' && (
                      <div className="md:col-span-2">
                        <label className="block text-xs mb-1" style={{ color: '#6B5744' }}>
                          Hero Couple Text
                        </label>
                        <input
                          value={getEffectiveSectionContent(section)}
                          readOnly
                          className="w-full px-3 py-2 rounded-lg"
                          style={{ border: '1.5px solid #E8D5B7', background: '#F8F4EC', color: '#8B7355' }}
                        />
                        <p className="mt-1 text-xs" style={{ color: '#8B7355' }}>
                          This is auto-generated from Bride Name and Groom Name in Core.
                        </p>
                      </div>
                    )}
                    {managedInSeparateTab(section.section_key) && section.section_key !== 'hero' && (
                      <p className="md:col-span-2 text-xs" style={{ color: '#8B7355' }}>
                        {`Content for this section is managed in the ${section.section_key === 'entourage' ? 'entourage' : 'events'} tab.`}
                      </p>
                    )}
                    {accessScope.role === 'admin' && (
                      <>
                        <div>
                          <label className="block text-xs mb-1" style={{ color: '#6B5744' }}>Section Animation</label>
                          <select
                            value={normalizeAnimation(section.animation)}
                            onChange={(e) =>
                              setSections((prev) =>
                                prev.map((row) => (row.id === section.id ? { ...row, animation: e.target.value } : row)),
                              )
                            }
                            className="w-full px-3 py-2 rounded-lg"
                            style={{ border: '1.5px solid #E8D5B7' }}
                          >
                            {ANIMATION_OPTIONS.map((anim) => (
                              <option key={anim} value={anim}>
                                {anim}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs mb-1" style={{ color: '#6B5744' }}>Animation Duration (ms)</label>
                          <input
                            type="number"
                            min={100}
                            max={4000}
                            value={sectionTimingDrafts[section.id]?.duration ?? String(section.animation_duration_ms)}
                            onChange={(e) =>
                              setSectionTimingDrafts((prev) => ({
                                ...prev,
                                [section.id]: { ...(prev[section.id] || {}), duration: e.target.value },
                              }))
                            }
                            onBlur={(e) => {
                              const parsed = Number(e.target.value);
                              const nextValue = Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : 1;
                              setSections((prev) =>
                                prev.map((row) =>
                                  row.id === section.id ? { ...row, animation_duration_ms: nextValue } : row,
                                ),
                              );
                              setSectionTimingDrafts((prev) => ({
                                ...prev,
                                [section.id]: { ...(prev[section.id] || {}), duration: String(nextValue) },
                              }));
                            }}
                            className="w-full px-3 py-2 rounded-lg"
                            style={{ border: '1.5px solid #E8D5B7' }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs mb-1" style={{ color: '#6B5744' }}>Animation Delay / Order (ms)</label>
                          <input
                            type="number"
                            min={0}
                            max={5000}
                            value={sectionTimingDrafts[section.id]?.delay ?? String(section.animation_delay_ms)}
                            onChange={(e) =>
                              setSectionTimingDrafts((prev) => ({
                                ...prev,
                                [section.id]: { ...(prev[section.id] || {}), delay: e.target.value },
                              }))
                            }
                            onBlur={(e) => {
                              const parsed = Number(e.target.value);
                              const nextValue = Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : 1;
                              setSections((prev) =>
                                prev.map((row) =>
                                  row.id === section.id ? { ...row, animation_delay_ms: nextValue } : row,
                                ),
                              );
                              setSectionTimingDrafts((prev) => ({
                                ...prev,
                                [section.id]: { ...(prev[section.id] || {}), delay: String(nextValue) },
                              }));
                            }}
                            className="w-full px-3 py-2 rounded-lg"
                            style={{ border: '1.5px solid #E8D5B7' }}
                          />
                        </div>
                      </>
                    )}
                    {accessScope.role === 'admin' && (!managedInSeparateTab(section.section_key) || hasDedicatedSectionField(section.section_key)) && (
                      <div className="md:col-span-2">
                        <label className="block text-xs mb-1" style={{ color: '#6B5744' }}>Animation Preview</label>
                        {(() => {
                          const previewText = getEffectiveSectionContent(section) || `${section.name} preview text will appear like this on the frontend.`;
                          const isLetterFall = normalizeAnimation(section.animation) === 'reveal-fall-letters';
                          if (isLetterFall) {
                            return (
                              <div
                                key={`${section.id}-${normalizeAnimation(section.animation)}-${previewText}`}
                                className="rounded-lg px-4 py-3"
                                style={{
                                  border: '1px dashed #E8D5B7',
                                  background: '#FFFDF9',
                                  color: '#6B5744',
                                }}
                              >
                                {Array.from(previewText).map((char, idx) => (
                                  char === ' ' ? (
                                    <span key={`${section.id}-fall-space-${idx}`}> </span>
                                  ) : (
                                    <span
                                      key={`${section.id}-fall-${idx}`}
                                      className="fall-letter"
                                      style={{
                                        animationDuration: `${Math.max(220, section.animation_duration_ms || 850)}ms`,
                                        animationDelay: `${Math.max(0, section.animation_delay_ms || 0) + idx * 35}ms`,
                                      }}
                                    >
                                      {char}
                                    </span>
                                  )
                                ))}
                              </div>
                            );
                          }
                          return (
                        <div
                          key={`${section.id}-${normalizeAnimation(section.animation)}-${previewText}`}
                          className={`${normalizeAnimation(section.animation)} rounded-lg px-4 py-3`}
                          style={{
                            border: '1px dashed #E8D5B7',
                            background: '#FFFDF9',
                            color: '#6B5744',
                            animationDuration: `${Math.max(100, section.animation_duration_ms || 850)}ms`,
                            animationDelay: `${Math.max(0, section.animation_delay_ms || 0)}ms`,
                          }}
                        >
                          {previewText}
                        </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={() => saveSection(section)}
                  className="px-3 py-1.5 rounded text-xs inline-flex items-center gap-1"
                  style={{ background: '#C9A96E', color: '#fff' }}
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Section
                </button>
              </div>
            ))}
          </section>
        )}

        {tab === 'events' && (
          <section className="p-5 rounded-xl space-y-4" style={{ background: '#fff', border: '1px solid #E8D5B7' }}>
            <h2 className="font-serif text-xl" style={{ color: '#2C1810' }}>Programme</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input value={newEvent.event_name} onChange={(e) => setNewEvent((p) => ({ ...p, event_name: e.target.value }))} placeholder="Event name" className="px-3 py-2 rounded-lg" style={{ border: '1.5px solid #E8D5B7' }} />
              <input
                type="time"
                value={toTimeInputValue(newEvent.time_label)}
                onChange={(e) => setNewEvent((p) => ({ ...p, time_label: fromTimeInputValue(e.target.value) }))}
                className="px-3 py-2 rounded-lg"
                style={{ border: '1.5px solid #E8D5B7' }}
              />
              <select value={newEvent.icon} onChange={(e) => setNewEvent((p) => ({ ...p, icon: e.target.value }))} className="px-3 py-2 rounded-lg" style={{ border: '1.5px solid #E8D5B7' }}>
                {EVENT_ICON_OPTIONS.map((icon) => <option key={icon} value={icon}>{formatSelectLabel(icon)}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={addEvent} className="px-4 py-2 rounded-lg text-sm" style={{ background: '#C9A96E', color: '#fff' }}>Add Programme Item</button>
            </div>
            <p className="text-xs" style={{ color: '#8B7355' }}>
              Events are auto-ordered by selected time.
            </p>
            {events.map((event) => (
              <div key={event.id} className="p-3 rounded-lg space-y-2" style={{ border: '1px solid #E8D5B7' }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input value={event.event_name} onChange={(e) => setEvents((prev) => prev.map((item) => (item.id === event.id ? { ...item, event_name: e.target.value } : item)))} className="px-3 py-2 rounded-lg" style={{ border: `1.5px solid ${isEventFieldDirty(event.id, 'event_name') ? '#DC2626' : '#E8D5B7'}` }} />
                  <input
                    type="time"
                    value={toTimeInputValue(event.time_label)}
                    onChange={(e) =>
                      setEvents((prev) =>
                        prev.map((item) => (item.id === event.id ? { ...item, time_label: fromTimeInputValue(e.target.value) } : item)),
                      )
                    }
                    className="px-3 py-2 rounded-lg"
                    style={{ border: `1.5px solid ${isEventFieldDirty(event.id, 'time_label') ? '#DC2626' : '#E8D5B7'}` }}
                  />
                  <select value={event.icon} onChange={(e) => setEvents((prev) => prev.map((item) => (item.id === event.id ? { ...item, icon: e.target.value } : item)))} className="px-3 py-2 rounded-lg" style={{ border: `1.5px solid ${isEventFieldDirty(event.id, 'icon') ? '#DC2626' : '#E8D5B7'}` }}>
                    {EVENT_ICON_OPTIONS.map((icon) => <option key={icon} value={icon}>{formatSelectLabel(icon)}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs" style={{ color: isEventFieldDirty(event.id, 'is_visible') ? '#B91C1C' : undefined }}><input type="checkbox" checked={event.is_visible} onChange={(e) => setEvents((prev) => prev.map((item) => (item.id === event.id ? { ...item, is_visible: e.target.checked } : item)))} /> Visible</label>
                  <button onClick={() => saveEvent(event)} className="px-3 py-1.5 rounded text-xs" style={{ background: '#C9A96E', color: '#fff' }}>Save</button>
                  <button onClick={() => deleteEvent(event.id)} className="px-3 py-1.5 rounded text-xs" style={{ background: '#FEE2E2', color: '#B91C1C' }}>Delete</button>
                </div>
              </div>
            ))}
          </section>
        )}

        {tab === 'entourage' && (
          <section className="p-5 rounded-xl space-y-4" style={{ background: '#fff', border: '1px solid #E8D5B7' }}>
            <h2 className="font-serif text-xl" style={{ color: '#2C1810' }}>Entourage Manager</h2>
            <div>
              <label className="block text-xs mb-1" style={{ color: '#6B5744' }}>Closing Verse / Quote (shown at bottom of entourage section)</label>
              <textarea
                rows={2}
                value={details.entourage_verse}
                onChange={(e) => setDetails((p) => ({ ...p, entourage_verse: e.target.value }))}
                placeholder='"And above all these things put on love which is the bond of perfectness." - Colossians 3:14'
                className="w-full px-3 py-2 rounded-lg"
                style={{ border: '1.5px solid #E8D5B7' }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <input value={newEntourage.name} onChange={(e) => setNewEntourage((p) => ({ ...p, name: e.target.value }))} placeholder="Name" className="px-3 py-2 rounded-lg" style={{ border: '1.5px solid #E8D5B7' }} />
              
              <select value={newEntourage.group_name} onChange={(e) => setNewEntourage((p) => ({ ...p, group_name: e.target.value }))} className="px-3 py-2 rounded-lg" style={{ border: '1.5px solid #E8D5B7' }}>
                {ENTOURAGE_GROUP_OPTIONS.map((group) => <option key={group} value={group}>{formatSelectLabel(group)}</option>)}
              </select>
              <input type="number" value={newEntourage.sort_order} onChange={(e) => setNewEntourage((p) => ({ ...p, sort_order: Number(e.target.value) || 0 }))} placeholder="Sort order" className="px-3 py-2 rounded-lg" style={{ border: '1.5px solid #E8D5B7' }} />
            </div>
            <div className="flex items-center gap-2">
              <button onClick={addEntourageMember} className="px-4 py-2 rounded-lg text-sm" style={{ background: '#C9A96E', color: '#fff' }}>Add Entourage</button>
              <button onClick={saveEntourageVerse} className="px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2" style={{ background: '#C9A96E', color: '#fff' }}>
                <Save className="w-4 h-4" /> Save Verse
              </button>
            </div>
            {entourageMembers.map((member) => (
              <div key={member.id} className="p-3 rounded-lg space-y-2" style={{ border: '1px solid #E8D5B7' }}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <input value={member.name} onChange={(e) => setEntourageMembers((prev) => prev.map((item) => (item.id === member.id ? { ...item, name: e.target.value } : item)))} className="px-3 py-2 rounded-lg" style={{ border: `1.5px solid ${isEntourageFieldDirty(member.id, 'name') ? '#DC2626' : '#E8D5B7'}` }} />
                  
                  <select value={member.group_name} onChange={(e) => setEntourageMembers((prev) => prev.map((item) => (item.id === member.id ? { ...item, group_name: e.target.value } : item)))} className="px-3 py-2 rounded-lg" style={{ border: `1.5px solid ${isEntourageFieldDirty(member.id, 'group_name') ? '#DC2626' : '#E8D5B7'}` }}>
                    {ENTOURAGE_GROUP_OPTIONS.map((group) => <option key={group} value={group}>{formatSelectLabel(group)}</option>)}
                  </select>
                  <input type="number" value={member.sort_order} onChange={(e) => setEntourageMembers((prev) => prev.map((item) => (item.id === member.id ? { ...item, sort_order: Number(e.target.value) || 0 } : item)))} className="px-3 py-2 rounded-lg" style={{ border: `1.5px solid ${isEntourageFieldDirty(member.id, 'sort_order') ? '#DC2626' : '#E8D5B7'}` }} />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs" style={{ color: isEntourageFieldDirty(member.id, 'is_visible') ? '#B91C1C' : undefined }}><input type="checkbox" checked={member.is_visible} onChange={(e) => setEntourageMembers((prev) => prev.map((item) => (item.id === member.id ? { ...item, is_visible: e.target.checked } : item)))} /> Visible</label>
                  <button onClick={() => saveEntourageMember(member)} className="px-3 py-1.5 rounded text-xs" style={{ background: '#C9A96E', color: '#fff' }}>Save</button>
                  <button onClick={() => deleteEntourageMember(member.id)} className="px-3 py-1.5 rounded text-xs" style={{ background: '#FEE2E2', color: '#B91C1C' }}>Delete</button>
                </div>
              </div>
            ))}
          </section>
        )}

        {tab === 'faq' && (
          <section className="p-5 rounded-xl space-y-4" style={{ background: '#fff', border: '1px solid #E8D5B7' }}>
            <h2 className="font-serif text-xl" style={{ color: '#2C1810' }}>FAQ Manager</h2>
            <div className="grid grid-cols-1 gap-2">
              <input value={newFaq.question} onChange={(e) => setNewFaq((p) => ({ ...p, question: e.target.value }))} placeholder="Question" className="px-3 py-2 rounded-lg" style={{ border: '1.5px solid #E8D5B7' }} />
              <textarea value={newFaq.answer} onChange={(e) => setNewFaq((p) => ({ ...p, answer: e.target.value }))} placeholder="Answer" rows={3} className="px-3 py-2 rounded-lg" style={{ border: '1.5px solid #E8D5B7' }} />
              <button onClick={addFaq} className="w-fit px-4 py-2 rounded-lg text-sm" style={{ background: '#C9A96E', color: '#fff' }}>Add FAQ</button>
            </div>
            {faqs.map((faq) => (
              <div key={faq.id} className="p-3 rounded-lg" style={{ border: '1px solid #E8D5B7' }}>
                <input value={faq.question} onChange={(e) => setFaqs((prev) => prev.map((f) => (f.id === faq.id ? { ...f, question: e.target.value } : f)))} className="w-full px-3 py-2 rounded-lg mb-2" style={{ border: `1.5px solid ${isFaqFieldDirty(faq.id, 'question') ? '#DC2626' : '#E8D5B7'}` }} />
                <textarea value={faq.answer} onChange={(e) => setFaqs((prev) => prev.map((f) => (f.id === faq.id ? { ...f, answer: e.target.value } : f)))} rows={3} className="w-full px-3 py-2 rounded-lg" style={{ border: `1.5px solid ${isFaqFieldDirty(faq.id, 'answer') ? '#DC2626' : '#E8D5B7'}` }} />
                <div className="mt-2 flex items-center gap-2">
                  <label className="text-xs" style={{ color: isFaqFieldDirty(faq.id, 'is_visible') ? '#B91C1C' : undefined }}>
                    <input type="checkbox" checked={faq.is_visible} onChange={(e) => setFaqs((prev) => prev.map((f) => (f.id === faq.id ? { ...f, is_visible: e.target.checked } : f)))} /> Visible
                  </label>
                  <button onClick={() => saveFaq(faq)} className="px-3 py-1.5 rounded text-xs" style={{ background: '#C9A96E', color: '#fff' }}>Save</button>
                  <button onClick={() => deleteFaq(faq.id)} className="px-3 py-1.5 rounded text-xs inline-flex items-center gap-1" style={{ background: '#FEE2E2', color: '#B91C1C' }}>
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </section>
        )}

        {tab === 'gallery' && (
          <section className="p-5 rounded-xl space-y-4" style={{ background: '#fff', border: '1px solid #E8D5B7' }}>
            <h2 className="font-serif text-xl" style={{ color: '#2C1810' }}>Gallery Manager</h2>
            <div className="rounded-xl p-4 space-y-4" style={{ border: '1px solid #E8D5B7', background: '#FFFDF9' }}>
              <h3 className="font-serif text-lg" style={{ color: '#2C1810' }}>All Image Uploads</h3>
              <p className="text-xs" style={{ color: '#8B7355' }}>
                Upload Hero, Venue, Dress Code, and Event Gallery images in one place.
              </p>
              <div className="space-y-3">
                <div className="p-3 rounded-lg" style={{ border: `1px solid ${hasDirtyLabel('Hero/Venue Draft Uploads') ? '#DC2626' : '#E8D5B7'}` }}>
                  <label className="block text-xs mb-2">Hero Image</label>
                  <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-3">
                    <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #E8D5B7', background: '#fff' }}>
                      {(contentPreviewUrls.hero || details.hero_image_url) ? (
                        <img src={contentPreviewUrls.hero || details.hero_image_url} alt="Hero preview" className="w-full h-28 object-contain" style={{ background: '#F7F0E4' }} />
                      ) : (
                        <p className="text-xs px-3 py-6" style={{ color: '#8B7355' }}>No hero image preview yet.</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <input
                        value={details.hero_image_url}
                        onChange={(e) => setDetails((p) => ({ ...p, hero_image_url: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg"
                        style={{ border: '1.5px solid #E8D5B7' }}
                      />
                      <label className="text-sm inline-flex items-center gap-2 px-3 py-2 rounded-lg w-fit" style={{ border: '1.5px solid #E8D5B7' }}>
                        <Upload className="w-4 h-4" />
                        <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && setContentDraftFile(e.target.files[0], 'hero', 'hero_image_url')} />
                      </label>
                      <div className="flex items-center gap-2">
                        <button onClick={() => saveContentImageSlot('hero')} className="px-3 py-1.5 rounded text-xs w-fit" style={{ background: '#C9A96E', color: '#fff' }}>Save</button>
                        <button onClick={() => clearContentImageSlot('hero')} className="px-3 py-1.5 rounded text-xs w-fit" style={{ background: '#FEE2E2', color: '#B91C1C' }}>Delete</button>
                      </div>
                      <p className="text-xs" style={{ color: '#8B7355' }}>
                        Recommended hero size: 1920 x 1080 (16:9).
                        {heroMeta ? ` Current image: ${heroMeta.width} x ${heroMeta.height}.` : ''}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg" style={{ border: `1px solid ${hasDirtyLabel('Hero/Venue Draft Uploads') ? '#DC2626' : '#E8D5B7'}` }}>
                  <label className="block text-xs mb-2">Venue Image</label>
                  <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-3">
                    <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #E8D5B7', background: '#fff' }}>
                      {(contentPreviewUrls.venue || details.venue_image_url) ? (
                        <img src={contentPreviewUrls.venue || details.venue_image_url} alt="Venue preview" className="w-full h-28 object-contain" style={{ background: '#F7F0E4' }} />
                      ) : (
                        <p className="text-xs px-3 py-6" style={{ color: '#8B7355' }}>No venue image preview yet.</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <input
                        value={details.venue_image_url}
                        onChange={(e) => setDetails((p) => ({ ...p, venue_image_url: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg"
                        style={{ border: '1.5px solid #E8D5B7' }}
                      />
                      <label className="text-sm inline-flex items-center gap-2 px-3 py-2 rounded-lg w-fit" style={{ border: '1.5px solid #E8D5B7' }}>
                        <Upload className="w-4 h-4" />
                        <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && setContentDraftFile(e.target.files[0], 'venue', 'venue_image_url')} />
                      </label>
                      <div className="flex items-center gap-2">
                        <button onClick={() => saveContentImageSlot('venue')} className="px-3 py-1.5 rounded text-xs w-fit" style={{ background: '#C9A96E', color: '#fff' }}>Save</button>
                        <button onClick={() => clearContentImageSlot('venue')} className="px-3 py-1.5 rounded text-xs w-fit" style={{ background: '#FEE2E2', color: '#B91C1C' }}>Delete</button>
                      </div>
                      <p className="text-xs" style={{ color: '#8B7355' }}>
                        Recommended venue size: 1600 x 900 (16:9).
                        {venueMeta ? ` Current image: ${venueMeta.width} x ${venueMeta.height}.` : ''}
                      </p>
                    </div>
                  </div>
                </div>

                {[1, 2, 3].map((slot) => {
                  const imageKey = `dress_code_image_${slot}` as 'dress_code_image_1' | 'dress_code_image_2' | 'dress_code_image_3';
                  const visibleKey = `dress_code_image_${slot}_visible` as 'dress_code_image_1_visible' | 'dress_code_image_2_visible' | 'dress_code_image_3_visible';
                  const draftPreview = dressCodePreviewUrls[slot as DressCodeSlot];
                  const displayPreview = draftPreview || details[imageKey];
                  return (
                    <div key={slot} className="p-3 rounded-lg" style={{ border: `1px solid ${hasDirtyLabel('Dress Code Draft Uploads') ? '#DC2626' : '#E8D5B7'}` }}>
                      <label className="block text-xs mb-2">{`Dress Code Image ${slot}`}</label>
                      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-3">
                        <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #E8D5B7', background: '#fff' }}>
                          {displayPreview ? (
                            <img src={displayPreview} alt={`Dress code ${slot} preview`} className="w-full h-28 object-cover" />
                          ) : (
                            <p className="text-xs px-3 py-6" style={{ color: '#8B7355' }}>No image yet.</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <input
                            value={details[imageKey]}
                            onChange={(e) => setDetails((p) => ({ ...p, [imageKey]: e.target.value }))}
                            className="w-full px-3 py-2 rounded-lg"
                            style={{ border: '1.5px solid #E8D5B7' }}
                          />
                          <label className="text-sm inline-flex items-center gap-2 px-3 py-2 rounded-lg w-fit" style={{ border: '1.5px solid #E8D5B7' }}>
                            <Upload className="w-4 h-4" />
                            <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && setDressCodeDraftFile(e.target.files[0], slot as DressCodeSlot, imageKey)} />
                          </label>
                          <div className="flex items-center gap-2">
                            <label className="text-xs"><input type="checkbox" checked={details[visibleKey]} onChange={(e) => setDetails((p) => ({ ...p, [visibleKey]: e.target.checked }))} /> Visible</label>
                            <button onClick={() => saveDressCodeImageSlot(slot as 1 | 2 | 3)} className="px-3 py-1.5 rounded text-xs" style={{ background: '#C9A96E', color: '#fff' }}>Save</button>
                            <button onClick={() => clearDressCodeImageSlot(slot as 1 | 2 | 3)} className="px-3 py-1.5 rounded text-xs" style={{ background: '#FEE2E2', color: '#B91C1C' }}>Delete</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <h3 className="font-serif text-lg" style={{ color: '#2C1810' }}>Event Gallery Images</h3>
            <label className="text-sm inline-flex items-center gap-2 px-3 py-2 rounded-lg" style={{ border: '1.5px solid #E8D5B7' }}>
              <Upload className="w-4 h-4" />
              <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && stageGalleryImage(e.target.files[0])} />
            </label>
            {newGalleryDraft.file && (
              <div className="p-3 rounded-lg" style={{ border: `1px solid ${hasDirtyLabel('New Gallery Draft') ? '#DC2626' : '#E8D5B7'}` }}>
                <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-2">
                  <img src={newGalleryDraft.previewUrl} alt="New gallery preview" className="w-full h-24 object-cover rounded-lg" />
                  <div className="space-y-2">
                    <input
                      value={newGalleryDraft.title}
                      onChange={(e) => setNewGalleryDraft((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Title"
                      className="w-full px-3 py-2 rounded-lg"
                      style={{ border: '1.5px solid #E8D5B7' }}
                    />
                    <div className="flex items-center gap-2">
                      <label className="text-xs"><input type="checkbox" checked={newGalleryDraft.is_visible} onChange={(e) => setNewGalleryDraft((prev) => ({ ...prev, is_visible: e.target.checked }))} /> Visible</label>
                      <button
                        onClick={saveNewGalleryDraft}
                        className="px-3 py-1.5 rounded text-xs"
                        style={{ background: '#C9A96E', color: '#fff' }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          if (newGalleryDraft.previewUrl) URL.revokeObjectURL(newGalleryDraft.previewUrl);
                          setNewGalleryDraft({ file: null, previewUrl: '', title: '', is_visible: true });
                        }}
                        className="px-3 py-1.5 rounded text-xs"
                        style={{ background: '#FEE2E2', color: '#B91C1C' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {gallery.map((item) => (
              <div key={item.id} className="p-3 rounded-lg" style={{ border: '1px solid #E8D5B7' }}>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                  <img src={item.image_url} alt={item.title} className="w-full h-24 object-cover rounded-lg" />
                  <div className="md:col-span-4 space-y-2">
                    <input value={item.title} onChange={(e) => setGallery((prev) => prev.map((g) => (g.id === item.id ? { ...g, title: e.target.value } : g)))} placeholder="Title" className="w-full px-3 py-2 rounded-lg" style={{ border: `1.5px solid ${isGalleryFieldDirty(item.id, 'title') ? '#DC2626' : '#E8D5B7'}` }} />
                    <input value={item.image_url} onChange={(e) => setGallery((prev) => prev.map((g) => (g.id === item.id ? { ...g, image_url: e.target.value } : g)))} placeholder="Image URL" className="w-full px-3 py-2 rounded-lg" style={{ border: `1.5px solid ${isGalleryFieldDirty(item.id, 'image_url') ? '#DC2626' : '#E8D5B7'}` }} />
                    <div className="flex items-center gap-2">
                      <label className="text-xs" style={{ color: isGalleryFieldDirty(item.id, 'is_visible') ? '#B91C1C' : undefined }}><input type="checkbox" checked={item.is_visible} onChange={(e) => setGallery((prev) => prev.map((g) => (g.id === item.id ? { ...g, is_visible: e.target.checked } : g)))} /> Visible</label>
                      <button onClick={() => saveGalleryItem(item)} className="px-3 py-1.5 rounded text-xs" style={{ background: '#C9A96E', color: '#fff' }}>Save</button>
                      <button onClick={() => deleteGalleryItem(item.id)} className="px-3 py-1.5 rounded text-xs" style={{ background: '#FEE2E2', color: '#B91C1C' }}>Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {tab === 'users' && accessScope.role === 'admin' && (
          <section className="p-5 rounded-xl space-y-4" style={{ background: '#fff', border: '1px solid #E8D5B7' }}>
            <h2 className="font-serif text-xl" style={{ color: '#2C1810' }}>User Access Manager</h2>
            <p className="text-sm" style={{ color: '#6B5744' }}>
              Create editor accounts and assign one wedding per account.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <select
                value={newUser.wedding_id}
                onChange={(e) => setNewUser((prev) => ({ ...prev, wedding_id: e.target.value }))}
                className="px-3 py-2 rounded-lg"
                style={{ border: '1.5px solid #E8D5B7' }}
              >
                <option value="">Select wedding</option>
                {weddings.map((wedding) => (
                  <option key={wedding.id} value={wedding.id}>
                    {wedding.title} ({wedding.slug})
                  </option>
                ))}
              </select>
              <input
                value={newUser.username}
                onChange={(e) => setNewUser((prev) => ({ ...prev, username: e.target.value }))}
                placeholder="login email"
                className="px-3 py-2 rounded-lg"
                style={{ border: '1.5px solid #E8D5B7' }}
              />
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="password"
                className="px-3 py-2 rounded-lg"
                style={{ border: '1.5px solid #E8D5B7' }}
              />
              <button onClick={createCmsUser} className="px-4 py-2 rounded-lg text-sm inline-flex items-center justify-center gap-2" style={{ background: '#C9A96E', color: '#fff' }}>
                <Plus className="w-4 h-4" /> Add User
              </button>
            </div>

            <p className="text-xs" style={{ color: '#8B7355' }}>
              The login email/password must match the Supabase Auth account for this user.
            </p>

            {userAccounts.map((user) => {
              const assignedWedding = weddings.find((wedding) => wedding.id === user.wedding_id);
              return (
                <div key={user.id} className="p-3 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-2" style={{ border: '1px solid #E8D5B7' }}>
                  <div>
                    <p className="font-medium" style={{ color: '#2C1810' }}>{user.username}</p>
                    <p className="text-xs" style={{ color: '#8B7355' }}>
                      Wedding: {assignedWedding ? `${assignedWedding.title} (${assignedWedding.slug})` : user.wedding_id}
                    </p>
                  </div>
                  <button onClick={() => deleteCmsUser(user.id)} className="px-3 py-1.5 rounded text-xs inline-flex items-center gap-1 w-fit" style={{ background: '#FEE2E2', color: '#B91C1C' }}>
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              );
            })}
          </section>
        )}

        {tab === 'rsvps' && (
          <section className="p-5 rounded-xl space-y-3" style={{ background: '#fff', border: '1px solid #E8D5B7' }}>
            <h2 className="font-serif text-xl" style={{ color: '#2C1810' }}>RSVPs</h2>
            <p className="text-sm" style={{ color: '#6B5744' }}>
              Total: {stats.total} | Attending: {stats.attending} | Declined: {stats.declined} | Guests: {stats.guests}
            </p>
            {rsvps.map((rsvp) => (
              <div key={rsvp.id} className="p-3 rounded-lg" style={{ border: '1px solid #E8D5B7' }}>
                <p className="font-serif" style={{ color: '#2C1810' }}>{rsvp.guest_name}</p>
                <p className="text-sm" style={{ color: '#6B5744' }}>{rsvp.email} | {rsvp.phone || 'No phone'}</p>
                <p className="text-sm" style={{ color: '#6B5744' }}>
                  {rsvp.attending ? 'Attending' : 'Declined'} • Guests: {rsvp.number_of_guests} • Meal: {rsvp.meal_preference || 'N/A'}
                </p>
                {rsvp.message && <p className="text-sm mt-1" style={{ color: '#8B7355' }}>{rsvp.message}</p>}
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
