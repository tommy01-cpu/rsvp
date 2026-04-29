/*
  # Add invitation link field for admin-managed sharing URL
*/

ALTER TABLE wedding_details
ADD COLUMN IF NOT EXISTS invitation_link text NOT NULL DEFAULT '';
