/*
  # Add Entourage Verse Field

  Adds a DB-backed field for the closing verse/quote shown at the end of
  the entourage section on the frontend.
*/

ALTER TABLE wedding_details
ADD COLUMN IF NOT EXISTS entourage_verse text NOT NULL DEFAULT '';

