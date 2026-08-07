-- Final Final Attempt: Resolve code duplicates and sync
DO $$ 
DECLARE
    v_lab_id UUID;
BEGIN
    SELECT id INTO v_lab_id FROM public.laboratories WHERE name ILIKE '%Partida Direta%' LIMIT 1;

    -- Clean up any diagnostic_cases that don't match our main cases table IDs for these codes
    DELETE FROM public.diagnostic_cases WHERE code IN ('PD-001', 'PD-002', 'PD-003') AND id NOT IN (SELECT id FROM public.cases);

    -- PD-001 Sync
    INSERT INTO public.diagnostic_cases (id, code, title, description, laboratory_id, level, xp_reward, time_estimate, status)
    SELECT id, code, title, description, laboratory_id, level::public.case_difficulty, xp_reward, time_estimate, 'published'
    FROM public.cases WHERE code = 'PD-001'
    ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, title = EXCLUDED.title;

    -- PD-002 Sync
    INSERT INTO public.diagnostic_cases (id, code, title, description, laboratory_id, level, xp_reward, time_estimate, status)
    SELECT id, code, title, description, laboratory_id, level::public.case_difficulty, xp_reward, time_estimate, 'published'
    FROM public.cases WHERE code = 'PD-002'
    ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, title = EXCLUDED.title;

    -- Update Hypotheses for PD-001
    DELETE FROM public.case_hypotheses WHERE case_id = (SELECT id FROM public.cases WHERE code = 'PD-001');
    INSERT INTO public.case_hypotheses (case_id, title, description, is_correct, root_cause, validation_logic)
    SELECT id, 'Fusível F1 Queimado', 'Fusível de comando aberto.', true, true, 
        jsonb_build_object('requiredMeasurement', 'F1_in-F1_out', 'expectedResult', '0V', 'ifMatch', 'confirma')
    FROM public.cases WHERE code = 'PD-001';

    -- Update Hypotheses for PD-002
    DELETE FROM public.case_hypotheses WHERE case_id = (SELECT id FROM public.cases WHERE code = 'PD-002');
    INSERT INTO public.case_hypotheses (case_id, title, description, is_correct, root_cause, validation_logic)
    SELECT id, 'Relé Térmico F2 Atuado', 'Contato 95-96 aberto.', true, true, 
        jsonb_build_object('requiredMeasurement', '95-96', 'expectedResult', 'OPEN', 'ifMatch', 'confirma')
    FROM public.cases WHERE code = 'PD-002';

END $$;
