CREATE TABLE public.webinars (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  topic TEXT,
  cost TEXT NOT NULL DEFAULT 'FREE',
  schedule TEXT,
  contact_email TEXT DEFAULT 'hello@globalparo.com',
  register_link TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  learn_items TEXT[] NOT NULL DEFAULT '{}',
  cover_image_url TEXT,
  event_date DATE,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.webinars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published webinars are publicly readable"
  ON public.webinars FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can select all webinars"
  ON public.webinars FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert webinars"
  ON public.webinars FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update webinars"
  ON public.webinars FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete webinars"
  ON public.webinars FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_webinars_updated_at
  BEFORE UPDATE ON public.webinars
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.webinars (
  title, subtitle, description, topic, cost, schedule, contact_email,
  learn_items, is_published, is_featured, order_index
) VALUES (
  'GLOBAL CAREER',
  'opportunity in Singapore',
  'Learn everything about working as a nurse in Singapore — live from our experts.',
  'Working as a Nurse in Singapore — Requirements, Process & Life',
  'FREE',
  'Contact us for schedule details',
  'hello@globalparo.com',
  ARRAY[
    'Overview of the Singapore healthcare system',
    'Eligibility requirements for Indonesian nurses',
    'Licensing & credential recognition process',
    'Day-to-day life as a nurse in Singapore',
    'Salary, benefits & accommodation',
    'How Global Paro supports your application'
  ],
  true,
  true,
  0
);