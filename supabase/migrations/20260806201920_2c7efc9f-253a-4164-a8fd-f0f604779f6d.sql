-- Sprint 2B — Parte 4: Universal Case Schema

-- Create case difficulty enum
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'case_difficulty') THEN
        CREATE TYPE public.case_difficulty AS ENUM ('Iniciante', 'Intermediário', 'Avançado', 'Especialista');
    END IF;
END $$;

-- 1. Main Diagnostic Case Table
CREATE TABLE IF NOT EXISTS public.diagnostic_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    laboratory_id UUID REFERENCES public.laboratories(id) ON DELETE CASCADE,
    circuit_id UUID, -- Optional link to circuits table
    code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    level public.case_difficulty DEFAULT 'Iniciante',
    xp_reward INTEGER DEFAULT 100,
    time_estimate TEXT,
    complexity INTEGER DEFAULT 1, -- 1-5
    author TEXT,
    version TEXT DEFAULT '1.0.0',
    status TEXT DEFAULT 'draft', -- draft, published, archived
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Case Occurrences (Context/Scenario)
CREATE TABLE IF NOT EXISTS public.case_occurrences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES public.diagnostic_cases(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    operational_context TEXT,
    equipment TEXT,
    location TEXT,
    occurrence_date TIMESTAMPTZ DEFAULT now(),
    shift TEXT, -- Manhã, Tarde, Noite
    responsible TEXT,
    history TEXT,
    initial_condition TEXT,
    urgency TEXT DEFAULT 'Normal', -- Baixa, Normal, Alta, Crítica
    criticality TEXT DEFAULT 'Média', -- Baixa, Média, Alta
    operational_risk TEXT,
    operator_message TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Case Symptoms
CREATE TABLE IF NOT EXISTS public.case_symptoms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES public.diagnostic_cases(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT,
    priority INTEGER DEFAULT 1,
    visibility TEXT DEFAULT 'always', -- always, condition, hidden
    appearance_trigger TEXT, -- "start", "after_action_X"
    condition_logic JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Case Components (State of components in this case)
CREATE TABLE IF NOT EXISTS public.case_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES public.diagnostic_cases(id) ON DELETE CASCADE,
    component_id UUID, -- Reference to a global components catalog if available
    component_tag TEXT, -- KM1, F1, etc.
    initial_state TEXT NOT NULL, -- "normal", "failed", "open", "closed"
    expected_state TEXT NOT NULL,
    state_after_intervention TEXT,
    is_faulty BOOLEAN DEFAULT false,
    can_inspect BOOLEAN DEFAULT true,
    can_measure BOOLEAN DEFAULT true,
    can_replace BOOLEAN DEFAULT true,
    failure_details TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Case Measurements
CREATE TABLE IF NOT EXISTS public.case_measurements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES public.diagnostic_cases(id) ON DELETE CASCADE,
    measurement_point_id UUID, -- Reference to global measurement points
    point_code TEXT NOT NULL,
    expected_value TEXT,
    real_value TEXT NOT NULL, -- The value the user will actually measure
    presented_value TEXT, -- What displays on the multimeter
    unit TEXT,
    precision FLOAT,
    tolerance FLOAT,
    display_message TEXT,
    state TEXT,
    condition TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Case Actions (Catalog of possible actions)
CREATE TABLE IF NOT EXISTS public.case_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES public.diagnostic_cases(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT, -- "measurement", "inspection", "replacement", "operation"
    time_cost INTEGER DEFAULT 1, -- in minutes
    xp_reward INTEGER DEFAULT 5,
    required_tool TEXT, -- "multimeter", "screwdriver", etc.
    expected_result TEXT,
    real_result TEXT,
    impact TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Case Hypotheses (Logic for evaluation)
CREATE TABLE IF NOT EXISTS public.case_hypotheses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES public.diagnostic_cases(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    is_correct BOOLEAN DEFAULT false,
    root_cause BOOLEAN DEFAULT false,
    validation_logic JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Case Hints (Multi-level help)
CREATE TABLE IF NOT EXISTS public.case_hints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES public.diagnostic_cases(id) ON DELETE CASCADE,
    level INTEGER NOT NULL, -- 1, 2, 3
    content TEXT NOT NULL,
    explanation TEXT,
    fundamental_basis TEXT,
    xp_penalty INTEGER DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Case Errors (Predicted mistakes)
CREATE TABLE IF NOT EXISTS public.case_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES public.diagnostic_cases(id) ON DELETE CASCADE,
    error_type TEXT NOT NULL, -- "unnecessary_replacement", "incorrect_measurement"
    description TEXT NOT NULL,
    feedback TEXT NOT NULL,
    xp_penalty INTEGER DEFAULT 10,
    penalty_explanation TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Case Lessons (Post-case education)
CREATE TABLE IF NOT EXISTS public.case_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES public.diagnostic_cases(id) ON DELETE CASCADE,
    technical_summary TEXT,
    failure_explanation TEXT,
    circuit_theory TEXT,
    fundamental_basis TEXT,
    best_practices TEXT,
    norms_related TEXT,
    safety_warnings TEXT,
    common_mistakes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.diagnostic_cases TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_occurrences TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_symptoms TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_components TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_measurements TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_actions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_hypotheses TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_hints TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_errors TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_lessons TO authenticated;

GRANT ALL ON public.diagnostic_cases TO service_role;
GRANT ALL ON public.case_occurrences TO service_role;
GRANT ALL ON public.case_symptoms TO service_role;
GRANT ALL ON public.case_components TO service_role;
GRANT ALL ON public.case_measurements TO service_role;
GRANT ALL ON public.case_actions TO service_role;
GRANT ALL ON public.case_hypotheses TO service_role;
GRANT ALL ON public.case_hints TO service_role;
GRANT ALL ON public.case_errors TO service_role;
GRANT ALL ON public.case_lessons TO service_role;

-- RLS
ALTER TABLE public.diagnostic_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_occurrences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_hypotheses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_hints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_lessons ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read diagnostic_cases" ON public.diagnostic_cases FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read case_occurrences" ON public.case_occurrences FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read case_symptoms" ON public.case_symptoms FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read case_components" ON public.case_components FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read case_measurements" ON public.case_measurements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read case_actions" ON public.case_actions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read case_hypotheses" ON public.case_hypotheses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read case_hints" ON public.case_hints FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read case_errors" ON public.case_errors FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read case_lessons" ON public.case_lessons FOR SELECT TO authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_diagnostic_cases_lab ON public.diagnostic_cases(laboratory_id);
CREATE INDEX IF NOT EXISTS idx_case_occurrences_case ON public.case_occurrences(case_id);
CREATE INDEX IF NOT EXISTS idx_case_symptoms_case ON public.case_symptoms(case_id);
CREATE INDEX IF NOT EXISTS idx_case_actions_case ON public.case_actions(case_id);
CREATE INDEX IF NOT EXISTS idx_case_measurements_case ON public.case_measurements(case_id);
