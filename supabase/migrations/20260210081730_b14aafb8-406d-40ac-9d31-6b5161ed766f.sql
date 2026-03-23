
-- =============================================
-- A) SETTINGS: Rename existing keys + add new ones
-- =============================================
UPDATE public.site_settings SET key = 'support_email', description = 'Support email address' WHERE key = 'help_email';
UPDATE public.site_settings SET key = 'whatsapp_direct_chat_link', description = 'WhatsApp direct chat link' WHERE key = 'whatsapp_link';
UPDATE public.site_settings SET key = 'booking_20min_link', description = 'Employer booking link (20 min call)' WHERE key = 'booking_link';

INSERT INTO public.site_settings (key, value, description) VALUES
  ('brand_name', 'Global Paro', 'Brand name'),
  ('mission', 'Accelerating nurses to reach global opportunities', 'Mission statement'),
  ('whatsapp_auto_reply_text', 'Thank you for contacting Global Paro. Please share your name and goal (Singapore/Canada/USA), we will respond soon.', 'WhatsApp auto-reply text'),
  ('facebook_url', 'UPDATE_ME', 'Facebook page URL'),
  ('ai_intro_video_url', 'UPDATE_ME', 'Hero AI journey video URL'),
  ('site_tutorial_video_url', 'UPDATE_ME', 'Site tutorial video URL (45-60s)'),
  ('enable_tutorial_modal', 'true', 'Show tutorial modal on first visit'),
  ('enable_chat_widget', 'true', 'Enable chat widget')
ON CONFLICT (key) DO NOTHING;

-- =============================================
-- B) CANDIDATES: New enums and columns
-- =============================================
CREATE TYPE public.english_capability_type AS ENUM ('Basic', 'Intermediate', 'Fluent');
CREATE TYPE public.journey_stage_type AS ENUM ('New', 'Contacted', 'Screening', 'Preparing', 'Ready', 'Placed', 'Closed');

ALTER TABLE public.candidates
  ADD COLUMN IF NOT EXISTS date_of_birth date,
  ADD COLUMN IF NOT EXISTS university text,
  ADD COLUMN IF NOT EXISTS str_active_number text,
  ADD COLUMN IF NOT EXISTS english_capability public.english_capability_type,
  ADD COLUMN IF NOT EXISTS email_verified boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS whatsapp_verified boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS motivations text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS motivation_story text,
  ADD COLUMN IF NOT EXISTS challenges text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS challenge_story text,
  ADD COLUMN IF NOT EXISTS help_needed text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS journey_stage public.journey_stage_type NOT NULL DEFAULT 'New',
  ADD COLUMN IF NOT EXISTS assigned_support_agent text;

-- Make old columns nullable for backward compatibility
ALTER TABLE public.candidates
  ALTER COLUMN profession DROP NOT NULL,
  ALTER COLUMN education_level DROP NOT NULL,
  ALTER COLUMN experience_years DROP NOT NULL,
  ALTER COLUMN specialty DROP NOT NULL,
  ALTER COLUMN license_status DROP NOT NULL,
  ALTER COLUMN english_level DROP NOT NULL,
  ALTER COLUMN availability DROP NOT NULL,
  ALTER COLUMN city_country DROP NOT NULL;

-- =============================================
-- C) EMPLOYERS: New columns and status enum
-- =============================================
CREATE TYPE public.employer_status_type AS ENUM ('New', 'Contacted', 'Meeting Booked', 'Closed');

ALTER TABLE public.employer_inquiries
  ADD COLUMN IF NOT EXISTS institution_name text,
  ADD COLUMN IF NOT EXISTS institutional_email text,
  ADD COLUMN IF NOT EXISTS title text,
  ADD COLUMN IF NOT EXISTS contact_mobile text,
  ADD COLUMN IF NOT EXISTS workforce_needs text,
  ADD COLUMN IF NOT EXISTS preferred_timeline text,
  ADD COLUMN IF NOT EXISTS employer_status public.employer_status_type NOT NULL DEFAULT 'New';

ALTER TABLE public.employer_inquiries
  ALTER COLUMN company_name DROP NOT NULL,
  ALTER COLUMN contact_name DROP NOT NULL,
  ALTER COLUMN email DROP NOT NULL,
  ALTER COLUMN country DROP NOT NULL;

-- =============================================
-- D) CONTENT_ITEMS: Unified content model
-- =============================================
CREATE TYPE public.content_item_type AS ENUM ('QuickstartChapter', 'News', 'SuccessStory');

CREATE TABLE public.content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type public.content_item_type NOT NULL,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  body text NOT NULL,
  tags text[] DEFAULT '{}',
  cover_image_url text,
  published boolean NOT NULL DEFAULT false,
  publish_date date,
  country_focus text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published content items"
  ON public.content_items FOR SELECT
  USING (published = true);

CREATE POLICY "Admins can manage content items"
  ON public.content_items FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_content_items_updated_at
  BEFORE UPDATE ON public.content_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Migrate existing data into content_items
INSERT INTO public.content_items (type, title, slug, excerpt, body, published, publish_date, created_at, updated_at)
SELECT 'News'::public.content_item_type, title, slug, excerpt, body, is_published, publish_date, created_at, updated_at
FROM public.content
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.content_items (type, title, slug, excerpt, body, published, created_at, updated_at)
SELECT 'QuickstartChapter'::public.content_item_type, title, slug, summary, body, is_published, created_at, updated_at
FROM public.quickstart_chapters
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.content_items (type, title, slug, excerpt, body, published, publish_date, created_at, updated_at)
SELECT 'SuccessStory'::public.content_item_type, title, slug, excerpt, body, is_published, publish_date, created_at, updated_at
FROM public.success_stories
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- E) FAQ_ITEMS
-- =============================================
CREATE TYPE public.faq_category_type AS ENUM ('General', 'Registration', 'English', 'Licensing', 'Pathways', 'Privacy', 'Employer');

CREATE TABLE public.faq_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category public.faq_category_type NOT NULL DEFAULT 'General',
  priority integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view FAQ items"
  ON public.faq_items FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage FAQ items"
  ON public.faq_items FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_faq_items_updated_at
  BEFORE UPDATE ON public.faq_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- F) CHAT_CONVERSATIONS
-- =============================================
CREATE TYPE public.chat_conv_status_type AS ENUM ('AI', 'Escalated', 'Closed');
CREATE TYPE public.chat_sender_type AS ENUM ('user', 'ai', 'human');

CREATE TABLE public.chat_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_identifier text NOT NULL,
  status public.chat_conv_status_type NOT NULL DEFAULT 'AI',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create chat conversations"
  ON public.chat_conversations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view chat conversations"
  ON public.chat_conversations FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update chat conversations"
  ON public.chat_conversations FOR UPDATE
  USING (true);

CREATE POLICY "Admins can delete chat conversations"
  ON public.chat_conversations FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_chat_conversations_updated_at
  BEFORE UPDATE ON public.chat_conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- G) CONVERSATION_MESSAGES
-- =============================================
CREATE TABLE public.conversation_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES public.chat_conversations(id) ON DELETE CASCADE NOT NULL,
  sender public.chat_sender_type NOT NULL,
  message_text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert conversation messages"
  ON public.conversation_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view conversation messages"
  ON public.conversation_messages FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage conversation messages"
  ON public.conversation_messages FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- H) CHAT_ESCALATION_TICKETS
-- =============================================
CREATE TYPE public.escalation_priority_type AS ENUM ('Low', 'Normal', 'High');
CREATE TYPE public.escalation_status_type AS ENUM ('Open', 'Assigned', 'In Progress', 'Resolved');

CREATE TABLE public.chat_escalation_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES public.chat_conversations(id),
  name text,
  email text,
  whatsapp text,
  issue_summary text NOT NULL,
  priority public.escalation_priority_type NOT NULL DEFAULT 'Normal',
  status public.escalation_status_type NOT NULL DEFAULT 'Open',
  assigned_to text,
  created_at timestamptz NOT NULL DEFAULT now(),
  first_response_at timestamptz,
  resolved_at timestamptz
);

ALTER TABLE public.chat_escalation_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create escalation tickets"
  ON public.chat_escalation_tickets FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view escalation tickets"
  ON public.chat_escalation_tickets FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update escalation tickets"
  ON public.chat_escalation_tickets FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete escalation tickets"
  ON public.chat_escalation_tickets FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- I) ADMIN ROLES: Add new role values
-- =============================================
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'editor';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'support_agent';
