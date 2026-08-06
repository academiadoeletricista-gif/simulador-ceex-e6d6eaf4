
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS organization_id UUID;

CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Now set the foreign key
ALTER TABLE public.profiles ADD CONSTRAINT profiles_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);

GRANT SELECT ON public.organizations TO authenticated;
GRANT ALL ON public.organizations TO service_role;

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view their own organization" ON public.organizations
    FOR SELECT TO authenticated USING (
        id IN (SELECT p.organization_id FROM public.profiles p WHERE p.id = auth.uid())
    );
