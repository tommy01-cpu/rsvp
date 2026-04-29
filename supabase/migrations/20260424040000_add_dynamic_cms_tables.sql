/*
  # Add Dynamic CMS Tables for Wedding Content

  ## New Tables
  - wedding_content (single-row JSON content)
  - section_configs (section visibility toggles)
  - faqs (dynamic FAQ entries)
  - gallery_images (gallery with visibility + ordering)

  ## Storage
  - Public bucket: wedding-assets
  - Authenticated upload/update/delete policies
*/

CREATE TABLE IF NOT EXISTS wedding_content (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS section_configs (
  key text PRIMARY KEY,
  label text NOT NULL,
  is_enabled boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  is_enabled boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  image_url text NOT NULL,
  is_enabled boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE wedding_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE section_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read wedding content" ON wedding_content;
DROP POLICY IF EXISTS "Authenticated can modify wedding content" ON wedding_content;
CREATE POLICY "Public can read wedding content"
  ON wedding_content
  FOR SELECT
  TO anon, authenticated
  USING (true);
CREATE POLICY "Authenticated can modify wedding content"
  ON wedding_content
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read section configs" ON section_configs;
DROP POLICY IF EXISTS "Authenticated can modify section configs" ON section_configs;
CREATE POLICY "Public can read section configs"
  ON section_configs
  FOR SELECT
  TO anon, authenticated
  USING (true);
CREATE POLICY "Authenticated can modify section configs"
  ON section_configs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read faqs" ON faqs;
DROP POLICY IF EXISTS "Authenticated can modify faqs" ON faqs;
CREATE POLICY "Public can read faqs"
  ON faqs
  FOR SELECT
  TO anon, authenticated
  USING (true);
CREATE POLICY "Authenticated can modify faqs"
  ON faqs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read gallery" ON gallery_images;
DROP POLICY IF EXISTS "Authenticated can modify gallery" ON gallery_images;
CREATE POLICY "Public can read gallery"
  ON gallery_images
  FOR SELECT
  TO anon, authenticated
  USING (true);
CREATE POLICY "Authenticated can modify gallery"
  ON gallery_images
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

INSERT INTO wedding_content (id, content)
VALUES (1, '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO section_configs (key, label, is_enabled, sort_order) VALUES
  ('invitation', 'Invitation', true, 10),
  ('event_details', 'Event Details', true, 20),
  ('gallery', 'Gallery', true, 30),
  ('programme', 'Programme', true, 40),
  ('entourage', 'Entourage', true, 50),
  ('venue', 'Venue', true, 60),
  ('faq', 'FAQ', false, 70),
  ('rsvp', 'RSVP Form', true, 80)
ON CONFLICT (key) DO UPDATE
SET label = EXCLUDED.label,
    sort_order = EXCLUDED.sort_order;

INSERT INTO storage.buckets (id, name, public)
VALUES ('wedding-assets', 'wedding-assets', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read wedding-assets" ON storage.objects;
DROP POLICY IF EXISTS "Auth insert wedding-assets" ON storage.objects;
DROP POLICY IF EXISTS "Auth update wedding-assets" ON storage.objects;
DROP POLICY IF EXISTS "Auth delete wedding-assets" ON storage.objects;

CREATE POLICY "Public read wedding-assets"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'wedding-assets');

CREATE POLICY "Auth insert wedding-assets"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'wedding-assets');

CREATE POLICY "Auth update wedding-assets"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'wedding-assets')
  WITH CHECK (bucket_id = 'wedding-assets');

CREATE POLICY "Auth delete wedding-assets"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'wedding-assets');

