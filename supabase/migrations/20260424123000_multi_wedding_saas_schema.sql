/*
  # Multi-Wedding SaaS Schema

  This migration adds reusable multi-wedding architecture while preserving
  existing tables.
*/

CREATE TABLE IF NOT EXISTS weddings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wedding_couples (
  wedding_id uuid PRIMARY KEY REFERENCES weddings(id) ON DELETE CASCADE,
  bride_name text NOT NULL,
  groom_name text NOT NULL,
  bride_nickname text NOT NULL DEFAULT '',
  groom_nickname text NOT NULL DEFAULT '',
  bride_image text NOT NULL DEFAULT '',
  groom_image text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wedding_details (
  wedding_id uuid PRIMARY KEY REFERENCES weddings(id) ON DELETE CASCADE,
  blessing_text text NOT NULL DEFAULT '',
  hero_subtitle text NOT NULL DEFAULT '',
  wedding_date_label text NOT NULL DEFAULT '',
  wedding_time_label text NOT NULL DEFAULT '',
  invitation_eyebrow text NOT NULL DEFAULT '',
  invitation_title text NOT NULL DEFAULT '',
  invitation_text text NOT NULL DEFAULT '',
  story_title text NOT NULL DEFAULT '',
  story_description text NOT NULL DEFAULT '',
  event_title text NOT NULL DEFAULT '',
  programme_title text NOT NULL DEFAULT '',
  venue_title text NOT NULL DEFAULT '',
  venue_description text NOT NULL DEFAULT '',
  venue_address_line1 text NOT NULL DEFAULT '',
  venue_address_line2 text NOT NULL DEFAULT '',
  map_link text NOT NULL DEFAULT '',
  hero_image_url text NOT NULL DEFAULT '',
  venue_image_url text NOT NULL DEFAULT '',
  rsvp_title text NOT NULL DEFAULT 'Kindly Reply',
  rsvp_deadline_label text NOT NULL DEFAULT '',
  footer_message text NOT NULL DEFAULT '',
  gift_registry_title text NOT NULL DEFAULT 'Gift Registry',
  gift_registry_description text NOT NULL DEFAULT '',
  dress_code_title text NOT NULL DEFAULT 'Dress Code',
  dress_code_description text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wedding_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id uuid NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  name text NOT NULL,
  section_key text NOT NULL,
  is_enabled boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  UNIQUE (wedding_id, section_key)
);

CREATE TABLE IF NOT EXISTS wedding_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id uuid NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  event_name text NOT NULL,
  date_label text NOT NULL DEFAULT '',
  time_label text NOT NULL DEFAULT '',
  location_label text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'heart',
  category text NOT NULL DEFAULT 'programme',
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wedding_faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id uuid NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text NOT NULL,
  is_visible boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wedding_gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id uuid NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  title text NOT NULL DEFAULT '',
  is_visible boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wedding_entourage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id uuid NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text NOT NULL,
  group_name text NOT NULL DEFAULT 'general',
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wedding_rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id uuid NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  guest_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  attending boolean NOT NULL DEFAULT true,
  number_of_guests integer NOT NULL DEFAULT 1 CHECK (number_of_guests >= 1 AND number_of_guests <= 10),
  message text NOT NULL DEFAULT '',
  meal_preference text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE weddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_entourage ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_rsvps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read weddings" ON weddings;
CREATE POLICY "Public read weddings" ON weddings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Auth manage weddings" ON weddings;
CREATE POLICY "Auth manage weddings" ON weddings FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read wedding couples" ON wedding_couples;
CREATE POLICY "Public read wedding couples" ON wedding_couples FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Auth manage wedding couples" ON wedding_couples;
CREATE POLICY "Auth manage wedding couples" ON wedding_couples FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read wedding details" ON wedding_details;
CREATE POLICY "Public read wedding details" ON wedding_details FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Auth manage wedding details" ON wedding_details;
CREATE POLICY "Auth manage wedding details" ON wedding_details FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read wedding sections" ON wedding_sections;
CREATE POLICY "Public read wedding sections" ON wedding_sections FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Auth manage wedding sections" ON wedding_sections;
CREATE POLICY "Auth manage wedding sections" ON wedding_sections FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read wedding events" ON wedding_events;
CREATE POLICY "Public read wedding events" ON wedding_events FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Auth manage wedding events" ON wedding_events;
CREATE POLICY "Auth manage wedding events" ON wedding_events FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read wedding faqs" ON wedding_faqs;
CREATE POLICY "Public read wedding faqs" ON wedding_faqs FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Auth manage wedding faqs" ON wedding_faqs;
CREATE POLICY "Auth manage wedding faqs" ON wedding_faqs FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read wedding gallery" ON wedding_gallery;
CREATE POLICY "Public read wedding gallery" ON wedding_gallery FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Auth manage wedding gallery" ON wedding_gallery;
CREATE POLICY "Auth manage wedding gallery" ON wedding_gallery FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read wedding entourage" ON wedding_entourage;
CREATE POLICY "Public read wedding entourage" ON wedding_entourage FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Auth manage wedding entourage" ON wedding_entourage;
CREATE POLICY "Auth manage wedding entourage" ON wedding_entourage FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can submit wedding RSVP" ON wedding_rsvps;
CREATE POLICY "Anyone can submit wedding RSVP" ON wedding_rsvps FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Auth read wedding RSVP" ON wedding_rsvps;
CREATE POLICY "Auth read wedding RSVP" ON wedding_rsvps FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Auth manage wedding RSVP" ON wedding_rsvps;
CREATE POLICY "Auth manage wedding RSVP" ON wedding_rsvps FOR ALL TO authenticated USING (true) WITH CHECK (true);

WITH inserted AS (
  INSERT INTO weddings (slug, title)
  VALUES ('claire-james', 'Claire & James Wedding')
  ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title
  RETURNING id
)
INSERT INTO wedding_couples (wedding_id, bride_name, groom_name)
SELECT id, 'Claire', 'James' FROM inserted
ON CONFLICT (wedding_id) DO NOTHING;

WITH w AS (
  SELECT id FROM weddings WHERE slug = 'claire-james' LIMIT 1
)
INSERT INTO wedding_details (
  wedding_id,
  blessing_text,
  hero_subtitle,
  wedding_date_label,
  wedding_time_label,
  invitation_eyebrow,
  invitation_title,
  invitation_text,
  story_title,
  story_description,
  event_title,
  programme_title,
  venue_title,
  venue_description,
  venue_address_line1,
  venue_address_line2,
  map_link,
  hero_image_url,
  venue_image_url,
  rsvp_title,
  rsvp_deadline_label,
  footer_message,
  gift_registry_description,
  dress_code_description
)
SELECT
  id,
  'By the grace of God and with the blessings of our families',
  'cordially invited you to join us as we celebrate the sacrament of matrimony',
  'May 09, 2026',
  'Ceremony at 9:30 AM',
  'You are invited',
  'A Celebration of Love',
  'We joyfully invite you to share in the celebration of our wedding day, as we exchange vows and begin our journey together as husband and wife. Your presence will make this day truly unforgettable.',
  'Our Story',
  'From friendship to forever, our story is one of grace, growth, and love.',
  'Mark Your Calendar',
  'Wedding Programme',
  'The Potter''s House Christian Center Las Pinas Church',
  'God has placed everything necessary to accomplish His will in the setting of the local church.',
  '347 Diego Cera Avenue, Pulang Lupa',
  'Las Pinas City, Philippines',
  'https://www.google.com/maps/place/The+Potter''s+House+Christian+Center/',
  'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=900',
  'Kindly Reply',
  'May 03, 2026',
  'With love & gratitude for celebrating with us.',
  'Your presence is the best gift, but if you wish to bless us, a cash gift is appreciated.',
  'Please wear formal attire in earth tones.'
FROM w
ON CONFLICT (wedding_id) DO NOTHING;

WITH w AS (SELECT id FROM weddings WHERE slug = 'claire-james' LIMIT 1)
INSERT INTO wedding_sections (wedding_id, name, section_key, is_enabled, sort_order)
SELECT id, name, section_key, is_enabled, sort_order
FROM w
CROSS JOIN (
  VALUES
    ('Hero', 'hero', true, 5),
    ('Invitation', 'invitation', true, 10),
    ('Couple Info', 'couple_info', true, 15),
    ('Story', 'story', false, 18),
    ('Event Details', 'event_details', true, 20),
    ('Gallery', 'gallery', true, 30),
    ('Programme', 'programme', true, 40),
    ('Entourage', 'entourage', true, 50),
    ('Venue', 'venue', true, 60),
    ('FAQ', 'faq', false, 70),
    ('RSVP', 'rsvp', true, 80),
    ('Gift Registry', 'gift_registry', false, 90),
    ('Dress Code', 'dress_code', false, 95)
) AS sections(name, section_key, is_enabled, sort_order)
ON CONFLICT (wedding_id, section_key) DO NOTHING;

WITH w AS (SELECT id FROM weddings WHERE slug = 'claire-james' LIMIT 1)
INSERT INTO wedding_gallery (wedding_id, image_url, category, title, is_visible, sort_order)
SELECT id, image_url, 'main', title, true, sort_order
FROM w
CROSS JOIN (
  VALUES
    ('https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=800', 'Gallery 1', 10),
    ('https://images.pexels.com/photos/1128783/pexels-photo-1128783.jpeg?auto=compress&cs=tinysrgb&w=800', 'Gallery 2', 20),
    ('https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=800', 'Gallery 3', 30)
) AS g(image_url, title, sort_order)
ON CONFLICT DO NOTHING;
