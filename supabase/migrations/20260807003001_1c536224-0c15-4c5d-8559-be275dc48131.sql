UPDATE public.cases SET content = jsonb_build_object(
  'workOrder', jsonb_build_object(
    'customer', 'Planta Industrial Alpha',
    'machine', 'Painel de Partida Direta K1',
    'symptoms', 'O motor não parte ao pressionar o botão de ligar.'
  ),
  'decisionTree', jsonb_build_array(
    jsonb_build_object(
      'id', 'start',
      'label', 'Início da Investigação',
      'situation', 'Você está diante do painel. Por onde deseja começar?',
      'options', jsonb_build_array(
        jsonb_build_object(
          'label', 'Realizar Inspeção Visual',
          'detail', 'Verificar estado físico dos componentes e fiação.',
          'nextNodeId', 'visual_inspection',
          'xpReward', 20
        ),
        jsonb_build_object(
          'label', 'Medir Tensão de Entrada',
          'detail', 'Verificar se há alimentação nos bornes principais.',
          'nextNodeId', 'measure_input',
          'xpReward', 50
        ),
        jsonb_build_object(
          'label', 'Tentar Partida Forçada',
          'detail', 'Pressionar manualmente o contator.',
          'consequence', 'Risco de segurança! O disjuntor de proteção atuou violentamente.',
          'nextNodeId', 'safety_trip',
          'xpReward', -50
        )
      )
    ),
    jsonb_build_object(
      'id', 'visual_inspection',
      'label', 'Inspeção Visual Concluída',
      'situation', 'Ao inspecionar o painel, você nota que o fusível F1 parece ter a base escurecida.',
      'options', jsonb_build_array(
        jsonb_build_object(
          'label', 'Medir continuidade do fusível F1',
          'nextNodeId', 'measure_fuse',
          'xpReward', 40
        ),
        jsonb_build_object(
          'label', 'Ignorar e medir tensão na bobina de K1',
          'nextNodeId', 'measure_coil',
          'xpReward', 20
        )
      )
    ),
    jsonb_build_object(
      'id', 'measure_fuse',
      'label', 'Medição do Fusível',
      'situation', 'O multímetro indica resistência infinita (circuito aberto) no fusível F1.',
      'options', jsonb_build_array(
        jsonb_build_object(
          'label', 'Substituir o Fusível F1',
          'nextNodeId', 'success',
          'isCompletion', true,
          'xpReward', 300
        ),
        jsonb_build_object(
          'label', 'Procurar por curtos antes de trocar',
          'nextNodeId', 'check_short',
          'xpReward', 100
        )
      )
    ),
    jsonb_build_object(
      'id', 'success',
      'label', 'Reparo Concluído',
      'situation', 'O fusível foi substituído e o motor partiu normalmente.',
      'isCompletion', true
    )
  ),
  'possibleFaults', jsonb_build_array(
    jsonb_build_object('id', 'fuse_f1', 'label', 'Fusível F1 Queimado', 'confidence', 0),
    jsonb_build_object('id', 'coil_k1', 'label', 'Bobina K1 Interrompida', 'confidence', 0),
    jsonb_build_object('id', 'relay_f2', 'label', 'Relé Térmico F2 Atuado', 'confidence', 0)
  ),
  'evidenceData', jsonb_build_array(
    jsonb_build_object(
      'id', 'fuse_open',
      'type', 'measurement',
      'label', 'Continuidade F1',
      'value', 'Aberto',
      'impacts', jsonb_build_object('fuse_f1', 80, 'coil_k1', -20)
    )
  )
) WHERE code = 'PD-001';