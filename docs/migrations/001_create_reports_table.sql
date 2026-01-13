-- Reports table for content moderation
-- Run this in Supabase SQL Editor to enable the report system

CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sheet_id UUID REFERENCES public.sheets_meta(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reporter_email TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Policies: Anyone can insert reports, only users can view their own
CREATE POLICY "Anyone can create reports"
  ON public.reports
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own reports"
  ON public.reports
  FOR SELECT
  USING (
    reporter_id = (SELECT auth.uid())
    OR reporter_email = (SELECT auth.jwt() ->> 'email')
  );

-- Admin policy (uncomment when you have admin role)
-- CREATE POLICY "Admins can view all reports"
--   ON public.reports
--   FOR ALL
--   USING (
--     (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
--   );

-- Index for quick lookup
CREATE INDEX IF NOT EXISTS reports_sheet_id_idx ON public.reports(sheet_id);
CREATE INDEX IF NOT EXISTS reports_status_idx ON public.reports(status);
CREATE INDEX IF NOT EXISTS reports_created_at_idx ON public.reports(created_at DESC);

-- Grant access
GRANT SELECT, INSERT ON public.reports TO anon, authenticated;
