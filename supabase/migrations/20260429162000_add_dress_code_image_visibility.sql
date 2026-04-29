/*
  # Add visibility flags for dress code images
*/

ALTER TABLE wedding_details
ADD COLUMN IF NOT EXISTS dress_code_image_1_visible boolean NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS dress_code_image_2_visible boolean NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS dress_code_image_3_visible boolean NOT NULL DEFAULT true;
