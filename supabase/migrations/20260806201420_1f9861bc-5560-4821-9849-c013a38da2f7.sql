-- Phase 2B Part 3: Asset System

-- Create asset categories enum
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'asset_category') THEN
        CREATE TYPE public.asset_category AS ENUM (
            'Diagrama de Potência',
            'Diagrama de Comando',
            'Diagrama Funcional',
            'Diagrama Multifilar',
            'Diagrama Unifilar',
            'Painel Frontal',
            'Painel Interno',
            'Foto',
            'Vídeo',
            'Áudio',
            'Animação',
            'PDF',
            'Manual',
            'Catálogo',
            'Datasheet',
            'Checklist',
            'Norma',
            'Fluxograma',
            'Modelo 3D',
            'Símbolo Elétrico',
            'Documento Técnico'
        );
    END IF;
END $$;

-- Asset Status
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'asset_status') THEN
        CREATE TYPE public.asset_status AS ENUM ('active', 'inactive', 'archived', 'draft');
    END IF;
END $$;

-- Assets Table
CREATE TABLE IF NOT EXISTS public.assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category public.asset_category NOT NULL,
    type TEXT NOT NULL, -- mime type
    format TEXT NOT NULL, -- extension
    bucket TEXT NOT NULL,
    path TEXT NOT NULL,
    public_url TEXT,
    thumbnail_url TEXT,
    version TEXT DEFAULT '1.0.0',
    author TEXT,
    language TEXT DEFAULT 'pt-BR',
    metadata JSONB DEFAULT '{}',
    status public.asset_status DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Asset Tags
CREATE TABLE IF NOT EXISTS public.asset_tags (
    asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE,
    tag TEXT NOT NULL,
    PRIMARY KEY (asset_id, tag)
);

-- Asset Versions
CREATE TABLE IF NOT EXISTS public.asset_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE,
    version TEXT NOT NULL,
    path TEXT NOT NULL,
    public_url TEXT,
    changes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    author TEXT
);

-- Asset Links (Polymorphic-like N:N)
CREATE TABLE IF NOT EXISTS public.asset_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL, -- 'laboratory', 'circuit', 'case', 'component', 'measurement', 'lesson'
    entity_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Diagram Hotspots
CREATE TABLE IF NOT EXISTS public.diagram_hotspots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE,
    tag TEXT, -- KM1, F1, etc.
    type TEXT, -- 'component', 'terminal', 'contact'
    x FLOAT NOT NULL,
    y FLOAT NOT NULL,
    width FLOAT NOT NULL,
    height FLOAT NOT NULL,
    component_id UUID, -- Link to components table if exists
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Panel Hotspots
CREATE TABLE IF NOT EXISTS public.panel_hotspots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE,
    x FLOAT NOT NULL,
    y FLOAT NOT NULL,
    width FLOAT NOT NULL,
    height FLOAT NOT NULL,
    component_id UUID,
    tooltip TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assets TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.asset_tags TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.asset_versions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.asset_links TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.diagram_hotspots TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.panel_hotspots TO authenticated;

GRANT ALL ON public.assets TO service_role;
GRANT ALL ON public.asset_tags TO service_role;
GRANT ALL ON public.asset_versions TO service_role;
GRANT ALL ON public.asset_links TO service_role;
GRANT ALL ON public.diagram_hotspots TO service_role;
GRANT ALL ON public.panel_hotspots TO service_role;

-- RLS
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagram_hotspots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.panel_hotspots ENABLE ROW LEVEL SECURITY;

-- Simple RLS Policies
CREATE POLICY "Authenticated users can read assets" ON public.assets FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read asset_tags" ON public.asset_tags FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read asset_versions" ON public.asset_versions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read asset_links" ON public.asset_links FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read diagram_hotspots" ON public.diagram_hotspots FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read panel_hotspots" ON public.panel_hotspots FOR SELECT TO authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_assets_code ON public.assets(code);
CREATE INDEX IF NOT EXISTS idx_assets_category ON public.assets(category);
CREATE INDEX IF NOT EXISTS idx_asset_links_entity ON public.asset_links(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_diagram_hotspots_asset ON public.diagram_hotspots(asset_id);
CREATE INDEX IF NOT EXISTS idx_panel_hotspots_asset ON public.panel_hotspots(asset_id);
