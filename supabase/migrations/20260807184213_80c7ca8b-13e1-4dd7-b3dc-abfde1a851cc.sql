-- Fix permissions for case_hypotheses to allow the migration to run and students to read
GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_hypotheses TO anon, authenticated;
GRANT ALL ON public.case_hypotheses TO service_role;

-- Ensure RLS allows the operations if it's enabled
-- We use a simple policy for the simulation context
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'case_hypotheses' AND policyname = 'Allow all for now'
    ) THEN
        CREATE POLICY "Allow all for now" ON public.case_hypotheses FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
    END IF;
END $$;
