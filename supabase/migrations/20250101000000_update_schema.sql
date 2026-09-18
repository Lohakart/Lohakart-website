-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Policies for categories
CREATE POLICY "Anyone can view categories"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert categories"
  ON public.categories FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update categories"
  ON public.categories FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete categories"
  ON public.categories FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Update products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS min_order INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS stock_qty INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS metal_type TEXT,
ADD COLUMN IF NOT EXISTS grade TEXT,
ADD COLUMN IF NOT EXISTS supplier_id TEXT,
ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS sku TEXT,
ADD COLUMN IF NOT EXISTS images TEXT[];

-- Make slug unique contentiously
-- First ensure unique slugs if any exist (this is best effort, might fail if duplicates exist)
-- For a new setup or empty table this is fine.
ALTER TABLE public.products ADD CONSTRAINT products_slug_key UNIQUE (slug);
ALTER TABLE public.products ADD CONSTRAINT products_sku_key UNIQUE (sku);

-- Migrate existing data if needed (e.g. migrate image_url to images array)
UPDATE public.products 
SET images = ARRAY[image_url] 
WHERE image_url IS NOT NULL AND images IS NULL;

-- Seed Categories
INSERT INTO public.categories (name, slug, description) VALUES
('TMT Bars', 'tmt-bars', 'High strength TMT bars suitable for construction'),
('Pipes', 'pipes', 'Industrial and construction grade pipes'),
('Sheets', 'sheets', 'various steel sheets'),
('Rods', 'rods', 'Steel rods for various applications'),
('Angles', 'angles', 'Structural angles'),
('Channels', 'channels', 'Structural channels'),
('Beams', 'beams', 'Structural beams')
ON CONFLICT (name) DO NOTHING;

-- Update existing products to link to categories by name (best effort)
UPDATE public.products p
SET category_id = c.id
FROM public.categories c
WHERE lower(p.category) = lower(c.name)
AND p.category_id IS NULL;

-- Trigger for updated_at on categories
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
