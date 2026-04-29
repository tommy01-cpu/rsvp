/*
  # Add dress code image references
*/

ALTER TABLE wedding_details
ADD COLUMN IF NOT EXISTS dress_code_image_1 text NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS dress_code_image_2 text NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS dress_code_image_3 text NOT NULL DEFAULT '';
