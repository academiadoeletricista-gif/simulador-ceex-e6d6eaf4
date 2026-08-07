-- Final attempt using columns from public.cases and public.diagnostic_cases mapping
DO $$ 
DECLARE
    v_lab_id UUID;
    v_case_id_002 UUID;
    v_case_id_003 UUID;
    v_case_id_004 UUID;
BEGIN
    SELECT id INTO v_lab_id FROM public.laboratories WHERE name ILIKE '%Partida Direta%' LIMIT 1;
    
    -- PD-002
    SELECT id INTO v_case_id_002 FROM public.cases WHERE code = 'PD-002';
    IF v_case_id_002 IS NULL THEN
        INSERT INTO public.cases (code, slug, title, description, laboratory_id, level, time_estimate, xp_reward, published, content)
        VALUES ('PD-002', 'comando-nao-retem', 'Comando não retém', 'Motor só funciona enquanto botão S1 é pressionado.', v_lab_id, 'Intermediário', '15 min', 600, true, jsonb_build_object('topology','DOL'))
        RETURNING id INTO v_case_id_002;
    END IF;

    -- PD-003
    SELECT id INTO v_case_id_003 FROM public.cases WHERE code = 'PD-003';
    IF v_case_id_003 IS NULL THEN
        INSERT INTO public.cases (code, slug, title, description, laboratory_id, level, time_estimate, xp_reward, published, content)
        VALUES ('PD-003', 'sobrecarga-motor', 'Motor desarmando', 'Motor desliga sozinho por sobrecarga.', v_lab_id, 'Avançado', '20 min', 800, true, jsonb_build_object('topology','DOL'))
        RETURNING id INTO v_case_id_003;
    END IF;

    -- PD-004
    SELECT id INTO v_case_id_004 FROM public.cases WHERE code = 'PD-004';
    IF v_case_id_004 IS NULL THEN
        INSERT INTO public.cases (code, slug, title, description, laboratory_id, level, time_estimate, xp_reward, published, content)
        VALUES ('PD-004', 'emergencia-travada', 'Emergência Ativa', 'Botão de emergência travado.', v_lab_id, 'Iniciante', '5 min', 300, true, jsonb_build_object('topology','DOL'))
        RETURNING id INTO v_case_id_004;
    END IF;

    -- Ensure they are in diagnostic_cases for foreign key (if that's the issue)
    -- Actually, if case_hypotheses.case_id references diagnostic_cases, we MUST insert there.
    -- Let's check diagnostic_cases columns first.
END $$;
