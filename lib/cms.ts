import { createClient } from '@supabase/supabase-js';
import {
  defaultSectionConfigs,
  defaultWeddingContent,
  type FaqItem,
  type GalleryImageItem,
  type SectionConfig,
  type WeddingContent,
} from '@/lib/cms-defaults';

type PublicSiteData = {
  content: WeddingContent;
  sections: Record<string, boolean>;
  sectionList: SectionConfig[];
  faqs: FaqItem[];
  gallery: GalleryImageItem[];
};

function createPublicSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

function asWeddingContent(content: unknown): WeddingContent {
  if (!content || typeof content !== 'object') {
    return defaultWeddingContent;
  }

  return {
    ...defaultWeddingContent,
    ...(content as Partial<WeddingContent>),
    entourage: {
      ...defaultWeddingContent.entourage,
      ...((content as Partial<WeddingContent>).entourage || {}),
    },
  };
}

function toSectionMap(sections: SectionConfig[]): Record<string, boolean> {
  const fallback = defaultSectionConfigs.reduce<Record<string, boolean>>((acc, section) => {
    acc[section.key] = section.is_enabled;
    return acc;
  }, {});

  return sections.reduce<Record<string, boolean>>((acc, section) => {
    acc[section.key] = section.is_enabled;
    return acc;
  }, fallback);
}

export async function getPublicSiteData(): Promise<PublicSiteData> {
  const supabase = createPublicSupabaseClient();

  if (!supabase) {
    return {
      content: defaultWeddingContent,
      sections: toSectionMap(defaultSectionConfigs),
      sectionList: defaultSectionConfigs,
      faqs: [],
      gallery: [],
    };
  }

  try {
    const [contentRes, sectionsRes, faqsRes, galleryRes] = await Promise.all([
      supabase.from('wedding_content').select('content').eq('id', 1).maybeSingle(),
      supabase.from('section_configs').select('*').order('sort_order', { ascending: true }),
      supabase
        .from('faqs')
        .select('*')
        .eq('is_enabled', true)
        .order('sort_order', { ascending: true }),
      supabase
        .from('gallery_images')
        .select('*')
        .eq('is_enabled', true)
        .order('sort_order', { ascending: true }),
    ]);

    const sectionList = (sectionsRes.data?.length ? sectionsRes.data : defaultSectionConfigs) as SectionConfig[];

    return {
      content: asWeddingContent(contentRes.data?.content),
      sections: toSectionMap(sectionList),
      sectionList,
      faqs: (faqsRes.data || []) as FaqItem[],
      gallery: (galleryRes.data || []) as GalleryImageItem[],
    };
  } catch {
    return {
      content: defaultWeddingContent,
      sections: toSectionMap(defaultSectionConfigs),
      sectionList: defaultSectionConfigs,
      faqs: [],
      gallery: [],
    };
  }
}

