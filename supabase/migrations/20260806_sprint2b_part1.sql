-- Sprint 2B — Part 1: Architecture Definitiva da Biblioteca

-- 1. Create component_categories table
CREATE TABLE public.component_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create components table
CREATE TABLE public.components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    tag TEXT,
    name TEXT NOT NULL,
    description TEXT,
    category_id UUID REFERENCES public.component_categories(id),
    manufacturer TEXT,
    model TEXT,
    serial_number TEXT,
    function TEXT,
    electrical_symbol TEXT,
    image_url TEXT,
    datasheet_url TEXT,
    manual_url TEXT,
    location_panel TEXT,
    location_diagram TEXT,
    terminals JSONB,
    contacts JSONB,
    voltage TEXT,
    current TEXT,
    power TEXT,
    observations TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create circuits table
CREATE TABLE public.circuits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    laboratory_id UUID NOT NULL, -- Will be linked later via FK
    name TEXT NOT NULL,
    description TEXT,
    objective TEXT,
    industrial_application TEXT,
    operational_sequence TEXT,
    power_diagram_url TEXT,
    control_diagram_url TEXT,
    functional_diagram_url TEXT,
    terminal_list JSONB,
    wire_list JSONB,
    nominal_voltages JSONB,
    technical_observations TEXT,
    related_norms TEXT,
    bibliography TEXT,
    version TEXT DEFAULT '1.0.0',
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Update laboratories table with new fields
ALTER TABLE public.laboratories 
ADD COLUMN slug TEXT,
ADD COLUMN competencies TEXT[],
ADD COLUMN estimated_duration TEXT,
ADD COLUMN component_count INTEGER DEFAULT 0,
ADD COLUMN measurement_point_count INTEGER DEFAULT 0,
ADD COLUMN diagram_count INTEGER DEFAULT 0,
ADD COLUMN resource_count INTEGER DEFAULT 0,
ADD COLUMN status TEXT DEFAULT 'active',
ADD COLUMN version TEXT DEFAULT '1.0.0',
ADD COLUMN author TEXT;

-- 5. Create measurement_points table
CREATE TABLE public.measurement_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    laboratory_id UUID REFERENCES public.laboratories(id) ON DELETE CASCADE,
    circuit_id UUID REFERENCES public.circuits(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT,
    category TEXT,
    diagram_coordinates JSONB,
    panel_coordinates JSONB,
    expected_value TEXT,
    unit TEXT,
    observations TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(laboratory_id, code)
);

-- 6. Create resource_categories table
CREATE TABLE public.resource_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Create learning_resources table
CREATE TABLE public.learning_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    laboratory_id UUID REFERENCES public.laboratories(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.resource_categories(id),
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL, -- 'video', 'pdf', 'image', etc.
    url TEXT NOT NULL,
    metadata JSONB,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Create laboratory_components junction table
CREATE TABLE public.laboratory_components (
    laboratory_id UUID REFERENCES public.laboratories(id) ON DELETE CASCADE,
    component_id UUID REFERENCES public.components(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    PRIMARY KEY (laboratory_id, component_id)
);

-- 9. Add FK from circuits to laboratories now that both exist
ALTER TABLE public.circuits 
ADD CONSTRAINT circuits_laboratory_id_fkey 
FOREIGN KEY (laboratory_id) REFERENCES public.laboratories(id) ON DELETE CASCADE;

-- 10. Enable RLS and set Grants
GRANT SELECT ON public.component_categories TO authenticated, anon;
GRANT SELECT ON public.components TO authenticated, anon;
GRANT SELECT ON public.circuits TO authenticated, anon;
GRANT SELECT ON public.measurement_points TO authenticated, anon;
GRANT SELECT ON public.resource_categories TO authenticated, anon;
GRANT SELECT ON public.learning_resources TO authenticated, anon;
GRANT SELECT ON public.laboratory_components TO authenticated, anon;

GRANT ALL ON public.component_categories TO service_role;
GRANT ALL ON public.components TO service_role;
GRANT ALL ON public.circuits TO service_role;
GRANT ALL ON public.measurement_points TO service_role;
GRANT ALL ON public.resource_categories TO service_role;
GRANT ALL ON public.learning_resources TO service_role;
GRANT ALL ON public.laboratory_components TO service_role;

ALTER TABLE public.component_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circuits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.measurement_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laboratory_components ENABLE ROW LEVEL SECURITY;

-- 11. Create basic RLS policies
CREATE POLICY "Public read component_categories" ON public.component_categories FOR SELECT USING (true);
CREATE POLICY "Public read components" ON public.components FOR SELECT USING (true);
CREATE POLICY "Public read circuits" ON public.circuits FOR SELECT USING (true);
CREATE POLICY "Public read measurement_points" ON public.measurement_points FOR SELECT USING (true);
CREATE POLICY "Public read resource_categories" ON public.resource_categories FOR SELECT USING (true);
CREATE POLICY "Public read learning_resources" ON public.learning_resources FOR SELECT USING (true);
CREATE POLICY "Public read laboratory_components" ON public.laboratory_components FOR SELECT USING (true);

-- 12. Seed categories
INSERT INTO public.component_categories (name) VALUES 
('Contatores'), ('Relés'), ('Relés Térmicos'), ('Temporizadores'), ('Botões'), 
('Chaves'), ('Sensores'), ('Fusíveis'), ('Disjuntores'), ('Transformadores'), 
('Bornes'), ('Motores'), ('Freios'), ('Cabos'), ('Sinaleiros'), ('Chaves Fim de Curso'), ('Outros');

INSERT INTO public.resource_categories (name) VALUES 
('Diagramas'), ('Fotos'), ('Vídeos'), ('Áudios'), ('PDFs'), ('Datasheets'), ('Catálogos'), ('Normas');

-- 13. Update existing labs with slugs and default values
UPDATE public.laboratories SET slug = 'partida-direta', status = 'active', version = '1.0.0' WHERE code = 'LAB-01';
UPDATE public.laboratories SET slug = 'chave-reversao', status = 'active', version = '1.0.0' WHERE code = 'LAB-02';
UPDATE public.laboratories SET slug = 'estrela-triangulo', status = 'active', version = '1.0.0' WHERE code = 'LAB-03';
UPDATE public.laboratories SET slug = 'chave-compensadora', status = 'active', version = '1.0.0' WHERE code = 'LAB-04';
UPDATE public.laboratories SET slug = 'rotor-bobinado', status = 'active', version = '1.0.0' WHERE code = 'LAB-05';
UPDATE public.laboratories SET slug = 'dahlander', status = 'active', version = '1.0.0' WHERE code = 'LAB-06';
UPDATE public.laboratories SET slug = 'freio-magnetico', status = 'active', version = '1.0.0' WHERE code = 'LAB-07';

