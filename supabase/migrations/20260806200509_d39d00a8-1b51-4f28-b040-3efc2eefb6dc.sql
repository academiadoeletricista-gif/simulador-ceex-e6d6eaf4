
-- SPRINT 2B — PARTE 2: ESPECIFICAÇÃO COMPLETA DOS LABORATÓRIOS E DEFEITOS

-- 1. Batch 1 (LAB-01, LAB-02)
INSERT INTO public.cases (laboratory_id, code, title, description, level, xp_reward, published, slug, category, time_estimate)
VALUES ('f0b5705a-fac8-4f7c-bf17-fbd1b059c1e6', 'PD-006', 'Fusível do comando aberto', 'O circuito não responde ao comando.', 'Iniciante', 300, true, 'pd-006', 'Diagnóstico', '10 min'),
('f0b5705a-fac8-4f7c-bf17-fbd1b059c1e6', 'PD-007', 'Contato auxiliar de selo aberto', 'O contator não mantém o estado ao soltar START.', 'Iniciante', 300, true, 'pd-007', 'Diagnóstico', '10 min'),
('f0b5705a-fac8-4f7c-bf17-fbd1b059c1e6', 'PD-008', 'Bobina do contator interrompida', 'Contator não fecha fisicamente.', 'Intermediário', 300, true, 'pd-008', 'Diagnóstico', '15 min'),
('f0b5705a-fac8-4f7c-bf17-fbd1b059c1e6', 'PD-009', 'Falta de tensão no comando', 'O sistema todo está desenergizado.', 'Iniciante', 300, true, 'pd-009', 'Diagnóstico', '10 min'),
('f0b5705a-fac8-4f7c-bf17-fbd1b059c1e6', 'PD-010', 'Botão STOP aberto', 'O circuito de segurança interrompido.', 'Iniciante', 300, true, 'pd-010', 'Diagnóstico', '10 min'),
('11363b3f-e376-4a1e-80a7-662bda79f558', 'RV-006', 'Contato auxiliar invertido', 'Logica de reversão invertida.', 'Avançado', 400, true, 'rv-006', 'Diagnóstico', '15 min'),
('11363b3f-e376-4a1e-80a7-662bda79f558', 'RV-007', 'Motor desarma durante reversão', 'Pico de corrente no sentido inverso.', 'Intermediário', 400, true, 'rv-007', 'Diagnóstico', '15 min'),
('11363b3f-e376-4a1e-80a7-662bda79f558', 'RV-008', 'Sequência de fases invertida', 'Inversão física das fases.', 'Intermediário', 400, true, 'rv-008', 'Diagnóstico', '15 min'),
('11363b3f-e376-4a1e-80a7-662bda79f558', 'RV-009', 'Bobina contator reverso aberta', 'O contator de reversão não atraca.', 'Intermediário', 400, true, 'rv-009', 'Diagnóstico', '12 min'),
('11363b3f-e376-4a1e-80a7-662bda79f558', 'RV-010', 'Botão REV defeituoso', 'Contato elétrico corrompido.', 'Iniciante', 400, true, 'rv-010', 'Diagnóstico', '10 min'),
('11363b3f-e376-4a1e-80a7-662bda79f558', 'RV-011', 'Contato NF intertravamento aberto', 'Proteção contra energização simultânea aberta.', 'Avançado', 400, true, 'rv-011', 'Diagnóstico', '15 min'),
('11363b3f-e376-4a1e-80a7-662bda79f558', 'RV-012', 'Erro de ligação aux', 'Ligação incorreta no contator.', 'Avançado', 400, true, 'rv-012', 'Diagnóstico', '15 min');

-- 2. Batch 2 (LAB-03, LAB-04)
INSERT INTO public.cases (laboratory_id, code, title, description, level, xp_reward, published, slug, category, time_estimate)
VALUES ('e9e06df1-adba-483c-b9fc-cc1f6e212d3c', 'ET-006', 'Contator estrela não energiza', 'Falha na fase inicial de partida.', 'Intermediário', 600, true, 'et-006', 'Diagnóstico', '20 min'),
('e9e06df1-adba-483c-b9fc-cc1f6e212d3c', 'ET-007', 'Contator triângulo não energiza', 'Falha na fase final de comutação.', 'Intermediário', 600, true, 'et-007', 'Diagnóstico', '20 min'),
('e9e06df1-adba-483c-b9fc-cc1f6e212d3c', 'ET-008', 'Contato auxiliar temporizador defeituoso', 'Falha na sinalização da mudança.', 'Avançado', 600, true, 'et-008', 'Diagnóstico', '20 min'),
('e9e06df1-adba-483c-b9fc-cc1f6e212d3c', 'ET-009', 'Temporizador parametrizado errado', 'Tempo insuficiente para partida.', 'Iniciante', 600, true, 'et-009', 'Diagnóstico', '15 min'),
('e9e06df1-adba-483c-b9fc-cc1f6e212d3c', 'ET-010', 'Intertravamento inexistente', 'Configuração perigosa de comando.', 'Especialista', 600, true, 'et-010', 'Diagnóstico', '25 min'),
('e9e06df1-adba-483c-b9fc-cc1f6e212d3c', 'ET-011', 'Contato principal carbonizado', 'Alta resistência de contato.', 'Avançado', 600, true, 'et-011', 'Diagnóstico', '20 min'),
('e9e06df1-adba-483c-b9fc-cc1f6e212d3c', 'ET-012', 'Sequência incorreta de acionamento', 'Erro na lógica do comando.', 'Avançado', 600, true, 'et-012', 'Diagnóstico', '20 min'),
('3c7c711f-b43f-4290-8fb3-230b6229c134', 'CP-006', 'Temporizador não atua', 'Fica preso no autotransformador.', 'Intermediário', 900, true, 'cp-006', 'Diagnóstico', '20 min'),
('3c7c711f-b43f-4290-8fb3-230b6229c134', 'CP-007', 'Contator de linha não energiza', 'Falta de potência na entrada.', 'Intermediário', 900, true, 'cp-007', 'Diagnóstico', '20 min'),
('3c7c711f-b43f-4290-8fb3-230b6229c134', 'CP-008', 'Contator de compensação não desliga', 'Autotransformador nunca sai.', 'Especialista', 900, true, 'cp-008', 'Diagnóstico', '30 min'),
('3c7c711f-b43f-4290-8fb3-230b6229c134', 'CP-009', 'Contato auxiliar defeituoso', 'Falha na lógica de segurança.', 'Avançado', 900, true, 'cp-009', 'Diagnóstico', '25 min'),
('3c7c711f-b43f-4290-8fb3-230b6229c134', 'CP-010', 'Falta de alimentação no comando', 'Circuito morto.', 'Iniciante', 900, true, 'cp-010', 'Diagnóstico', '15 min');

-- 3. Batch 3 (LAB-05, LAB-06, LAB-07)
INSERT INTO public.cases (laboratory_id, code, title, description, level, xp_reward, published, slug, category, time_estimate)
VALUES ('d5fce63c-67dc-4fcd-8f9e-0e869895ca58', 'RB-006', 'Resistência interrompida', 'Motor desequilibrado durante partida.', 'Especialista', 1000, true, 'rb-006', 'Diagnóstico', '25 min'),
('d5fce63c-67dc-4fcd-8f9e-0e869895ca58', 'RB-007', 'Curto nas resistências rotóricas', 'Picos de corrente excessivos.', 'Especialista', 1000, true, 'rb-007', 'Diagnóstico', '30 min'),
('d5fce63c-67dc-4fcd-8f9e-0e869895ca58', 'RB-008', 'Escovas desgastadas', 'Perda de torque no motor.', 'Intermediário', 1000, true, 'rb-008', 'Diagnóstico', '20 min'),
('d5fce63c-67dc-4fcd-8f9e-0e869895ca58', 'RB-009', 'Anéis coletores mau contato', 'Faiscamento excessivo e ruído.', 'Avançado', 1000, true, 'rb-009', 'Diagnóstico', '25 min'),
('d5fce63c-67dc-4fcd-8f9e-0e869895ca58', 'RB-010', 'Sequência de retirada de resistências incorreta', 'Erro na lógica de aceleração.', 'Avançado', 1000, true, 'rb-010', 'Diagnóstico', '25 min'),
('6b370011-1e68-4464-ac40-0f8c6856f642', 'DH-006', 'Erro na ligação Dahlander', 'Motor não responde às trocas de polos.', 'Especialista', 1300, true, 'dh-006', 'Diagnóstico', '30 min'),
('6b370011-1e68-4464-ac40-0f8c6856f642', 'DH-007', 'Contato auxiliar defeituoso', 'Falha na comutação das velocidades.', 'Avançado', 1300, true, 'dh-007', 'Diagnóstico', '25 min'),
('6b370011-1e68-4464-ac40-0f8c6856f642', 'DH-008', 'Bobina do contator de velocidade aberta', 'Falha física na troca de polos.', 'Avançado', 1300, true, 'dh-008', 'Diagnóstico', '25 min'),
('287664b8-1d6e-4999-b032-7e71e9635172', 'FM-006', 'Retificador do freio defeituoso', 'Freio não libera ou não trava.', 'Avançado', 1100, true, 'fm-006', 'Diagnóstico', '25 min'),
('287664b8-1d6e-4999-b032-7e71e9635172', 'FM-007', 'Disco de freio desgastado', 'Eficiência reduzida de frenagem.', 'Intermediário', 1100, true, 'fm-007', 'Diagnóstico', '20 min'),
('287664b8-1d6e-4999-b032-7e71e9635172', 'FM-008', 'Mola do freio quebrada', 'Freio trava permanentemente.', 'Especialista', 1100, true, 'fm-008', 'Diagnóstico', '30 min'),
('287664b8-1d6e-4999-b032-7e71e9635172', 'FM-009', 'Alimentação do freio ausente', 'Sistema sem frenagem funcional.', 'Iniciante', 1100, true, 'fm-009', 'Diagnóstico', '15 min'),
('287664b8-1d6e-4999-b032-7e71e9635172', 'FM-010', 'Ligação incorreta da bobina do freio', 'Freio não opera conforme projeto.', 'Avançado', 1100, true, 'fm-010', 'Diagnóstico', '25 min');
