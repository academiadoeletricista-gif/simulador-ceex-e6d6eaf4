-- Missing tables for Sprint 2B Part 4

CREATE TABLE IF NOT EXISTS public.case_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES public.diagnostic_cases(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    score INTEGER,
    feedback_text TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.case_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES public.diagnostic_cases(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT, -- completed, failed, abandoned
    total_xp INTEGER,
    accuracy FLOAT,
    time_spent INTEGER, -- in seconds
    actions_taken JSONB DEFAULT '[]',
    errors_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_feedback TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_results TO authenticated;
GRANT ALL ON public.case_feedback TO service_role;
GRANT ALL ON public.case_results TO service_role;

ALTER TABLE public.case_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own feedback" ON public.case_feedback 
    FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own results" ON public.case_results 
    FOR ALL TO authenticated USING (auth.uid() = user_id);
