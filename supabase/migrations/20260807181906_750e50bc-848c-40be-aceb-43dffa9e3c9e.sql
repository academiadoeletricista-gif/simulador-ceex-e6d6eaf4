-- PD-006 to PD-010 Final Sync
DO $$ 
DECLARE
    v_lab_id UUID;
    v_case_id UUID;
BEGIN
    SELECT id INTO v_lab_id FROM public.laboratories WHERE name ILIKE '%Partida Direta%' LIMIT 1;
    
    -- PD-006
    SELECT id INTO v_case_id FROM public.cases WHERE code = 'PD-006';
    INSERT INTO public.diagnostic_cases (id, code, title, description, laboratory_id, level, xp_reward, time_estimate, status)
    VALUES (v_case_id, 'PD-006', 'DH-001 — Não troca velocidade', 'Fusível do comando aberto.', v_lab_id, 'Iniciante', 400, '10 min', 'published')
    ON CONFLICT (id) DO NOTHING;
    
    DELETE FROM public.case_hypotheses WHERE case_id = v_case_id;
    INSERT INTO public.case_hypotheses (case_id, title, description, is_correct, root_cause, validation_logic)
    VALUES (v_case_id, 'Fusível F1 Queimado', 'O fusível de proteção do circuito de comando está aberto.', true, true, 
        jsonb_build_object('requiredMeasurement', 'F1_in-F1_out', 'expectedResult', '0V', 'ifMatch', 'confirma'));

    -- PD-007
    SELECT id INTO v_case_id FROM public.cases WHERE code = 'PD-007';
    INSERT INTO public.diagnostic_cases (id, code, title, description, laboratory_id, level, xp_reward, time_estimate, status)
    VALUES (v_case_id, 'PD-007', 'DH-002 — Alta não funciona', 'Contato auxiliar de selo aberto.', v_lab_id, 'Intermediário', 600, '15 min', 'published')
    ON CONFLICT (id) DO NOTHING;
    
    DELETE FROM public.case_hypotheses WHERE case_id = v_case_id;
    INSERT INTO public.case_hypotheses (case_id, title, description, is_correct, root_cause, validation_logic)
    VALUES (v_case_id, 'Falha no Contato de Selo K1 (13-14)', 'O contato auxiliar não está fechando.', true, true, 
        jsonb_build_object('requiredMeasurement', 'K1_13-K1_14', 'expectedResult', 'OPEN', 'ifMatch', 'confirma'));

    -- PD-008
    SELECT id INTO v_case_id FROM public.cases WHERE code = 'PD-008';
    INSERT INTO public.diagnostic_cases (id, code, title, description, laboratory_id, level, xp_reward, time_estimate, status)
    VALUES (v_case_id, 'PD-008', 'DH-003 — Baixa não funciona', 'Bobina do contator interrompida.', v_lab_id, 'Intermediário', 500, '12 min', 'published')
    ON CONFLICT (id) DO NOTHING;
    
    DELETE FROM public.case_hypotheses WHERE case_id = v_case_id;
    INSERT INTO public.case_hypotheses (case_id, title, description, is_correct, root_cause, validation_logic)
    VALUES (v_case_id, 'Bobina de K1 Queimada', 'Bobina em circuito aberto.', true, true, 
        jsonb_build_object('requiredMeasurement', 'Resistência Bobina K1', 'expectedResult', 'INFINITE', 'ifMatch', 'confirma'));

    -- PD-009
    SELECT id INTO v_case_id FROM public.cases WHERE code = 'PD-009';
    INSERT INTO public.diagnostic_cases (id, code, title, description, laboratory_id, level, xp_reward, time_estimate, status)
    VALUES (v_case_id, 'PD-009', 'DH-004 — Polos não comutam', 'Contato auxiliar soldado.', v_lab_id, 'Avançado', 800, '20 min', 'published')
    ON CONFLICT (id) DO NOTHING;
    
    DELETE FROM public.case_hypotheses WHERE case_id = v_case_id;
    INSERT INTO public.case_hypotheses (case_id, title, description, is_correct, root_cause, validation_logic)
    VALUES (v_case_id, 'Contato NF K1 Soldado', 'Contato de intertravamento colado.', true, true, 
        jsonb_build_object('requiredMeasurement', 'K1_21-K1_22', 'expectedResult', 'CLOSED', 'ifMatch', 'confirma'));

    -- PD-010
    SELECT id INTO v_case_id FROM public.cases WHERE code = 'PD-010';
    INSERT INTO public.diagnostic_cases (id, code, title, description, laboratory_id, level, xp_reward, time_estimate, status)
    VALUES (v_case_id, 'PD-010', 'DH-005 — Proteção na troca', 'Botão STOP aberto.', v_lab_id, 'Iniciante', 300, '8 min', 'published')
    ON CONFLICT (id) DO NOTHING;
    
    DELETE FROM public.case_hypotheses WHERE case_id = v_case_id;
    INSERT INTO public.case_hypotheses (case_id, title, description, is_correct, root_cause, validation_logic)
    VALUES (v_case_id, 'Botão STOP S0 com Defeito', 'Contato NF permanentemente aberto.', true, true, 
        jsonb_build_object('requiredMeasurement', 'S0_1-S0_2', 'expectedResult', 'OPEN', 'ifMatch', 'confirma'));

END $$;
