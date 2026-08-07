-- PD-001 (Fusível F1 Aberto)
UPDATE cases 
SET content = jsonb_set(
  jsonb_set(
    content,
    '{hints}',
    '[
      {"id": "h1", "text": "Verifique se há tensão na entrada do circuito de comando.", "xpPenalty": 50, "level": 1},
      {"id": "h2", "text": "O fusível F1 protege a fase que alimenta os botões. Teste a continuidade dele.", "xpPenalty": 150, "level": 2},
      {"id": "h3", "text": "O fusível F1 está aberto (queimado). Substitua-o para restaurar o comando.", "xpPenalty": 300, "level": 3}
    ]'::jsonb
  ),
  '{decisionTree}',
  (
    SELECT jsonb_agg(
      CASE 
        WHEN node->>'id' = 'conclusion' THEN 
          jsonb_set(node, '{lesson}', '{
            "technicalSummary": "O motor não partia devido à abertura do fusível de proteção do circuito de comando (F1).",
            "failureExplanation": "O fusível F1 sofreu uma sobrecarga momentânea ou fadiga, interrompendo a passagem de corrente apenas para a lógica de comando, enquanto a força permanecia íntegra.",
            "circuitTheory": "Em comandos elétricos, o circuito de comando é frequentemente alimentado por uma fase protegida individualmente. Se este fusível abre, os contatores não recebem sinal para fechar, impedindo a partida mesmo que haja energia na rede trifásica.",
            "fundamentalBasis": "Lei de Ohm e Proteção de Circuitos: Fusíveis são elos propositalmente mais fracos projetados para abrir o circuito em caso de anomalia.",
            "bestPractices": "Sempre investigue a causa da queima de um fusível antes de substituí-lo para evitar danos maiores.",
            "safetyWarnings": "Verifique a ausência de tensão antes de manusear fusíveis em bases abertas."
          }'::jsonb)
        ELSE node
      END
    )
    FROM jsonb_array_elements(content->'decisionTree') AS node
  )
)
WHERE code = 'PD-001';

-- PD-002 (Relé Térmico F2 Atuado)
UPDATE cases 
SET content = jsonb_set(
  jsonb_set(
    content,
    '{hints}',
    '[
      {"id": "h1", "text": "O motor parou por uma proteção. Verifique o estado dos dispositivos de sobrecarga.", "xpPenalty": 50, "level": 1},
      {"id": "h2", "text": "O contato 95-96 do relé térmico F2 deve estar fechado para o comando funcionar.", "xpPenalty": 150, "level": 2},
      {"id": "h3", "text": "O relé térmico F2 desarmou. Verifique a corrente do motor e faça o reset se estiver seguro.", "xpPenalty": 300, "level": 3}
    ]'::jsonb
  ),
  '{decisionTree}',
  (
    SELECT jsonb_agg(
      CASE 
        WHEN node->>'id' = 'conclusion' THEN 
          jsonb_set(node, '{lesson}', '{
            "technicalSummary": "A interrupção foi causada pela atuação do relé térmico F2, que protege contra sobrecorrente.",
            "failureExplanation": "O motor operou acima da corrente nominal por um período prolongado, aquecendo o bimetal do relé F2 e abrindo o contato de segurança 95-96.",
            "circuitTheory": "O relé térmico monitora o calor gerado pela corrente. Ele não abre o circuito de força diretamente, mas sim um contato auxiliar que desenergiza a bobina do contator (K1).",
            "fundamentalBasis": "Efeito Joule: A corrente elétrica gera calor ao passar por um condutor, princípio usado para detectar sobrecargas.",
            "bestPractices": "Nunca aumente o ajuste de corrente do relé térmico sem antes verificar as condições mecânicas da carga.",
            "safetyWarnings": "Motores superaquecidos podem causar queimaduras graves; aguarde o resfriamento."
          }'::jsonb)
        ELSE node
      END
    )
    FROM jsonb_array_elements(content->'decisionTree') AS node
  )
)
WHERE code = 'PD-002';
