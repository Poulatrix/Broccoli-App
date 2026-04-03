/*
  # Create Recipe Management Schema

  1. New Tables
    - `recipes`
      - `id` (uuid, primary key)
      - `name` (text) - Recipe name
      - `image` (text) - Image URL
      - `category` (text) - Category: Viande, Poisson, or Végétarien
      - `servings` (integer) - Number of servings
      - `prep_time` (integer) - Preparation time in minutes
      - `cook_time` (integer) - Cooking time in minutes
      - `ingredients` (jsonb) - Array of ingredients
      - `steps` (jsonb) - Array of cooking steps
      - `tags` (jsonb) - Array of tags
      - `created_at` (timestamptz) - Creation timestamp
      
    - `calendar_events`
      - `id` (uuid, primary key)
      - `date` (text) - Date in ISO format
      - `recipe_id` (uuid) - Foreign key to recipes
      - `servings` (integer) - Number of servings for this event
      - `created_at` (timestamptz) - Creation timestamp
      
    - `shopping_list`
      - `id` (uuid, primary key)
      - `name` (text) - Ingredient name
      - `quantity` (numeric) - Quantity
      - `unit` (text) - Unit of measurement
      - `checked` (boolean) - Checked status
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (no auth required for this app)
*/

-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image text NOT NULL,
  category text NOT NULL,
  servings integer NOT NULL DEFAULT 4,
  prep_time integer NOT NULL DEFAULT 0,
  cook_time integer NOT NULL DEFAULT 0,
  ingredients jsonb NOT NULL DEFAULT '[]'::jsonb,
  steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  tags jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create calendar_events table
CREATE TABLE IF NOT EXISTS calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date text NOT NULL,
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  servings integer NOT NULL DEFAULT 4,
  created_at timestamptz DEFAULT now()
);

-- Create shopping_list table
CREATE TABLE IF NOT EXISTS shopping_list (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  quantity numeric NOT NULL DEFAULT 0,
  unit text NOT NULL,
  checked boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_list ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no authentication required)
CREATE POLICY "Allow public read access to recipes"
  ON recipes FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access to recipes"
  ON recipes FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update access to recipes"
  ON recipes FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to recipes"
  ON recipes FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Allow public read access to calendar_events"
  ON calendar_events FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access to calendar_events"
  ON calendar_events FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update access to calendar_events"
  ON calendar_events FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to calendar_events"
  ON calendar_events FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Allow public read access to shopping_list"
  ON shopping_list FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access to shopping_list"
  ON shopping_list FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update access to shopping_list"
  ON shopping_list FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to shopping_list"
  ON shopping_list FOR DELETE
  TO anon
  USING (true);