/*
  # Add Section Content + Animation Controls

  Adds editable text content and animation per section so admins can control
  what appears in each enabled section.
*/

ALTER TABLE wedding_sections
ADD COLUMN IF NOT EXISTS content_text text NOT NULL DEFAULT '';

ALTER TABLE wedding_sections
ADD COLUMN IF NOT EXISTS animation text NOT NULL DEFAULT 'reveal-fade';

