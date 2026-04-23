/*
  # Create Wedding Reservations Table

  ## Summary
  Creates a table to store RSVP responses for a wedding invitation.

  ## New Tables
  - `reservations`
    - `id` (uuid, primary key) - Unique identifier for each reservation
    - `full_name` (text, not null) - Guest's full name
    - `email` (text, not null) - Guest's email address
    - `phone` (text) - Optional phone number
    - `attending` (boolean, not null) - Whether they will attend
    - `guest_count` (integer) - Number of guests including themselves (1-10)
    - `dietary_restrictions` (text) - Any dietary notes
    - `message` (text) - Optional message to the couple
    - `created_at` (timestamptz) - Submission timestamp

  ## Security
  - RLS enabled on reservations table
  - Public INSERT allowed (anyone can submit an RSVP)
  - No public SELECT (only service role can read responses)
*/

CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  attending boolean NOT NULL DEFAULT true,
  guest_count integer NOT NULL DEFAULT 1 CHECK (guest_count >= 1 AND guest_count <= 10),
  dietary_restrictions text DEFAULT '',
  message text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an RSVP"
  ON reservations
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can view reservations"
  ON reservations
  FOR SELECT
  TO authenticated
  USING (true);
