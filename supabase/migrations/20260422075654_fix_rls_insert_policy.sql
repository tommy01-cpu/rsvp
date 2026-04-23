/*
  # Fix RLS Policy to Allow All Users to Submit RSVPs

  ## Summary
  Updates the INSERT policy to allow both anon and authenticated users to submit RSVPs.
  This fixes the "new row violates row-level security policy" error.

  ## Changes
  - Drops existing INSERT policy
  - Creates new policy that allows both anon and authenticated roles
  - Maintains data validation for required fields
*/

DROP POLICY IF EXISTS "Public can submit valid RSVP" ON reservations;

CREATE POLICY "Users can submit valid RSVPs"
  ON reservations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    full_name IS NOT NULL 
    AND full_name <> ''
    AND email IS NOT NULL 
    AND email <> ''
    AND attending IS NOT NULL
    AND guest_count >= 1 
    AND guest_count <= 10
  );
