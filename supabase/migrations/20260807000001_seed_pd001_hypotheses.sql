DO $$
DECLARE
    case_uuid uuid;
BEGIN
    SELECT id INTO case_uuid FROM public.cases WHERE code = 'PD-001' LIMIT 1;
    
    IF case_uuid IS NOT NULL THEN
        -- Delete old ones if any
        DELETE FROM public.case_hypotheses WHERE case_id = case_uuid;

        INSERT INTO public.case_hypotheses (case_id, title, description, is_correct, is_root_cause, validation_logic)
        VALUES 
        (case_uuid, 'Fusível de Comando Aberto (F1)', 'O fusível F1 protege o circuito de comando. Se ele queimar, nada no comando funcionará.', true, true, '{"requiredMeasurement": "F1_in-F1_out", "expectedResult": "0V", "ifMatch": "confirma", "ifNoMatch": "descarta"}'),
        (case_uuid, 'Falta de Fase na Alimentação (L1)', 'Sem a fase L1, o circuito de comando fica desenergizado na origem.', false, false, '{"requiredMeasurement": "L1-N", "expectedResult": "220V", "ifMatch": "descarta", "ifNoMatch": "confirma"}'),
        (case_uuid, 'Contato de Proteção Térmica Aberto (95-96)', 'O relé térmico pode ter atuado por sobrecarga, abrindo o contato 95-96.', false, false, '{"requiredMeasurement": "95-96", "expectedResult": "220V", "ifMatch": "descarta", "ifNoMatch": "confirma"}');
    END IF;
END $$;
