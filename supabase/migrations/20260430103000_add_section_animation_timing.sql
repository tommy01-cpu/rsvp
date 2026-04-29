/*
  # Add per-section animation timing controls
*/

ALTER TABLE wedding_sections
ADD COLUMN IF NOT EXISTS animation_duration_ms integer NOT NULL DEFAULT 850,
ADD COLUMN IF NOT EXISTS animation_delay_ms integer NOT NULL DEFAULT 0;
