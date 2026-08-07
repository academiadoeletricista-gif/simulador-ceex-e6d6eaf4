-- Migration for Case PD-001 (Motor não liga - Fusível Queimado)
DO $$ 
DECLARE
    v_case_id UUID;
    v_lab_id UUID;
BEGIN
    SELECT id INTO v_lab_id FROM public.laboratories WHERE name ILIKE '%Partida Direta%' LIMIT 1;
    IF v_lab_id IS NULL THEN
        INSERT INTO public.laboratories (name, description, level, image_url)
        VALUES ('Partida Direta', 'Laboratório de comandos básicos', 'Iniciante', 'https://images.unsplash.com/photo-1581092160562-40aa08e78837')
        RETURNING id INTO v_lab_id;
    END IF;

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
                jsonb_build_object('id', 'ev_f1_in_out', 'type', 'measurement', 'label', 'F1_in-F1_out', 'value', '220'),
                jsonb_build_object('id', 'ev_f2_in_out', 'type', 'measurement', 'label', 'F2_in-F2_out', 'value', '0'),
                jsonb_build_object('id', 'ev_95_96', 'type', 'measurement', 'label', '95-96', 'value', '0'),
                jsonb_build_object('id', 'ev_k1_a1_a2', 'type', 'measurement', 'label', 'K1_A1-K1_A2', 'value', '0')
            ),
            'decisionTree', jsonb_build_array(
                jsonb_build_object(
                    'id', 'OBSERVE',
                    'situation', 'O motor M1 não parte. O painel está energizado.',
                    'options', jsonb_build_array(
                        jsonb_build_object('label', 'Realizar Inspeção Visual', 'nextNodeId', 'inspect_visual'),
                        jsonb_build_object('label', 'Testar Operação', 'nextNodeId', 'test_operation')
                    )
                ),
                jsonb_build_object(
                    'id', 'COMPLETED',
                    'situation', 'O motor está operando normalmente.',
                    'isCompletion', true,
                    'lesson', jsonb_build_object(
                        'technicalSummary', 'O fusível F1 estava aberto, impedindo a alimentação do circuito de comando.',
                        'failureExplanation', 'Um fusível aberto interrompe a continuidade elétrica. No comando, isso impede que a bobina do contator seja energizada.',
                        'circuitTheory', 'A Lei de Ohm e as Leis de Kirchhoff explicam que sem um caminho fechado, não há corrente.',
                        'fundamentalBasis', 'Continuidade e Proteção Elétrica.',
                        'bestPractices', 'Sempre verifique as proteções antes de desmontar componentes complexos.',
                        'safetyWarnings', 'Certifique-se de que não há curto-circuito antes de substituir um fusível.'
                    )
                )
            )
        )
    )
    ON CONFLICT (code) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        content = EXCLUDED.content,
        laboratory_id = EXCLUDED.laboratory_id
    RETURNING id INTO v_case_id;

    DELETE FROM public.case_hypotheses WHERE case_id = v_case_id;

    INSERT INTO public.case_hypotheses (case_id, title, description, is_correct, is_root_cause, validation_logic)
    VALUES 
    (v_case_id, 'Fusível F1 Aberto', 'O fusível de proteção do comando (F1) está interrompido.', true, true, 
        jsonb_build_object(
            'requiredMeasurement', 'F1_in-F1_out',
            'expectedResult', '220',
            'ifMatch', 'confirma'
        )
    ),
    (v_case_id, 'Bobina K1 Queimada', 'A bobina do contator principal está com interrupção interna.', false, false,
        jsonb_build_object(
            'requiredMeasurement', 'K1_A1-K1_A2',
            'expectedResult', '220',
            'ifMatch', 'confirma'
        )
    ),
    (v_case_id, 'Falha no Relé Térmico', 'O contato 95-96 do relé térmico está aberto.', false, false,
        jsonb_build_object(
            'requiredMeasurement', '95-96',
            'expectedResult', '220',
            'ifMatch', 'confirma'
        )
    );
END $$;
