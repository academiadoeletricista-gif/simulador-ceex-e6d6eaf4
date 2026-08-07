UPDATE public.cases SET content = jsonb_build_object(
  'topology', CASE 
    WHEN code LIKE 'PD-%' THEN 'DOL'
    WHEN code LIKE 'RV-%' THEN 'REVERSING'
    WHEN code LIKE 'ET-%' THEN 'STAR_DELTA'
    ELSE 'DOL'
  END,
  'fault', jsonb_build_object(
    'type', CASE 
      WHEN code = 'PD-001' THEN 'OPEN_FUSE'
      WHEN code = 'PD-002' THEN 'BROKEN_COIL'
      WHEN code = 'PD-003' THEN 'TRIPPED_RELAY'
      WHEN code = 'PD-004' THEN 'BROKEN_AUX_CONTACT'
      WHEN code = 'PD-005' THEN 'MECHANICAL_FAILURE'
      WHEN code = 'RV-001' THEN 'BROKEN_COIL'
      WHEN code = 'RV-002' THEN 'BROKEN_COIL'
      WHEN code = 'RV-003' THEN 'WELDED_AUX_CONTACT'
      WHEN code = 'RV-004' THEN 'WELDED_AUX_CONTACT'
      WHEN code = 'RV-005' THEN 'SHORTED_COIL'
      WHEN code = 'ET-001' THEN 'BROKEN_AUX_CONTACT'
      WHEN code = 'ET-002' THEN 'BROKEN_COIL'
      WHEN code = 'ET-003' THEN 'WELDED_AUX_CONTACT'
      WHEN code = 'ET-004' THEN 'SHORTED_COIL'
      WHEN code = 'ET-005' THEN 'MECHANICAL_FAILURE'
      ELSE 'NONE'
    END,
    'componentTag', CASE 
      WHEN code = 'PD-001' THEN 'F1'
      WHEN code = 'PD-002' THEN 'K1'
      WHEN code = 'PD-003' THEN 'F2'
      WHEN code = 'PD-004' THEN 'K1'
      WHEN code = 'PD-005' THEN 'S1'
      WHEN code = 'RV-001' THEN 'K2'
      WHEN code = 'RV-002' THEN 'K1'
      WHEN code = 'RV-003' THEN 'K1'
      WHEN code = 'RV-004' THEN 'K2'
      WHEN code = 'RV-005' THEN 'K2'
      WHEN code = 'ET-001' THEN 'K1'
      WHEN code = 'ET-002' THEN 'T1'
      WHEN code = 'ET-003' THEN 'K2'
      WHEN code = 'ET-004' THEN 'K3'
      WHEN code = 'ET-005' THEN 'K3'
      ELSE ''
    END
  ),
  'components', CASE 
    WHEN code = 'PD-001' THEN '[{"tag": "F1", "isFaulty": true, "type": "FUSE", "label": "Fusível de Comando"}]'::jsonb
    WHEN code = 'PD-002' THEN '[{"tag": "K1", "isFaulty": true, "type": "CONTACTOR", "label": "Contator Principal"}]'::jsonb
    WHEN code = 'PD-003' THEN '[{"tag": "F2", "isFaulty": true, "type": "RELAY", "label": "Relé Térmico"}]'::jsonb
    WHEN code = 'PD-004' THEN '[{"tag": "K1", "isFaulty": true, "type": "CONTACTOR", "label": "Contator Principal"}]'::jsonb
    WHEN code = 'PD-005' THEN '[{"tag": "S1", "isFaulty": true, "type": "BUTTON", "label": "Botão de Emergência"}]'::jsonb
    ELSE '[]'::jsonb
  END,
  'availableTools', '["Multímetro", "Inspeção Visual", "Alicate Amperímetro"]'::jsonb,
  'initialState', '{"motor": "STOPPED", "q1": true, "q2": true}'::jsonb,
  'completionCriteria', '{"faultRemoved": true, "motorRunning": true}'::jsonb
) WHERE code IS NOT NULL;