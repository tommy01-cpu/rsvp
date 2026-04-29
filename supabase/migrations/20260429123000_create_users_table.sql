/*
  # Create users table for wedding-scoped editor access

  Fields requested:
  - id
  - wedding_id
  - username
  - password
  - created_at
  - updated_at
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id uuid NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  username text NOT NULL,
  password text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (username),
  UNIQUE (wedding_id, username)
);

CREATE INDEX IF NOT EXISTS users_wedding_id_idx ON users(wedding_id);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Auth manage users" ON users;
CREATE POLICY "Auth manage users"
  ON users
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
