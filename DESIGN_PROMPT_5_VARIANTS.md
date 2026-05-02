# J7 Wedding CMS Design Prompt (5 Variants)

Use this prompt to generate **5 different beautiful frontend designs** for my existing wedding CMS project, while keeping full compatibility with my current Next.js + Supabase data model.

---

## Prompt To Use

You are a senior frontend/product designer and Next.js engineer.

I have an existing **Wedding CMS** project with a working admin panel and Supabase schema.  
I want you to create **5 clearly different, beautiful design variants** for the public wedding page (`app/[slug]/page.tsx`) that use my existing data structure and section toggles.

### Project Tech + Constraints

- Stack: Next.js App Router + TypeScript + Tailwind + Supabase
- Existing files include:
  - `app/[slug]/page.tsx` (public wedding page)
  - `app/admin/page.tsx` (CMS editor)
  - `components/ScrollReveal.tsx` (animation handler)
  - `lib/wedding-platform.ts` + `lib/cms-defaults.ts` (data mapping)
- Do not break existing admin functionality.
- Do not remove section toggle logic (`isSectionEnabled(...)`).
- Keep existing animations compatible (`data-animate`, `data-anim-duration`, `data-anim-delay`).
- Mobile-first and responsive; no broken text wrapping.
- Keep image handling safe (`object-cover` / `object-contain` depending on section intent).

### Database Structure You Must Respect

Use these existing tables/fields as source of truth:

1. `weddings`
- `id`, `slug`, `title`, `is_active`, `theme_key`

2. `wedding_couples`
- `bride_name`, `groom_name`
- `bride_nickname`, `groom_nickname` (used as bride/groom details)
- `bride_image`, `groom_image`

3. `wedding_details`
- Hero/text: `blessing_text`, `hero_subtitle`, `hero_image_url`
- Date/time: `wedding_date_value`, `ceremony_time_value`, `wedding_date_label`, `wedding_time_label`
- Event card labels: `event_day_label`, `event_time_note`, `event_location_label`
- Invitation: `invitation_eyebrow`, `invitation_title`, `invitation_text`, `invitation_link`
- Story: `story_title`, `story_description`
- Programme/Event title: `event_title`, `programme_title`
- Venue: `venue_title`, `venue_description`, `venue_address_line1`, `venue_address_line2`, `map_link`, `venue_image_url`
- RSVP/footer: `rsvp_title`, `rsvp_deadline_label`, `footer_message`
- Gift registry: `gift_registry_title`, `gift_registry_description`
- Dress code: `dress_code_title`, `dress_code_description`, `dress_code_image_1..3`, `dress_code_image_1_visible..3_visible`
- Entourage extra: `entourage_verse`

4. `wedding_sections`
- `section_key`, `name`, `is_enabled`, `sort_order`
- `content_text`, `animation`, `animation_duration_ms`, `animation_delay_ms`

5. `wedding_events`
- `event_name`, `time_label`, `date_label`, `location_label`, `icon`, `category`, `sort_order`, `is_visible`

6. `wedding_gallery`
- `image_url`, `title`, `category`, `sort_order`, `is_visible`

7. `wedding_faqs`
- `question`, `answer`, `sort_order`, `is_visible`

8. `wedding_entourage`
- `name`, `role`, `group_name`, `sort_order`, `is_visible`

### Required Output

Create **5 variants** with very different visual direction, for example:

1. Minimal Editorial
2. Romantic Classic
3. Modern Luxe
4. Film/Storybook
5. Bold Contemporary

For each variant, provide:

1. **Design concept summary** (color palette, typography, mood)
2. **Section-by-section layout behavior** using my real sections:
   - hero_title, hero_subtitle, hero_couple_text
   - invitation
   - couple_info
   - story
   - event_details
   - gallery
   - programme
   - entourage
   - venue
   - faq
   - gift_registry
   - dress_code
   - rsvp
3. **Animation guidance** mapped to my animation system (`reveal-fade`, `reveal-up`, `reveal-left`, `reveal-right`, `zoom-in`, `reveal-blur-up`, `reveal-rotate-in`, `reveal-flip-up`, `reveal-fall-letters`, `reveal-image-rise`, `reveal-image-zoom`)
4. **Exact implementation plan** for `app/[slug]/page.tsx`:
   - what to change
   - what to keep
   - what CSS/Tailwind utilities to add
5. **Accessibility + mobile checks**
6. **Performance notes** (avoid layout shift, optimize heavy backgrounds/images)
