
-- 1. Limpar estados inconsistentes
DELETE FROM public.case_hypotheses WHERE case_id IN (SELECT id FROM public.cases WHERE code LIKE 'PD-%');
DELETE FROM public.diagnostic_cases WHERE code LIKE 'PD-%';
DELETE FROM public.cases WHERE code LIKE 'PD-%';

-- 2. Recriar PD-001 a PD-010 em ambas as tabelas (cases e diagnostic_cases) para garantir integridade referencial
-- PD-001
INSERT INTO public.cases (id, laboratory_id, code, slug, title, category, description, level, published, xp_reward, time_estimate, content)
VALUES ('cc04eaf2-d8cb-421a-84ce-bac3d60cdd60', 'f0b5705a-fac8-4f7c-bf17-fbd1b059c1e6', 'PD-001', 'pd-001', 'Fusível F1 Queimado', 'Partida Direta', 'Comando inativo.', 'Iniciante', true, 300, '10 min', '{"evidenceData": [{"label": "F1_in-F1_out", "value": "0V", "type": "measurement"}]}');
INSERT INTO public.diagnostic_cases (id, laboratory_id, code, title, description, category, level, xp_reward, time_estimate, status)
VALUES ('cc04eaf2-d8cb-421a-84ce-bac3d60cdd60', 'f0b5705a-fac8-4f7c-bf17-fbd1b059c1e6', 'PD-001', 'Fusível F1 Queimado', 'Comando inativo.', 'Partida Direta', 'Iniciante', 300, '10 min', 'published');
INSERT INTO public.case_hypotheses (case_id, title, description, root_cause, is_correct, validation_logic)
VALUES ('cc04eaf2-d8cb-421a-84ce-bac3d60cdd60', 'Fusível F1 Aberto', 'Causa raiz do problema de comando.', true, true, '{"requiredMeasurement": "F1_in-F1_out", "expectedResult": "0V"}');

-- PD-002
INSERT INTO public.cases (id, laboratory_id, code, slug, title, category, description, level, published, xp_reward, time_estimate, content)
VALUES ('7965f655-dcdf-418a-b17f-34e3ee40e7a1', 'f0b5705a-fac8-4f7c-bf17-fbd1b059c1e6', 'PD-002', 'pd-002', 'Bobina K1 Queimada', 'Partida Direta', 'K1 não atraca.', 'Iniciante', true, 300, '12 min', '{"evidenceData": [{"label": "A1-A2", "value": "OL", "type": "measurement"}]}');
INSERT INTO public.diagnostic_cases (id, laboratory_id, code, title, description, category, level, xp_reward, time_estimate, status)
VALUES ('7965f655-dcdf-418a-b17f-34e3ee40e7a1', 'f0b5705a-fac8-4f7c-bf17-fbd1b059c1e6', 'PD-002', 'Bobina K1 Queimada', 'K1 não atraca.', 'Partida Direta', 'Iniciante', 300, '12 min', 'published');
INSERT INTO public.case_hypotheses (case_id, title, description, root_cause, is_correct, validation_logic)
VALUES ('7965f655-dcdf-418a-b17f-34e3ee40e7a1', 'Bobina K1 Aberta', 'Bobina não gera campo magnético.', true, true, '{"requiredMeasurement": "A1-A2", "expectedResult": "OL"}');

-- PD-003
INSERT INTO public.cases (id, laboratory_id, code, slug, title, category, description, level, published, xp_reward, time_estimate, content)
VALUES ('72aa7d94-e1ad-477d-ae78-d4636edf4bfc', 'f0b5705a-fac8-4f7c-bf17-fbd1b059c1e6', 'PD-003', 'pd-003', 'Relé Térmico Atuado', 'Partida Direta', 'F2 desarmado.', 'Iniciante', true, 350, '10 min', '{"evidenceData": [{"label": "95-96", "value": "Aberto", "type": "measurement"}]}');
INSERT INTO public.diagnostic_cases (id, laboratory_id, code, title, description, category, level, xp_reward, time_estimate, status)
VALUES ('72aa7d94-e1ad-477d-ae78-d4636edf4bfc', 'f0b5705a-fac8-4f7c-bf17-fbd1b059c1e6', 'PD-003', 'Relé Térmico Atuado', 'F2 desarmado.', 'Partida Direta', 'Iniciante', 350, '10 min', 'published');
INSERT INTO public.case_hypotheses (case_id, title, description, root_cause, is_correct, validation_logic)
VALUES ('72aa7d94-e1ad-477d-ae78-d4636edf4bfc', 'F2 Atuado', 'Proteção térmica interrompeu o comando.', true, true, '{"requiredMeasurement": "95-96", "expectedResult": "Aberto"}');

-- PD-004
INSERT INTO public.cases (id, laboratory_id, code, slug, title, category, description, level, published, xp_reward, time_estimate, content)
VALUES ('93a8aa91-0b59-43d6-bbfa-1c97b77e6cbf', 'f0b5705a-fac8-4f7c-bf17-fbd1b059c1e6', 'PD-004', 'pd-004', 'Falha Contato Selo', 'Partida Direta', 'Motor não retém.', 'Intermediário', true, 400, '15 min', '{"evidenceData": [{"label": "13-14", "value": "Aberto (com START)", "type": "measurement"}]}');
INSERT INTO public.diagnostic_cases (id, laboratory_id, code, title, description, category, level, xp_reward, time_estimate, status)
VALUES ('93a8aa91-0b59-43d6-bbfa-1c97b77e6cbf', 'f0b5705a-fac8-4f7c-bf17-fbd1b059c1e6', 'PD-004', 'Falha Contato Selo', 'Motor não retém.', 'Partida Direta', 'Intermediário', 400, '15 min', 'published');
INSERT INTO public.case_hypotheses (case_id, title, description, root_cause, is_correct, validation_logic)
VALUES ('93a8aa91-0b59-43d6-bbfa-1c97b77e6cbf', 'Selo K1 Aberto', 'Contato auxiliar 13-14 falhou.', true, true, '{"requiredMeasurement": "13-14", "expectedResult": "Aberto (com START)"}');

-- PD-005
INSERT INTO public.cases (id, laboratory_id, code, slug, title, category, description, level, published, xp_reward, time_estimate, content)
VALUES ('a0052775-b4ea-49bc-aecf-f69b6388fa68', 'f0b5705a-fac8-4f7c-bf17-fbd1b059c1e6', 'PD-005', 'pd-005', 'Emergência Acionada', 'Partida Direta', 'S0 bloqueando.', 'Iniciante', true, 300, '5 min', '{"evidenceData": [{"label": "1-2 (S0)", "value": "Aberto", "type": "measurement"}]}');
INSERT INTO public.diagnostic_cases (id, laboratory_id, code, title, description, category, level, xp_reward, time_estimate, status)
VALUES ('a0052775-b4ea-49bc-aecf-f69b6388fa68', 'f0b5705a-fac8-4f7c-bf17-fbd1b059c1e6', 'PD-005', 'Emergência Acionada', 'S0 bloqueando.', 'Partida Direta', 'Iniciante', 300, '5 min', 'published');
INSERT INTO public.case_hypotheses (case_id, title, description, root_cause, is_correct, validation_logic)
VALUES ('a0052775-b4ea-49bc-aecf-f69b6388fa68', 'S0 Retido', 'Botão de emergência deve ser resetado.', true, true, '{"requiredMeasurement": "1-2 (S0)", "expectedResult": "Aberto"}');

-- PD-006 a PD-010 (Mínimo para consistência)
INSERT INTO public.cases (id, laboratory_id, code, slug, title, category, description, level, published, xp_reward, time_estimate, content)
VALUES 
('bdeddd76-4317-4957-8ff3-a811fd4e2616', 'f0b5705a-fac8-4f7c-bf17-fbd1b059c1e6', 'PD-006', 'pd-006', 'Disjuntor Motor Atuado', 'Partida Direta', 'Q1 aberto.', 'Iniciante', true, 300, '8 min', '{"evidenceData": [{"label": "Q1_out", "value": "0V", "type": "measurement"}]}'),
('e3d486d3-c4b6-4260-94be-44d6a3a69143', 'f0b5705a-fac8-4f7c-bf17-fbd1b059c1e6', 'PD-007', 'pd-007', 'Falta de Fase Entrada', 'Partida Direta', 'L3 ausente.', 'Intermediário', true, 450, '15 min', '{"evidenceData": [{"label": "L3-N", "value": "0V", "type": "measurement"}]}'),
('723e90b5-cca7-4958-8517-04400a83183a', 'f0b5705a-fac8-4f7c-bf17-fbd1b059c1e6', 'PD-008', 'pd-008', 'Falha de Isolação Motor', 'Partida Direta', 'Curto para terra.', 'Avançado', true, 600, '20 min', '{"evidenceData": [{"label": "Bobina-Terra", "value": "0.1 MΩ", "type": "measurement"}]}'),
('c13a3632-3ed1-41b5-bf45-0258d84cfdbc', 'f0b5705a-fac8-4f7c-bf17-fbd1b059c1e6', 'PD-009', 'pd-009', 'Botão STOP Travado', 'Partida Direta', 'S1 aberto.', 'Iniciante', true, 300, '5 min', '{"evidenceData": [{"label": "1-2 (S1)", "value": "Aberto", "type": "measurement"}]}'),
('418495d3-7c6c-45b6-87eb-fc1c502c3259', 'f0b5705a-fac8-4f7c-bf17-fbd1b059c1e6', 'PD-010', 'pd-010', 'Botão START com Defeito', 'Partida Direta', 'S2 não fecha.', 'Iniciante', true, 300, '10 min', '{"evidenceData": [{"label": "3-4 (S2)", "value": "Não Conduz", "type": "measurement"}]}');

INSERT INTO public.diagnostic_cases (id, laboratory_id, code, title, description, category, level, xp_reward, time_estimate, status)
VALUES 
('bdeddd76-4317-4957-8ff3-a811fd4e2616', 'f0b5705a-fac8-4f7c-bf17-fbd1b059c1e6', 'PD-006', 'Disjuntor Motor Atuado', 'Q1 aberto.', 'Partida Direta', 'Iniciante', 300, '8 min', 'published'),
('e3d486d3-c4b6-4260-94be-44d6a3a69143', 'f0b5705a-fac8-4f7c-bf17-fbd1b059c1e6', 'PD-007', 'Falta de Fase Entrada', 'L3 ausente.', 'Partida Direta', 'Intermediário', 450, '15 min', 'published'),
('723e90b5-cca7-4958-8517-04400a83183a', 'f0b5705a-fac8-4f7c-bf17-fbd1b059c1e6', 'PD-008', 'Falha de Isolação Motor', 'Curto para terra.', 'Partida Direta', 'Avançado', 600, '20 min', 'published'),
('c13a3632-3ed1-41b5-bf45-0258d84cfdbc', 'f0b5705a-fac8-4f7c-bf17-fbd1b059c1e6', 'PD-009', 'Botão STOP Travado', 'S1 aberto.', 'Partida Direta', 'Iniciante', 300, '5 min', 'published'),
('418495d3-7c6c-45b6-87eb-fc1c502c3259', 'f0b5705a-fac8-4f7c-bf17-fbd1b059c1e6', 'PD-010', 'Botão START com Defeito', 'S2 não fecha.', 'Partida Direta', 'Iniciante', 300, '10 min', 'published');

INSERT INTO public.case_hypotheses (case_id, title, description, root_cause, is_correct, validation_logic)
VALUES 
('bdeddd76-4317-4957-8ff3-a811fd4e2616', 'Q1 Aberto', 'Disjuntor motor precisa ser religado.', true, true, '{"requiredMeasurement": "Q1_out", "expectedResult": "0V"}'),
('e3d486d3-c4b6-4260-94be-44d6a3a69143', 'Fase L3 Ausente', 'Falta de alimentação na entrada.', true, true, '{"requiredMeasurement": "L3-N", "expectedResult": "0V"}'),
('723e90b5-cca7-4958-8517-04400a83183a', 'Curto-Circuito Motor', 'Falha crítica de isolamento.', true, true, '{"requiredMeasurement": "Bobina-Terra", "expectedResult": "0.1 MΩ"}'),
('c13a3632-3ed1-41b5-bf45-0258d84cfdbc', 'S1 Bloqueado', 'Botão STOP com defeito mecânico.', true, true, '{"requiredMeasurement": "1-2 (S1)", "expectedResult": "Aberto"}'),
('418495d3-7c6c-45b6-87eb-fc1c502c3259', 'S2 Aberto', 'Botão START não fecha o circuito.', true, true, '{"requiredMeasurement": "3-4 (S2)", "expectedResult": "Não Conduz"}');
