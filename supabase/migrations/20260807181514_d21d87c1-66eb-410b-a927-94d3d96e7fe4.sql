-- Populate diagnostic_cases and then case_hypotheses
DO $$ 
DECLARE
    v_lab_id UUID;
    v_case_id_002 UUID;
    v_case_id_003 UUID;
    v_case_id_004 UUID;
BEGIN
    SELECT id INTO v_lab_id FROM public.laboratories WHERE name ILIKE '%Partida Direta%' LIMIT 1;
    
    -- PD-002
    SELECT id INTO v_case_id_002 FROM public.diagnostic_cases WHERE code = 'PD-002';
    IF v_case_id_002 IS NULL THEN
        INSERT INTO public.diagnostic_cases (code, title, description, laboratory_id, level, time_estimate, xp_reward, status)
        VALUES ('PD-002', 'Comando não retém', 'Motor só funciona enquanto botão S1 é pressionado.', v_lab_id, 'Iniciante', '15 min', 600, 'published')
        RETURNING id INTO v_case_id_002;
    END IF;

    -- PD-003
    SELECT id INTO v_case_id_003 FROM public.diagnostic_cases WHERE code = 'PD-003';
    IF v_case_id_003 IS NULL THEN
        INSERT INTO public.diagnostic_cases (code, title, description, laboratory_id, level, time_estimate, xp_reward, status)
        VALUES ('PD-003', 'Motor desarmando', 'Motor desliga sozinho por sobrecarga.', v_lab_id, 'Avançado', '20 min', 800, 'published')
        RETURNING id INTO v_case_id_003;
    END IF;

    -- PD-004
    SELECT id INTO v_case_id_004 FROM public.diagnostic_cases WHERE code = 'PD-004';
    IF v_case_id_004 IS NULL THEN
        INSERT INTO public.diagnostic_cases (code, title, description, laboratory_id, level, time_estimate, xp_reward, status)
        VALUES ('PD-004', 'Emergência Ativa', 'Botão de emergência travado.', v_lab_id, 'Iniciante', '5 min', 300, 'published')
        RETURNING id INTO v_case_id_004;
    END IF;

    -- Hypotheses (root_cause column)
    DELETE FROM public.case_hypotheses WHERE case_id IN (v_case_id_002, v_case_id_003, v_case_id_004);
    
    INSERT INTO public.case_hypotheses (case_id, title, description, is_correct, root_cause, validation_logic)
    VALUES 
    (v_case_id_002, 'Falha no Contato K1', 'Contato 13-14 aberto.', true, true, jsonb_build_object('requiredMeasurement', 'K1_13-K1_14', 'expectedResult', 'OPEN', 'ifMatch', 'confirma')),
    (v_case_id_003, 'Corrente Elevada no Motor', 'Corrente de 12.5A.', true, true, jsonb_build_object('requiredMeasurement', 'Corrente_L1', 'expectedResult', '12.5', 'ifMatch', 'confirma')),
    (v_case_id_004, 'Emergencia_1-2 Aberto', 'Contato emergência aberto.', true, true, jsonb_build_object('requiredMeasurement', 'Emergencia_1-2', 'expectedResult', 'OPEN', 'ifMatch', 'confirma'));

END $$;
