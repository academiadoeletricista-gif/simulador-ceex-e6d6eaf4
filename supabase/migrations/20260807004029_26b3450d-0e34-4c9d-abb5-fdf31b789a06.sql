UPDATE public.cases
SET content = '{
  "workOrder": {
    "customer": "Planta Industrial Alpha",
    "machine": "Motor de Esteira 01",
    "symptoms": "O motor não parte ao pressionar o botão de ligar. Não há sinal de fumaça ou cheiro de queimado."
  },
  "decisionTree": [
    {
      "id": "start",
      "label": "Início do Diagnóstico",
      "situation": "Você está diante do painel de comando. O motor está parado. Por onde deseja começar?",
      "options": [
        { "label": "Realizar Inspeção Visual no Painel", "nextNodeId": "visual_insp", "xpReward": 10 },
        { "label": "Medir Tensão na Entrada do Disjuntor Geral", "nextNodeId": "measure_input", "xpReward": 20 },
        { "label": "Tentar ligar o motor e observar o contator", "nextNodeId": "try_start", "xpReward": 15 }
      ]
    },
    {
      "id": "visual_insp",
      "label": "Inspeção Visual",
      "situation": "Ao abrir o painel, você observa os componentes. Tudo parece fisicamente íntegro, exceto pelo LED de falha que está apagado.",
      "options": [
        { "label": "Medir Tensão na Entrada", "nextNodeId": "measure_input", "xpReward": 10 },
        { "label": "Verificar se o Disjuntor Geral está armado", "nextNodeId": "check_breaker", "xpReward": 15 }
      ]
    },
    {
      "id": "measure_input",
      "label": "Medição de Tensão",
      "situation": "Você utiliza o multímetro na escala de Tensão Alternada. A leitura indica 380V entre as fases.",
      "options": [
        { "label": "Medir Tensão na Saída dos Fusíveis", "nextNodeId": "measure_fuses", "xpReward": 20 },
        { "label": "Verificar Comando", "nextNodeId": "check_control", "xpReward": 10 }
      ]
    },
    {
      "id": "measure_fuses",
      "label": "Medição nos Fusíveis",
      "situation": "A leitura na saída do Fusível F1 indica 0V, enquanto F2 e F3 indicam 380V.",
      "options": [
        { "label": "Substituir Fusível F1", "nextNodeId": "repair_fuse", "xpReward": 50, "consequence": "Cuidado ao manusear componentes energizados!" }
      ]
    },
    {
      "id": "repair_fuse",
      "label": "Reparo",
      "situation": "Você substituiu o fusível F1 por um novo de mesma especificação. O motor agora pode ser testado.",
      "isCompletion": true,
      "options": [
        { "label": "Finalizar Diagnóstico", "nextNodeId": "complete", "xpReward": 100 }
      ]
    }
  ],
  "possibleFaults": [
    { "id": "fuse_failure", "label": "Fusível F1 Queimado" },
    { "id": "coil_failure", "label": "Bobina do Contator Aberta" }
  ],
  "evidenceData": [
    { "id": "e1", "type": "electrical", "label": "Tensão Entrada", "value": "380V", "impacts": { "fuse_failure": -10 } },
    { "id": "e2", "type": "electrical", "label": "Saída F1", "value": "0V", "impacts": { "fuse_failure": 80 } }
  ],
  "availableTools": ["Multímetro", "Inspeção Visual", "Diagrama Elétrico"]
}'::jsonb
WHERE content IS NULL OR content = '{}'::jsonb OR content->>'decisionTree' IS NULL;