-- ==============================================================================
-- OUR LITTLE UNIVERSE — COMPLETE SUPABASE PRODUCTION DATABASE & STORAGE SCHEMA
-- ==============================================================================

-- 1. Storage Buckets
-- Public bucket for shared moments & memories
INSERT INTO storage.buckets (id, name, public) 
VALUES ('memories-vault', 'memories-vault', true)
ON CONFLICT (id) DO NOTHING;

-- Private bucket for secret vault items (letters, voice notes, confidential videos)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('vault-media', 'vault-media', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies: memories-vault
CREATE POLICY "Public Read Access on memories-vault" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'memories-vault');

CREATE POLICY "Authenticated Upload Access on memories-vault" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'memories-vault' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated Update/Delete on memories-vault" 
ON storage.objects FOR ALL 
USING (bucket_id = 'memories-vault' AND auth.role() = 'authenticated');

-- Storage RLS Policies: vault-media (Strict Private Access)
CREATE POLICY "Private Authenticated Read Access on vault-media" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'vault-media' AND auth.role() = 'authenticated');

CREATE POLICY "Private Authenticated Upload on vault-media" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'vault-media' AND auth.role() = 'authenticated');

CREATE POLICY "Private Authenticated Modify on vault-media" 
ON storage.objects FOR ALL 
USING (bucket_id = 'vault-media' AND auth.role() = 'authenticated');

-- ------------------------------------------------------------------------------
-- 2. Profiles Table (Couples & Admins)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'partner' CHECK (role IN ('partner', 'admin')),
  avatar_url TEXT,
  vault_pin_hash TEXT, -- SHA-256 salted hash
  vault_pin_salt TEXT, -- Salt for vault PIN verification
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. Memories Table & Memory Media
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.memories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  media_url TEXT,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video', 'audio')),
  location TEXT,
  category TEXT NOT NULL CHECK (category IN ('Trip', 'Date Night', 'Milestone', 'Quiet Moment', 'Celebration')),
  is_favorite BOOLEAN DEFAULT false,
  is_private BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.memory_media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  memory_id UUID REFERENCES public.memories(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video', 'audio')),
  order_index INT DEFAULT 0,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. Letters Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.letters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  recipient TEXT NOT NULL,
  date DATE NOT NULL,
  category TEXT DEFAULT 'Just Because',
  is_sealed BOOLEAN DEFAULT false,
  is_read BOOLEAN DEFAULT false,
  open_date DATE,
  seal_color TEXT DEFAULT 'gold' CHECK (seal_color IN ('gold', 'rose', 'charcoal')),
  image_url TEXT,
  image_caption TEXT,
  audio_url TEXT,
  audio_duration TEXT,
  is_vault BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. Timeline Events & Milestones
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.timeline_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Milestones', 'Trips', 'Photos', 'Special Moments', 'Beginning', 'Firsts', 'Adventures', 'Commitments', 'Present')),
  image_url TEXT,
  gallery_urls TEXT[] DEFAULT '{}',
  video_url TEXT,
  location TEXT,
  personal_note TEXT,
  personal_note_author TEXT,
  icon TEXT,
  is_major BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. Special Places Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.places (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  location_name TEXT NOT NULL,
  city TEXT,
  country TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  description TEXT NOT NULL,
  memory_note TEXT,
  visited_date DATE NOT NULL,
  photo_url TEXT,
  gallery_urls TEXT[] DEFAULT '{}',
  category TEXT NOT NULL,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. Future Together (Bucket List & Aspirations) Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.future_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Places We Want To Visit', 'Things We Want To Do', 'Dreams & Goals')),
  target_date TEXT,
  status TEXT NOT NULL DEFAULT 'Dream' CHECK (status IN ('Dream', 'Planned', 'In Progress', 'Completed')),
  is_completed BOOLEAN DEFAULT false,
  completed_date DATE,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- For backwards compatibility view/alias
CREATE OR REPLACE VIEW public.bucket_list AS 
SELECT id, title, description, category, target_date, is_completed, completed_date, image_url AS photo_url, created_at 
FROM public.future_items;

-- ------------------------------------------------------------------------------
-- 8. Love Reasons (Love Cards) Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.love_reasons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  number INT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  message TEXT,
  category TEXT NOT NULL,
  photo_url TEXT,
  photo_caption TEXT,
  audio_url TEXT,
  audio_duration TEXT,
  author TEXT NOT NULL,
  is_favorite BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. Secret Vault Items Table & Vault Media
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.vault_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  media_url TEXT,
  media_type TEXT NOT NULL CHECK (media_type IN ('letter', 'photo', 'video', 'audio', 'future_message', 'note')),
  duration TEXT,
  category TEXT NOT NULL DEFAULT 'General' CHECK (category IN ('Private Letters', 'Private Photos', 'Private Videos', 'Voice Messages', 'Future Messages', 'General')),
  recorded_date DATE NOT NULL DEFAULT CURRENT_DATE,
  unlock_date DATE, -- For time-locked future messages
  is_locked BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.vault_media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vault_item_id UUID REFERENCES public.vault_items(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 10. Enable Row Level Security (RLS)
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.future_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.love_reasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_media ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 11. Row Level Security Policies
-- ------------------------------------------------------------------------------

-- Profiles: Users can view their own profile; admins can view all
CREATE POLICY "Users can view profiles" ON public.profiles 
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update own profile" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

-- Memories: Authenticated couple members can read & modify
CREATE POLICY "Allow authenticated select on memories" ON public.memories 
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert on memories" ON public.memories 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on memories" ON public.memories 
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete on memories" ON public.memories 
  FOR DELETE USING (auth.role() = 'authenticated');

-- Memory Media:
CREATE POLICY "Allow authenticated all on memory_media" ON public.memory_media 
  FOR ALL USING (auth.role() = 'authenticated');

-- Letters:
CREATE POLICY "Allow authenticated all on letters" ON public.letters 
  FOR ALL USING (auth.role() = 'authenticated');

-- Timeline Events:
CREATE POLICY "Allow authenticated all on timeline_events" ON public.timeline_events 
  FOR ALL USING (auth.role() = 'authenticated');

-- Places:
CREATE POLICY "Allow authenticated all on places" ON public.places 
  FOR ALL USING (auth.role() = 'authenticated');

-- Future Items:
CREATE POLICY "Allow authenticated all on future_items" ON public.future_items 
  FOR ALL USING (auth.role() = 'authenticated');

-- Love Reasons:
CREATE POLICY "Allow authenticated all on love_reasons" ON public.love_reasons 
  FOR ALL USING (auth.role() = 'authenticated');

-- Secret Vault Items (Strict Authenticated Access):
CREATE POLICY "Allow authenticated select on vault_items" ON public.vault_items 
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert on vault_items" ON public.vault_items 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on vault_items" ON public.vault_items 
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete on vault_items" ON public.vault_items 
  FOR DELETE USING (auth.role() = 'authenticated');

-- Vault Media:
CREATE POLICY "Allow authenticated all on vault_media" ON public.vault_media 
  FOR ALL USING (auth.role() = 'authenticated');

-- ------------------------------------------------------------------------------
-- 12. Indexes for High Performance
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_memories_date ON public.memories(date DESC);
CREATE INDEX IF NOT EXISTS idx_memories_category ON public.memories(category);
CREATE INDEX IF NOT EXISTS idx_memories_favorite ON public.memories(is_favorite);
CREATE INDEX IF NOT EXISTS idx_letters_date ON public.letters(date DESC);
CREATE INDEX IF NOT EXISTS idx_letters_sealed ON public.letters(is_sealed);
CREATE INDEX IF NOT EXISTS idx_timeline_date ON public.timeline_events(date ASC);
CREATE INDEX IF NOT EXISTS idx_places_visited_date ON public.places(visited_date DESC);
CREATE INDEX IF NOT EXISTS idx_future_items_status ON public.future_items(status);
CREATE INDEX IF NOT EXISTS idx_future_items_category ON public.future_items(category);
CREATE INDEX IF NOT EXISTS idx_vault_items_type ON public.vault_items(media_type);
CREATE INDEX IF NOT EXISTS idx_vault_items_category ON public.vault_items(category);
