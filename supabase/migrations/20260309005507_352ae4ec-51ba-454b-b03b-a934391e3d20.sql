
-- Add slug + speaker fields to webinars
ALTER TABLE public.webinars
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS speaker_name TEXT,
  ADD COLUMN IF NOT EXISTS speaker_bio TEXT,
  ADD COLUMN IF NOT EXISTS speaker_photo_url TEXT;

-- Make slug unique where not null
CREATE UNIQUE INDEX IF NOT EXISTS webinars_slug_unique ON public.webinars (slug) WHERE slug IS NOT NULL;

-- Backfill slug for existing row (title -> slug)
UPDATE public.webinars
SET slug = lower(regexp_replace(trim(title), '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL;

-- Create webinar_registrations table
CREATE TABLE public.webinar_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  webinar_id UUID NOT NULL REFERENCES public.webinars(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  registered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT
);

-- Enable RLS
ALTER TABLE public.webinar_registrations ENABLE ROW LEVEL SECURITY;

-- Anyone can register (public INSERT)
CREATE POLICY "Anyone can register for a webinar"
  ON public.webinar_registrations FOR INSERT
  WITH CHECK (true);

-- Admins can read all registrations
CREATE POLICY "Admins can read registrations"
  ON public.webinar_registrations FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete registrations
CREATE POLICY "Admins can delete registrations"
  ON public.webinar_registrations FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Index for fast lookups by webinar
CREATE INDEX IF NOT EXISTS idx_webinar_registrations_webinar_id ON public.webinar_registrations(webinar_id);
