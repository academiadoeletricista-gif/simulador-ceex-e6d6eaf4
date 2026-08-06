
-- Create laboratories table
CREATE TABLE public.laboratories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    learning_objectives TEXT[] DEFAULT '{}',
    prerequisites TEXT[] DEFAULT '{}',
    level TEXT NOT NULL,
    estimated_time TEXT,
    total_xp INTEGER DEFAULT 0,
    base_circuit_data JSONB DEFAULT '{}',
    panel_data JSONB DEFAULT '{}',
    components JSONB DEFAULT '[]',
    measurements JSONB DEFAULT '[]',
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Update cases table to link to laboratories
ALTER TABLE public.cases ADD COLUMN IF NOT EXISTS laboratory_id UUID REFERENCES public.laboratories(id);
ALTER TABLE public.cases ADD COLUMN IF NOT EXISTS code TEXT;

-- Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.laboratories TO authenticated;
GRANT ALL ON public.laboratories TO service_role;
GRANT SELECT ON public.laboratories TO anon;

-- RLS
ALTER TABLE public.laboratories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to laboratories"
ON public.laboratories FOR SELECT
TO anon, authenticated
USING (published = true);

-- Seed initial Laboratories
INSERT INTO public.laboratories (code, name, description, level, estimated_time, total_xp, learning_objectives)
VALUES 
('LAB-01', 'Partida Direta', 'Acionamento básico de motores trifásicos com proteção térmica.', 'Iniciante', '45 min', 1500, ARRAY['Compreender comando selo', 'Identificar proteção térmica', 'Analisar diagrama de potência']),
('LAB-02', 'Chave de Reversão', 'Controle de sentido de giro com intertravamento elétrico e mecânico.', 'Intermediário', '60 min', 2000, ARRAY['Implementar intertravamento', 'Reversão de fases', 'Segurança operacional']),
('LAB-03', 'Partida Estrela-Triângulo', 'Redução de corrente de partida via comutação de fechamento.', 'Intermediário', '90 min', 3000, ARRAY['Dimensionamento de contatores', 'Temporização de transição', 'Fechamento de motor']),
('LAB-04', 'Chave Compensadora', 'Partida com tensão reduzida através de autotransformador.', 'Avançado', '120 min', 4500, ARRAY['Ajuste de tapes', 'Comutação aberta/fechada', 'Análise de torque']),
('LAB-05', 'Motor de Rotor Bobinado', 'Controle de partida e torque via resistências rotóricas.', 'Avançado', '120 min', 5000, ARRAY['Inserção de resistências', 'Análise de escorregamento', 'Manutenção de anéis coletores']),
('LAB-06', 'Motor Dahlander', 'Motor de duas velocidades com enrolamento único.', 'Especialista', '150 min', 6500, ARRAY['Comutação de polos', 'Configuração triângulo/dupla-estrela', 'Controle de torque/velocidade']),
('LAB-07', 'Motor com Freio Magnético', 'Sistemas de frenagem eletromagnética para paradas rápidas.', 'Especialista', '120 min', 5500, ARRAY['Circuito de frenagem', 'Retificação de corrente', 'Segurança em cargas suspensas']);

-- Seed initial Defects for LAB-01
DO $$
DECLARE
    lab_id UUID;
BEGIN
    SELECT id INTO lab_id FROM public.laboratories WHERE code = 'LAB-01';

    INSERT INTO public.cases (laboratory_id, code, title, description, level, xp_reward, time_estimate, category, published, slug)
    VALUES 
    (lab_id, 'PD-001', 'Motor não liga', 'O operador pressiona o botão START, mas nada acontece.', 'Iniciante', 300, '10 min', 'Diagnóstico', true, 'pd-001-motor-nao-liga'),
    (lab_id, 'PD-002', 'Contator não atraca', 'O comando parece energizar, mas o contator KM1 não fecha.', 'Iniciante', 300, '10 min', 'Diagnóstico', true, 'pd-002-contator-nao-atraca'),
    (lab_id, 'PD-003', 'Relé térmico desarma na partida', 'O motor tenta partir, mas o relé de sobrecarga atua imediatamente.', 'Intermediário', 300, '15 min', 'Diagnóstico', true, 'pd-003-rele-termico-desarma'),
    (lab_id, 'PD-004', 'Motor liga somente mantendo START pressionado', 'O motor para assim que o botão START é solto.', 'Iniciante', 300, '10 min', 'Diagnóstico', true, 'pd-004-falha-no-selo'),
    (lab_id, 'PD-005', 'Motor não desliga ao pressionar STOP', 'O botão de emergência e o STOP não interrompem o funcionamento.', 'Avançado', 300, '15 min', 'Diagnóstico', true, 'pd-005-falha-no-desligamento');
END $$;

-- Seed initial Defects for LAB-02
DO $$
DECLARE
    lab_id UUID;
BEGIN
    SELECT id INTO lab_id FROM public.laboratories WHERE code = 'LAB-02';

    INSERT INTO public.cases (laboratory_id, code, title, description, level, xp_reward, time_estimate, category, published, slug)
    VALUES 
    (lab_id, 'RV-001', 'Motor gira apenas para frente', 'O comando de reversão não funciona.', 'Iniciante', 400, '12 min', 'Diagnóstico', true, 'rv-001'),
    (lab_id, 'RV-002', 'Motor gira apenas para trás', 'O comando direto não funciona.', 'Iniciante', 400, '12 min', 'Diagnóstico', true, 'rv-002'),
    (lab_id, 'RV-003', 'Contatores energizam simultaneamente', 'Falha grave que causa curto-circuito.', 'Especialista', 400, '20 min', 'Diagnóstico', true, 'rv-003'),
    (lab_id, 'RV-004', 'Intertravamento elétrico falhou', 'Os dois contatores podem ser acionados ao mesmo tempo.', 'Avançado', 400, '15 min', 'Diagnóstico', true, 'rv-004'),
    (lab_id, 'RV-005', 'Motor desarma durante reversão', 'O motor desliga ao tentar inverter o sentido.', 'Intermediário', 400, '15 min', 'Diagnóstico', true, 'rv-005');
END $$;

-- Seed initial Defects for LAB-03
DO $$
DECLARE
    lab_id UUID;
BEGIN
    SELECT id INTO lab_id FROM public.laboratories WHERE code = 'LAB-03';

    INSERT INTO public.cases (laboratory_id, code, title, description, level, xp_reward, time_estimate, category, published, slug)
    VALUES 
    (lab_id, 'ET-001', 'Motor não transfere para triângulo', 'O motor parte em estrela mas nunca muda para triângulo.', 'Intermediário', 600, '20 min', 'Diagnóstico', true, 'et-001'),
    (lab_id, 'ET-002', 'Temporizador não comuta', 'O ciclo fica travado no primeiro estágio.', 'Iniciante', 600, '15 min', 'Diagnóstico', true, 'et-002'),
    (lab_id, 'ET-003', 'Contatores estrela e triângulo energizam simultaneamente', 'Curto-circuito na transição.', 'Especialista', 600, '25 min', 'Diagnóstico', true, 'et-003'),
    (lab_id, 'ET-004', 'Motor desarma durante transição', 'O disjuntor cai no momento da mudança de fechamento.', 'Avançado', 600, '20 min', 'Diagnóstico', true, 'et-004'),
    (lab_id, 'ET-005', 'Motor permanece em estrela', 'Apesar do comando mudar, o fechamento físico não altera.', 'Intermediário', 600, '20 min', 'Diagnóstico', true, 'et-005');
END $$;

-- Seed initial Defects for LAB-04
DO $$
DECLARE
    lab_id UUID;
BEGIN
    SELECT id INTO lab_id FROM public.laboratories WHERE code = 'LAB-04';

    INSERT INTO public.cases (laboratory_id, code, title, description, level, xp_reward, time_estimate, category, published, slug)
    VALUES 
    (lab_id, 'CP-001', 'Autotransformador permanece energizado', 'Falha no contator de estrela do trafo.', 'Avançado', 900, '25 min', 'Diagnóstico', true, 'cp-001'),
    (lab_id, 'CP-002', 'Motor não parte', 'Sem tensão nos tapes de saída.', 'Intermediário', 900, '20 min', 'Diagnóstico', true, 'cp-002'),
    (lab_id, 'CP-003', 'Falha na comutação', 'Sequência incorreta de contatores.', 'Especialista', 900, '30 min', 'Diagnóstico', true, 'cp-003'),
    (lab_id, 'CP-004', 'Motor parte sem redução de tensão', 'Partida direta indesejada.', 'Intermediário', 900, '20 min', 'Diagnóstico', true, 'cp-004'),
    (lab_id, 'CP-005', 'Contatores em sequência incorreta', 'Erro de lógica de comando.', 'Avançado', 900, '25 min', 'Diagnóstico', true, 'cp-005');
END $$;

-- Seed initial Defects for LAB-05
DO $$
DECLARE
    lab_id UUID;
BEGIN
    SELECT id INTO lab_id FROM public.laboratories WHERE code = 'LAB-05';

    INSERT INTO public.cases (laboratory_id, code, title, description, level, xp_reward, time_estimate, category, published, slug)
    VALUES 
    (lab_id, 'RB-001', 'Resistência não é retirada', 'Motor não atinge velocidade nominal.', 'Avançado', 1000, '25 min', 'Diagnóstico', true, 'rb-001'),
    (lab_id, 'RB-002', 'Motor acelera lentamente', 'Falha em um dos estágios de aceleração.', 'Intermediário', 1000, '20 min', 'Diagnóstico', true, 'rb-002'),
    (lab_id, 'RB-003', 'Curto no circuito do rotor', 'Proteção atua imediatamente.', 'Especialista', 1000, '30 min', 'Diagnóstico', true, 'rb-003'),
    (lab_id, 'RB-004', 'Contatores não comutam', 'Bobinas de aceleração inoperantes.', 'Intermediário', 1000, '20 min', 'Diagnóstico', true, 'rb-004'),
    (lab_id, 'RB-005', 'Motor aquece excessivamente', 'Trabalhando com resistência inserida.', 'Avançado', 1000, '25 min', 'Diagnóstico', true, 'rb-005');
END $$;

-- Seed initial Defects for LAB-06
DO $$
DECLARE
    lab_id UUID;
BEGIN
    SELECT id INTO lab_id FROM public.laboratories WHERE code = 'LAB-06';

    INSERT INTO public.cases (laboratory_id, code, title, description, level, xp_reward, time_estimate, category, published, slug)
    VALUES 
    (lab_id, 'DH-001', 'Motor não troca velocidade', 'Fica preso em baixa ou alta.', 'Especialista', 1300, '30 min', 'Diagnóstico', true, 'dh-001'),
    (lab_id, 'DH-002', 'Alta velocidade não funciona', 'Falha no fechamento estrela-estrela.', 'Avançado', 1300, '25 min', 'Diagnóstico', true, 'dh-002'),
    (lab_id, 'DH-003', 'Baixa velocidade não funciona', 'Falha no fechamento triângulo.', 'Avançado', 1300, '25 min', 'Diagnóstico', true, 'dh-003'),
    (lab_id, 'DH-004', 'Contatores de polos não comutam', 'Intertravamento impedindo a troca.', 'Especialista', 1300, '30 min', 'Diagnóstico', true, 'dh-004'),
    (lab_id, 'DH-005', 'Proteção atua durante a troca', 'Pico de corrente excessivo na comutação.', 'Avançado', 1300, '25 min', 'Diagnóstico', true, 'dh-005');
END $$;

-- Seed initial Defects for LAB-07
DO $$
DECLARE
    lab_id UUID;
BEGIN
    SELECT id INTO lab_id FROM public.laboratories WHERE code = 'LAB-07';

    INSERT INTO public.cases (laboratory_id, code, title, description, level, xp_reward, time_estimate, category, published, slug)
    VALUES 
    (lab_id, 'FM-001', 'Freio permanece travado', 'Bobina do freio não desatua.', 'Intermediário', 1100, '20 min', 'Diagnóstico', true, 'fm-001'),
    (lab_id, 'FM-002', 'Freio não atua', 'Motor continua girando livre.', 'Iniciante', 1100, '15 min', 'Diagnóstico', true, 'fm-002'),
    (lab_id, 'FM-003', 'Bobina do freio não energiza', 'Falha no retificador.', 'Avançado', 1100, '25 min', 'Diagnóstico', true, 'fm-003'),
    (lab_id, 'FM-004', 'Motor gira com freio acionado', 'Sapatas desgastadas ou falha mecânica.', 'Intermediário', 1100, '20 min', 'Diagnóstico', true, 'fm-004'),
    (lab_id, 'FM-005', 'Freio atua com atraso', 'Falha no circuito de descarga.', 'Avançado', 1100, '25 min', 'Diagnóstico', true, 'fm-005');
END $$;
