/*
  # Add Shopping List Sharing

  1. New Tables
    - `shopping_lists`
      - `id` (uuid, primary key)
      - `user_id` (text) - Owner identifier
      - `name` (text) - Name of the shopping list
      - `share_token` (text, unique) - Token for sharing
      - `is_public` (boolean) - Whether the list is publicly shared
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `shopping_list_items`
      - `id` (uuid, primary key)
      - `shopping_list_id` (uuid) - Foreign key to shopping_lists
      - `name` (text) - Item name
      - `quantity` (numeric) - Quantity
      - `unit` (text) - Unit of measurement
      - `checked` (boolean) - Whether item is checked
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public can view shared lists via share_token
    - Anyone can manage items in public lists
*/

CREATE TABLE IF NOT EXISTS shopping_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text,
  name text NOT NULL,
  share_token text UNIQUE,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS shopping_list_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shopping_list_id uuid NOT NULL REFERENCES shopping_lists(id) ON DELETE CASCADE,
  name text NOT NULL,
  quantity numeric NOT NULL DEFAULT 0,
  unit text NOT NULL,
  checked boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_list_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read public lists"
  ON shopping_lists FOR SELECT
  TO anon
  USING (is_public = true);

CREATE POLICY "Anyone can create lists"
  ON shopping_lists FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can update public lists"
  ON shopping_lists FOR UPDATE
  TO anon
  USING (is_public = true)
  WITH CHECK (is_public = true);

CREATE POLICY "Anyone can delete public lists"
  ON shopping_lists FOR DELETE
  TO anon
  USING (is_public = true);

CREATE POLICY "Read items from shared lists"
  ON shopping_list_items FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM shopping_lists
      WHERE shopping_lists.id = shopping_list_items.shopping_list_id
      AND shopping_lists.is_public = true
    )
  );

CREATE POLICY "Insert items into shared lists"
  ON shopping_list_items FOR INSERT
  TO anon
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM shopping_lists
      WHERE shopping_lists.id = shopping_list_items.shopping_list_id
      AND shopping_lists.is_public = true
    )
  );

CREATE POLICY "Update items in shared lists"
  ON shopping_list_items FOR UPDATE
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM shopping_lists
      WHERE shopping_lists.id = shopping_list_items.shopping_list_id
      AND shopping_lists.is_public = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM shopping_lists
      WHERE shopping_lists.id = shopping_list_items.shopping_list_id
      AND shopping_lists.is_public = true
    )
  );

CREATE POLICY "Delete items from shared lists"
  ON shopping_list_items FOR DELETE
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM shopping_lists
      WHERE shopping_lists.id = shopping_list_items.shopping_list_id
      AND shopping_lists.is_public = true
    )
  );
