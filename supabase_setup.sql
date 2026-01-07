-- Tours table
CREATE TABLE tours (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  departure_city TEXT DEFAULT '桃園',
  departure_date TEXT,
  description TEXT,
  image TEXT,
  itinerary_link TEXT,
  status TEXT DEFAULT 'upcoming',
  is_full BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE blog_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT '行李攻略',
  image TEXT,
  publish_date TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testimonials table
CREATE TABLE testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tour_name TEXT,
  quote TEXT NOT NULL,
  image TEXT,
  rating INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Why choose us table
CREATE TABLE why_choose_us (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT DEFAULT 'leader',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) but allow public read/write for now
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE why_choose_us ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public read" ON tours FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON tours FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON tours FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON tours FOR DELETE USING (true);

CREATE POLICY "Allow public read" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON blog_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON blog_posts FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON blog_posts FOR DELETE USING (true);

CREATE POLICY "Allow public read" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON testimonials FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON testimonials FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON testimonials FOR DELETE USING (true);

CREATE POLICY "Allow public read" ON why_choose_us FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON why_choose_us FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON why_choose_us FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON why_choose_us FOR DELETE USING (true);
