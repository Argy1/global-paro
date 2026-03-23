
-- Remove unused roles from enum by recreating it with CASCADE
-- First clean up data
DELETE FROM public.user_roles WHERE role::text NOT IN ('admin', 'user');

-- Drop old enum with cascade (this drops dependent policies/functions too)
DROP TYPE IF EXISTS public.app_role_new;
ALTER TABLE public.user_roles ALTER COLUMN role TYPE text;
DROP TYPE public.app_role CASCADE;

-- Create simplified enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Restore user_roles column
ALTER TABLE public.user_roles ALTER COLUMN role TYPE public.app_role USING role::public.app_role;

-- Recreate has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Recreate all RLS policies that used app_role

-- user_roles
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- employer_inquiries
CREATE POLICY "Admins can view employer inquiries" ON public.employer_inquiries FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update employer inquiries" ON public.employer_inquiries FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- chat_messages
CREATE POLICY "Admins can view chat messages" ON public.chat_messages FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update chat messages" ON public.chat_messages FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- success_stories
CREATE POLICY "Admins can manage stories" ON public.success_stories FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- quickstart_chapters
CREATE POLICY "Admins can manage chapters" ON public.quickstart_chapters FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- site_settings
CREATE POLICY "Admins can manage settings" ON public.site_settings FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- content_items
CREATE POLICY "Admins can manage content items" ON public.content_items FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- faq_items
CREATE POLICY "Admins can manage FAQ items" ON public.faq_items FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- chat_conversations
CREATE POLICY "Admins can delete chat conversations" ON public.chat_conversations FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- conversation_messages
CREATE POLICY "Admins can manage conversation messages" ON public.conversation_messages FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- chat_escalation_tickets
CREATE POLICY "Admins can view escalation tickets" ON public.chat_escalation_tickets FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update escalation tickets" ON public.chat_escalation_tickets FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete escalation tickets" ON public.chat_escalation_tickets FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- candidate_documents
CREATE POLICY "Admins can view all documents" ON public.candidate_documents FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete any documents" ON public.candidate_documents FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- webinars
CREATE POLICY "Admins can select all webinars" ON public.webinars FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert webinars" ON public.webinars FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update webinars" ON public.webinars FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete webinars" ON public.webinars FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- webinar_registrations
CREATE POLICY "Admins can read registrations" ON public.webinar_registrations FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete registrations" ON public.webinar_registrations FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- storage policy for admin candidate docs (recreate)
CREATE POLICY "Admins can view all candidate docs" ON storage.objects FOR SELECT USING (bucket_id = 'candidate-documents' AND has_role(auth.uid(), 'admin'::app_role));
