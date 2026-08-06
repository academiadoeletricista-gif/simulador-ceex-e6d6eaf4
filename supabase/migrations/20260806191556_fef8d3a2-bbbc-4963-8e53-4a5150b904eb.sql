-- TABELA DE PERFIS
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    bio TEXT,
    city TEXT,
    state TEXT,
    company TEXT,
    role TEXT,
    language TEXT DEFAULT 'pt-br',
    theme TEXT DEFAULT 'dark',
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    accuracy NUMERIC DEFAULT 0,
    total_diagnoses INTEGER DEFAULT 0,
    avg_time INTEGER DEFAULT 0,
    streak_current INTEGER DEFAULT 0,
    streak_best INTEGER DEFAULT 0,
    last_activity TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABELA DE CASOS (BIBLIOTECA)
CREATE TABLE public.cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    level TEXT NOT NULL,
    xp_reward INTEGER NOT NULL,
    time_estimate TEXT NOT NULL,
    description TEXT,
    symptoms TEXT[],
    checklist TEXT[],
    image_url TEXT,
    diagram_url TEXT,
    content JSONB,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABELA DE PROGRESSO (SESSÕES DE CASOS)
CREATE TABLE public.case_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'in_progress',
    current_step INTEGER DEFAULT 0,
    answers JSONB DEFAULT '{}',
    start_time TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, case_id)
);

-- TABELA DE CONQUISTAS
CREATE TABLE public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    max_progress INTEGER NOT NULL,
    xp_reward INTEGER NOT NULL,
    category TEXT
);

-- TABELA DE PROGRESSO EM CONQUISTAS
CREATE TABLE public.user_achievements (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
    progress INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    PRIMARY KEY (user_id, achievement_id)
);

-- HABILITAR RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- GRANTS
GRANT SELECT ON public.profiles TO authenticated;
GRANT UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

GRANT SELECT ON public.cases TO authenticated;
GRANT SELECT ON public.cases TO anon;
GRANT ALL ON public.cases TO service_role;

GRANT ALL ON public.case_sessions TO authenticated;
GRANT ALL ON public.case_sessions TO service_role;

GRANT SELECT ON public.achievements TO authenticated;
GRANT SELECT ON public.achievements TO anon;
GRANT ALL ON public.achievements TO service_role;

GRANT ALL ON public.user_achievements TO authenticated;
GRANT ALL ON public.user_achievements TO service_role;

-- POLICIES
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Anyone can view published cases" ON public.cases FOR SELECT USING (published = TRUE);

CREATE POLICY "Users can manage their own sessions" ON public.case_sessions FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view achievements" ON public.achievements FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "Users can view their own achievement progress" ON public.user_achievements FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own achievement progress" ON public.user_achievements FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- TRIGGER PARA CRIAR PERFIL AUTOMATICAMENTE NO SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- SEED INICIAL DE CASOS
INSERT INTO public.cases (slug, title, category, level, xp_reward, time_estimate, description, symptoms, checklist, image_url)
VALUES 
('falha-reversao-motor', 'Falha na Reversão de Motor', 'Reversão', 'Intermediário', 450, '8 min', 'O motor não está completando o ciclo de reversão. Suspeita-se de falha nos intertravamentos dos contatores K1 e K2.', ARRAY['Motor gira apenas em um sentido', 'Contator de reversão não atraca'], ARRAY['Verificar tensão na bobina de K2', 'Inspecionar contatos auxiliares de K1'], 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=400'),
('curto-contator', 'Curto-circuito em Contator', 'Contatores', 'Iniciante', 200, '5 min', 'Um curto-circuito foi detectado no painel. O disjuntor de comando está desarmando ao tentar ligar o contator.', ARRAY['Disjuntor desarma imediatamente', 'Odor de queimado no painel'], ARRAY['Medir resistência da bobina', 'Verificar fiação de comando'], 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400'),
('parametrizacao-soft-starter', 'Parametrização de Soft Starter', 'Soft Starter', 'Avançado', 800, '15 min', 'A Soft Starter está apresentando erro de subcorrente durante a partida de uma bomba centrífuga.', ARRAY['Trip por subcorrente', 'Partida incompleta'], ARRAY['Revisar parâmetros P002 e P003', 'Verificar carga no eixo da bomba'], 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=400');
