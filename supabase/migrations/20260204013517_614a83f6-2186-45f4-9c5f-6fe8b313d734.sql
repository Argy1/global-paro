-- Create enums for the various select fields

-- Profession enum
CREATE TYPE public.profession_type AS ENUM ('Nurse', 'Midwife', 'Other');

-- Education level enum
CREATE TYPE public.education_level_type AS ENUM ('Diploma', 'Bachelor', 'Master', 'Other');

-- Specialty enum
CREATE TYPE public.specialty_type AS ENUM ('ICU', 'ER', 'Med-Surg', 'OR', 'Pediatrics', 'Geriatric', 'Mental Health', 'Community Health', 'Other');

-- License status enum
CREATE TYPE public.license_status_type AS ENUM ('STR/SIP Active', 'In Process', 'Not Available');

-- English level enum
CREATE TYPE public.english_level_type AS ENUM ('IELTS', 'OET', 'Basic', 'Intermediate', 'Advanced', 'Not Yet');

-- Availability enum
CREATE TYPE public.availability_type AS ENUM ('0-3 months', '3-6 months', '6-12 months');

-- Pipeline status enum
CREATE TYPE public.pipeline_status_type AS ENUM ('new', 'contacted', 'screened', 'qualified', 'in_process', 'placed', 'closed');

-- Content category enum
CREATE TYPE public.content_category_type AS ENUM ('Career Abroad', 'Licensing', 'English', 'Interview', 'Mental Health', 'Professional Growth');

-- =====================================================
-- 1. CANDIDATES TABLE
-- =====================================================
CREATE TABLE public.candidates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  email TEXT,
  city_country TEXT NOT NULL,
  profession public.profession_type NOT NULL,
  education_level public.education_level_type NOT NULL,
  graduation_year INTEGER,
  experience_years INTEGER NOT NULL,
  specialty public.specialty_type NOT NULL,
  license_status public.license_status_type NOT NULL,
  english_level public.english_level_type NOT NULL,
  target_countries TEXT[] NOT NULL DEFAULT '{}',
  availability public.availability_type NOT NULL,
  cv_link TEXT,
  consent_contact BOOLEAN NOT NULL DEFAULT false,
  consent_privacy BOOLEAN NOT NULL DEFAULT false,
  pipeline_status public.pipeline_status_type NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on candidates
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (public form submission)
CREATE POLICY "Anyone can submit application"
  ON public.candidates
  FOR INSERT
  WITH CHECK (true);

-- Policy: Only authenticated users (admins) can view candidates
-- For now, we allow authenticated users to view all candidates
CREATE POLICY "Authenticated users can view candidates"
  ON public.candidates
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Only authenticated users can update candidates
CREATE POLICY "Authenticated users can update candidates"
  ON public.candidates
  FOR UPDATE
  TO authenticated
  USING (true);

-- =====================================================
-- 2. PATHWAYS TABLE
-- =====================================================
CREATE TABLE public.pathways (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  country TEXT NOT NULL,
  short_summary TEXT NOT NULL,
  requirements JSONB NOT NULL DEFAULT '[]',
  timeline_steps JSONB NOT NULL DEFAULT '[]',
  documents_checklist JSONB NOT NULL DEFAULT '[]',
  faq JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on pathways
ALTER TABLE public.pathways ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active pathways
CREATE POLICY "Anyone can view active pathways"
  ON public.pathways
  FOR SELECT
  USING (is_active = true);

-- Policy: Authenticated users can manage pathways
CREATE POLICY "Authenticated users can manage pathways"
  ON public.pathways
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- 3. CONTENT TABLE
-- =====================================================
CREATE TABLE public.content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category public.content_category_type NOT NULL,
  excerpt TEXT NOT NULL,
  body TEXT NOT NULL,
  read_time_minutes INTEGER NOT NULL DEFAULT 5,
  publish_date DATE NOT NULL DEFAULT CURRENT_DATE,
  hero_image TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on content
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view published content
CREATE POLICY "Anyone can view published content"
  ON public.content
  FOR SELECT
  USING (is_published = true);

-- Policy: Authenticated users can manage content
CREATE POLICY "Authenticated users can manage content"
  ON public.content
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- 4. WHATSAPP GROUPS TABLE
-- =====================================================
CREATE TABLE public.whatsapp_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  segment_name TEXT NOT NULL,
  description TEXT NOT NULL,
  join_link TEXT NOT NULL DEFAULT 'UPDATE_ME',
  is_active BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on whatsapp_groups
ALTER TABLE public.whatsapp_groups ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active groups
CREATE POLICY "Anyone can view active whatsapp groups"
  ON public.whatsapp_groups
  FOR SELECT
  USING (is_active = true);

-- Policy: Authenticated users can manage groups
CREATE POLICY "Authenticated users can manage whatsapp groups"
  ON public.whatsapp_groups
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- 5. SOCIAL LINKS TABLE (single record)
-- =====================================================
CREATE TABLE public.social_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  instagram_url TEXT NOT NULL DEFAULT 'UPDATE_ME',
  tiktok_url TEXT NOT NULL DEFAULT 'UPDATE_ME',
  linkedin_url TEXT NOT NULL DEFAULT 'UPDATE_ME',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on social_links
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view social links
CREATE POLICY "Anyone can view social links"
  ON public.social_links
  FOR SELECT
  USING (true);

-- Policy: Authenticated users can manage social links
CREATE POLICY "Authenticated users can manage social links"
  ON public.social_links
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- TRIGGER FOR UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers
CREATE TRIGGER update_pathways_updated_at
  BEFORE UPDATE ON public.pathways
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_content_updated_at
  BEFORE UPDATE ON public.content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_whatsapp_groups_updated_at
  BEFORE UPDATE ON public.whatsapp_groups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_social_links_updated_at
  BEFORE UPDATE ON public.social_links
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();