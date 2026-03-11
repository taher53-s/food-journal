CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS restaurant_visits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  restaurant_name TEXT NOT NULL,
  location TEXT NOT NULL,
  cuisine TEXT NOT NULL,
  date_visited DATE NOT NULL,
  occasion TEXT NOT NULL CHECK (occasion IN ('date','friends','family','solo','business','celebration')),
  companions TEXT,
  price_range TEXT NOT NULL CHECK (price_range IN ('budget','moderate','expensive','luxury')),
  ambience_rating DECIMAL(3,1) NOT NULL CHECK (ambience_rating >= 0 AND ambience_rating <= 10),
  service_rating DECIMAL(3,1) NOT NULL CHECK (service_rating >= 0 AND service_rating <= 10),
  food_rating DECIMAL(3,1) NOT NULL CHECK (food_rating >= 0 AND food_rating <= 10),
  value_rating DECIMAL(3,1) NOT NULL CHECK (value_rating >= 0 AND value_rating <= 10),
  overall_rating DECIMAL(3,1) NOT NULL CHECK (overall_rating >= 0 AND overall_rating <= 10),
  experience_notes TEXT,
  would_return BOOLEAN DEFAULT true,
  recommendation_level TEXT NOT NULL CHECK (recommendation_level IN ('must_try','worth_it','decent','skip')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dishes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  visit_id UUID REFERENCES restaurant_visits(id) ON DELETE CASCADE,
  dish_name TEXT NOT NULL,
  price DECIMAL(10,2),
  rating DECIMAL(3,1) NOT NULL CHECK (rating >= 0 AND rating <= 10),
  notes TEXT,
  flavor_tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  visit_id UUID REFERENCES restaurant_visits(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('food','interior','menu','exterior')),
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE restaurant_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read visits" ON restaurant_visits FOR SELECT USING (true);
CREATE POLICY "Public can read dishes" ON dishes FOR SELECT USING (true);
CREATE POLICY "Public can read photos" ON photos FOR SELECT USING (true);

CREATE POLICY "Admin can insert visits" ON restaurant_visits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin can update visits" ON restaurant_visits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admin can delete visits" ON restaurant_visits FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admin can insert dishes" ON dishes FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM restaurant_visits WHERE id = visit_id AND user_id = auth.uid())
);
CREATE POLICY "Admin can update dishes" ON dishes FOR UPDATE USING (
  EXISTS (SELECT 1 FROM restaurant_visits WHERE id = visit_id AND user_id = auth.uid())
);
CREATE POLICY "Admin can delete dishes" ON dishes FOR DELETE USING (
  EXISTS (SELECT 1 FROM restaurant_visits WHERE id = visit_id AND user_id = auth.uid())
);

CREATE POLICY "Admin can insert photos" ON photos FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM restaurant_visits WHERE id = visit_id AND user_id = auth.uid())
);
CREATE POLICY "Admin can delete photos" ON photos FOR DELETE USING (
  EXISTS (SELECT 1 FROM restaurant_visits WHERE id = visit_id AND user_id = auth.uid())
);

INSERT INTO storage.buckets (id, name, public) VALUES ('food-photos','food-photos',true) ON CONFLICT DO NOTHING;
CREATE POLICY "Public can view photos" ON storage.objects FOR SELECT USING (bucket_id = 'food-photos');
CREATE POLICY "Authenticated can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'food-photos' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated can delete" ON storage.objects FOR DELETE USING (bucket_id = 'food-photos' AND auth.role() = 'authenticated');
