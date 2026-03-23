
-- ============================================
-- 1. APP ROLE ENUM & USER ROLES TABLE
-- ============================================
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles without recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- 2. PROFILES TABLE
-- ============================================
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by owner"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 3. EMPLOYER INQUIRIES TABLE
-- ============================================
CREATE TABLE public.employer_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text,
  country text NOT NULL,
  nurses_needed integer,
  specialties_needed text[],
  message text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.employer_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit employer inquiry"
  ON public.employer_inquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view employer inquiries"
  ON public.employer_inquiries FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update employer inquiries"
  ON public.employer_inquiries FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_employer_inquiries_updated_at
  BEFORE UPDATE ON public.employer_inquiries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 4. CHAT MESSAGES TABLE (Simple form + escalation)
-- ============================================
CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_name text NOT NULL,
  visitor_email text,
  visitor_phone text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  admin_notes text,
  resolved_at timestamptz,
  resolved_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit chat message"
  ON public.chat_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view chat messages"
  ON public.chat_messages FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update chat messages"
  ON public.chat_messages FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_chat_messages_updated_at
  BEFORE UPDATE ON public.chat_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 5. SUCCESS STORIES TABLE
-- ============================================
CREATE TABLE public.success_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  nurse_name text NOT NULL,
  origin_country text NOT NULL,
  destination_country text NOT NULL,
  specialty text,
  excerpt text NOT NULL,
  body text NOT NULL,
  hero_image text,
  is_published boolean NOT NULL DEFAULT true,
  publish_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published stories"
  ON public.success_stories FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage stories"
  ON public.success_stories FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_success_stories_updated_at
  BEFORE UPDATE ON public.success_stories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 6. QUICKSTART CHAPTERS TABLE
-- ============================================
CREATE TABLE public.quickstart_chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  summary text NOT NULL,
  body text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.quickstart_chapters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published chapters"
  ON public.quickstart_chapters FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage chapters"
  ON public.quickstart_chapters FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_quickstart_chapters_updated_at
  BEFORE UPDATE ON public.quickstart_chapters
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 7. SITE SETTINGS TABLE (key-value store for admin)
-- ============================================
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value text NOT NULL DEFAULT 'UPDATE_ME',
  description text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read settings"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.site_settings (key, value, description) VALUES
  ('whatsapp_link', 'UPDATE_ME', 'Main WhatsApp support link'),
  ('help_mobile', 'UPDATE_ME', 'Help center mobile number'),
  ('help_email', 'globalparo@gmail.com', 'Help center email'),
  ('booking_link', 'UPDATE_ME', 'Employer booking link (Calendly etc)'),
  ('instagram_url', 'UPDATE_ME', 'Instagram profile URL'),
  ('tiktok_url', 'UPDATE_ME', 'TikTok profile URL'),
  ('linkedin_url', 'UPDATE_ME', 'LinkedIn profile URL');

-- ============================================
-- 8. UPDATE CONTENT CATEGORY ENUM (add News, Stories)
-- ============================================
ALTER TYPE public.content_category_type ADD VALUE IF NOT EXISTS 'News';
ALTER TYPE public.content_category_type ADD VALUE IF NOT EXISTS 'Success Story';
