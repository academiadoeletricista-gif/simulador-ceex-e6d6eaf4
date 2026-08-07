CREATE TABLE public.case_hypotheses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id uuid REFERENCES public.cases(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    description text,
    is_correct boolean DEFAULT false,
    is_root_cause boolean DEFAULT false,
    validation_logic jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_hypotheses TO authenticated;
GRANT ALL ON public.case_hypotheses TO service_role;
GRANT SELECT ON public.case_hypotheses TO anon;

ALTER TABLE public.case_hypotheses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read for case_hypotheses" ON public.case_hypotheses
    FOR SELECT USING (true);

-- Populate 3-4 hypotheses for Case PD-001 (F1 Fuse)
-- We need the UUID of Case PD-001 from public.cases
-- Assuming Case PD-001 code = 'PD-001'
DO $$
DECLARE
    case_uuid uuid;
BEGIN
    SELECT id INTO case_uuid FROM public.cases WHERE code = 'PD-001' LIMIT 1;
    
    IF case_uuid IS NOT NULL THEN
        INSERT INTO public.case_hypotheses (case_id, title, description, is_correct, is_root_cause, validation_logic)
        VALUES 
        (case_uuid, 'Fusível F1 Queimado', 'O fusível de comando F1 pode estar aberto, impedindo a alimentação do circuito de controle.', true, true, '{"requiredMeasurement": "F1_in-F1_out", "expectedResult": "0V", "ifMatch": "confirma", "ifNoMatch": "descarta"}'),
        (case_uuid, 'Rede Elétrica sem Tensão', 'Pode haver falta de fase na alimentação principal da planta.', false, false, '{"requiredMeasurement": "L1-N", "expectedResult": "220V", "ifMatch": "descarta", "ifNoMatch": "confirma"}'),
        (case_uuid, 'Botão de Emergência Acionado', 'O botão de emergência pode estar travado, interrompendo o fluxo.', false, false, '{"requiredMeasurement": "95-96", "expectedResult": "220V", "ifMatch": "descarta", "ifNoMatch": "confirma"}');
    END IF;
END $$;
