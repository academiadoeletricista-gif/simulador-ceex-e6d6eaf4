-- Update cases with specific steps in their content JSONB
UPDATE public.cases
SET content = jsonb_set(
    COALESCE(content, '{}'::jsonb),
    '{decisionTree}',
    (
      CASE 
        -- PD-001: Fusível de Comando F1 Queimado
        WHEN code = 'PD-001' THEN '[
          {
            "id": "start",
            "label": "Início do Diagnóstico",
            "situation": "Painel não liga. O operador informa que a máquina parou repentinamente.",
            "steps": [
              {
                "situation": "Verificar alimentação do circuito de comando",
                "reading": "0V no comando",
                "correct": "Medir a continuidade dos fusíveis de proteção (F1/F2)",
                "wrong": [["Substituir o motor", "Gasto desnecessário e erro de diagnóstico"], ["Trocar o contator", "O contator não tem alimentação, o problema é antes"]]
              },
              {
                "situation": "Isolamento da falha no fusível",
                "reading": "Aberta",
                "correct": "Substituir o fusível F1 e verificar se há curto-circuito antes de religar",
                "wrong": [["Fazer um Jumper no fusível", "Risco grave de incêndio e danos permanentes ao painel"]]
              }
            ],
            "options": [
              { "label": "Realizar Inspeção Visual", "nextNodeId": "visual_insp", "xpReward": 10 },
              { "label": "Medir Saída dos Fusíveis", "nextNodeId": "measure_fuses", "xpReward": 30 }
            ]
          },
          { "id": "visual_insp", "label": "Inspeção", "situation": "Fusíveis parecem normais externamente.", "options": [{ "label": "Medir Fusíveis", "nextNodeId": "measure_fuses", "xpReward": 10 }] },
          { "id": "measure_fuses", "label": "Medição", "situation": "Saída de F1 indica 0V.", "options": [{ "label": "Reparar F1", "nextNodeId": "repair", "xpReward": 50 }] },
          { "id": "repair", "label": "Reparo", "situation": "Fusível trocado. Sistema pronto.", "isCompletion": true, "options": [{ "label": "Finalizar", "nextNodeId": "end", "xpReward": 100 }] }
        ]'::jsonb

        -- PD-002: Bobina do Contator K1 Aberta
        WHEN code = 'PD-002' THEN '[
          {
            "id": "start",
            "label": "Início",
            "situation": "O motor não parte, mas os LEDs de sinalização de energia estão acesos.",
            "steps": [
              {
                "situation": "Verificar acionamento do contator K1",
                "reading": "Sem clique mecânico",
                "correct": "Medir a tensão nos terminais A1 e A2 da bobina do contator K1",
                "wrong": [["Trocar disjuntor de força", "A sinalização indica que a força está chegando, o problema é no comando"]]
              },
              {
                "situation": "Confirmar integridade da bobina",
                "reading": "Resistência Infinita (OL)",
                "correct": "Substituir o contator K1 por um de mesma especificação de bobina",
                "wrong": [["Limpar contatos", "Limpeza de contatos não resolve bobina rompida"]]
              }
            ],
            "options": [
              { "label": "Tentar Ligar e Observar K1", "nextNodeId": "try_start", "xpReward": 15 },
              { "label": "Medir Bobina K1", "nextNodeId": "measure_coil", "xpReward": 30 }
            ]
          },
          { "id": "try_start", "label": "Teste", "situation": "Ao apertar o botão, K1 não atraca.", "options": [{ "label": "Medir Tensão em K1 (A1/A2)", "nextNodeId": "measure_coil", "xpReward": 20 }] },
          { "id": "measure_coil", "label": "Medição", "situation": "Há 220V em A1/A2, mas o contator não fecha.", "options": [{ "label": "Substituir K1", "nextNodeId": "repair", "xpReward": 50 }] },
          { "id": "repair", "label": "Reparo", "situation": "K1 substituído. O motor voltou a operar.", "isCompletion": true, "options": [{ "label": "Finalizar", "nextNodeId": "end", "xpReward": 100 }] }
        ]'::jsonb

        -- PD-006 (Lab 02): Relé Térmico Disparado (F2)
        WHEN code = 'PD-006' THEN '[
          {
            "id": "start",
            "label": "Início",
            "situation": "Operador relata que a máquina parou após um longo período de uso pesado.",
            "steps": [
              {
                "situation": "Identificar causa da parada de emergência/proteção",
                "reading": "LED de Falha Térmica Aceso",
                "correct": "Verificar o estado dos contatos 95/96 do Relé Térmico",
                "wrong": [["Resetar o relé imediatamente", "Risco de queimar o motor se a sobrecarga persistir sem investigação"]]
              },
              {
                "situation": "Verificar corrente nominal do motor",
                "reading": "Ajuste em 10A (Motor é 12A)",
                "correct": "Ajustar o relé térmico de acordo com a placa do motor e resetar",
                "wrong": [["Desativar o relé térmico", "Deixa o motor sem proteção contra queima"]]
              }
            ],
            "options": [
              { "label": "Verificar Relé Térmico", "nextNodeId": "check_thermal", "xpReward": 20 },
              { "label": "Medir Corrente do Motor", "nextNodeId": "measure_current", "xpReward": 30 }
            ]
          },
          { "id": "check_thermal", "label": "Inspeção", "situation": "Relé térmico está com o pino de reset saltado.", "options": [{ "label": "Resetar e Ajustar", "nextNodeId": "repair", "xpReward": 40 }] },
          { "id": "repair", "label": "Reparo", "situation": "Proteção resetada e ajustada. Operação normalizada.", "isCompletion": true, "options": [{ "label": "Finalizar", "nextNodeId": "end", "xpReward": 100 }] }
        ]'::jsonb

        -- Default fallback for other PD cases (Lab 01, 04, 05, 06, 07)
        ELSE '[
          {
            "id": "start",
            "label": "Início do Diagnóstico",
            "situation": "O equipamento apresenta comportamento anômalo. Inicie o protocolo de investigação.",
            "steps": [
              {
                "situation": "Avaliação inicial de segurança",
                "reading": "Painel Energizado",
                "correct": "Realizar inspeção visual em busca de cabos soltos ou sinais de aquecimento",
                "wrong": [["Tocar nos barramentos", "Risco de choque elétrico fatal"]]
              },
              {
                "situation": "Confirmação de tensão de comando",
                "reading": "220V Ok",
                "correct": "Seguir o diagrama elétrico para testar a continuidade do selo ou botoeiras",
                "wrong": [["Trocar peças aleatoriamente", "Método ineficiente e caro"]]
              }
            ],
            "options": [
              { "label": "Iniciar Inspeção Visual", "nextNodeId": "visual_insp", "xpReward": 10 },
              { "label": "Medir Tensões de Entrada", "nextNodeId": "measure_input", "xpReward": 20 }
            ]
          },
          { "id": "visual_insp", "label": "Inspeção", "situation": "Nenhuma anomalia visual óbvia.", "options": [{ "label": "Prosseguir Medição", "nextNodeId": "measure_input", "xpReward": 10 }] },
          { "id": "measure_input", "label": "Medição", "situation": "Tensões nominais confirmadas.", "isCompletion": true, "options": [{ "label": "Concluir", "nextNodeId": "end", "xpReward": 50 }] }
        ]'::jsonb
      END
    )
)
WHERE laboratory_id != 'e9e06df1-adba-483c-b9fc-cc1f6e212d3c'::uuid
AND (code LIKE 'PD-%' OR code LIKE 'REV-%');
