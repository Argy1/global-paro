
-- 1. Add user_id column to candidates (nullable, to link with auth.users)
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_candidates_user_id ON public.candidates(user_id) WHERE user_id IS NOT NULL;

-- 2. Create candidate_documents table
CREATE TABLE public.candidate_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_type text NOT NULL DEFAULT 'other',
  file_size_bytes bigint,
  uploaded_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.candidate_documents ENABLE ROW LEVEL SECURITY;

-- Candidates can view their own documents
CREATE POLICY "Candidates can view own documents"
ON public.candidate_documents FOR SELECT
USING (auth.uid() = user_id);

-- Candidates can upload documents
CREATE POLICY "Candidates can insert own documents"
ON public.candidate_documents FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Candidates can delete own documents
CREATE POLICY "Candidates can delete own documents"
ON public.candidate_documents FOR DELETE
USING (auth.uid() = user_id);

-- Admins can view all documents
CREATE POLICY "Admins can view all documents"
ON public.candidate_documents FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete any documents
CREATE POLICY "Admins can delete any documents"
ON public.candidate_documents FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- 3. Create storage bucket for candidate documents
INSERT INTO storage.buckets (id, name, public) VALUES ('candidate-documents', 'candidate-documents', false);

-- Storage policies: candidates can upload to their own folder
CREATE POLICY "Candidates can upload own docs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'candidate-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Candidates can view own docs"
ON storage.objects FOR SELECT
USING (bucket_id = 'candidate-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Candidates can delete own docs"
ON storage.objects FOR DELETE
USING (bucket_id = 'candidate-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Admins can view all docs in bucket
CREATE POLICY "Admins can view all candidate docs"
ON storage.objects FOR SELECT
USING (bucket_id = 'candidate-documents' AND public.has_role(auth.uid(), 'admin'));

-- 4. Add RLS policy so candidates can view their own record
CREATE POLICY "Candidates can view own record"
ON public.candidates FOR SELECT
USING (auth.uid() = user_id);

-- 5. Allow authenticated users to update user_id on their own record (for linking)
CREATE POLICY "Candidates can link own account"
ON public.candidates FOR UPDATE
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()))
WITH CHECK (user_id = auth.uid());
