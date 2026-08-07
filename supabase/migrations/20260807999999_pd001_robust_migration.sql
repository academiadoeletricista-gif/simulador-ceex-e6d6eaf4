-- Migration for Case PD-001 (Motor não liga - Fusível Queimado)
-- Ensures the case exists with proper content for the new ScenarioRuntime

DO $$ 
DECLARE
    v_case_id UUID;
    v_lab_id UUID;
BEGIN
    -- Get Lab ID for "Partida Direta"
    SELECT id INTO v_lab_id FROM public.laboratories WHERE name ILIKE '%Partida Direta%' LIMIT 1;
    
    IF v_lab_id IS NULL THEN
        INSERT INTO public.laboratories (name, description, level, image_url)
        VALUES ('Partida Direta', 'Laboratório de comandos básicos', 'Iniciante', 'https://images.unsplash.com/photo-1581092160562-40aa08e78837')
        RETURNING id INTO v_lab_id;
    END IF;

    -- Upsert Case PD-001
    INSERT INTO public.cases (code, title, description, laboratory_id, level, time_estimate, xp_reward, published, content)
    VALUES (
        'PD-001', 
        'Motor não liga', 
        'O motor M1 não parte após o acionamento do botão de partida.', 
        v_lab_id, 
        'Iniciante', 
        '10 min', 
        500, 
        true,
        jsonb_build_object(
            'workOrder', jsonb_build_object(
                'customer', 'Metalúrgica Alfa',
                'machine', 'Prensa Hidráulica M1',
                'symptoms', 'O operador relata que ao pressionar o botão de partida (S1), o motor não apresenta qualquer sinal de movimento ou ruído.'
            ),
            'topology', 'DOL',
            'availableTools', jsonb_build_array('Multímetro', 'Inspeção Visual'),
            'evidenceData', jsonb_build_array(
                jsonb_build_object('id', 'ev_k1_off', 'type', 'visual', 'label', 'Contator K1', 'value', 'Desligado (Não atracado)'),
                jsonb_build_object('id', 'ev_f1_in', 'type', 'measurement', 'label', 'F1_in', 'value', '220V'),
                jsonb_build_object('id', 'ev_f1_out', 'type', 'measurement', 'label', 'F1_out', 'value', '0V'),
                jsonb_build_object('id', 'ev_f2_in', 'type', 'measurement', 'label', 'F2_in', 'value', '220V'),
                jsonb_build_object('id', 'ev_f2_out', 'type', 'measurement', 'label', 'F2_out', 'value', '220V')
            )
        )
    )
    ON CONFLICT (code) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        content = EXCLUDED.content,
        laboratory_id = EXCLUDED.laboratory_id
    RETURNING id INTO v_case_id;

    -- Clear and Insert Hypotheses for PD-001
    DELETE FROM public.case_hypotheses WHERE case_id = v_case_id;

    INSERT INTO public.case_hypotheses (case_id, title, description, is_correct, is_root_cause, validation_logic)
    VALUES 
    (v_case_id, 'Fusível F1 Aberto', 'O fusível de proteção do comando (F1) está interrompido.', true, true, 
        jsonb_build_object(
            'requiredMeasurement', 'F1_in-F1_out',
            'expectedResult', '220V', -- Diferença de potencial sobre fusível aberto
            'ifMatch', 'confirma'
        )
    ),
    (v_case_id, 'Bobina K1 Queimada', 'A bobina do contator principal está com interrupção interna.', false, false,
        jsonb_build_object(
            'requiredMeasurement', 'K1_A1-K1_A2',
            'expectedResult', '220V', -- Tensão chega mas não atraca
            'ifMatch', 'confirma'
        )
    ),
    (v_case_id, 'Falha no Relé Térmico', 'O contato 95-96 do relé térmico está aberto.', false, false,
        jsonb_build_object(
            'requiredMeasurement', '95-96',
            'expectedResult', '0V', -- 0V indica contato fechado (normal)
            'ifMatch', 'descarta'
        )
    );
END $$;
