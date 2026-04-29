/*
  # Add Wedding Frontend Template Field

  Persists selected frontend design/template per wedding.
*/

ALTER TABLE weddings
ADD COLUMN IF NOT EXISTS theme_key text NOT NULL DEFAULT 'classic_grid';

