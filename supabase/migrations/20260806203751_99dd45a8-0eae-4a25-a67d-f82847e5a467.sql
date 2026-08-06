CREATE TABLE public.marketplace_items (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    description text not null,
    price integer not null,
    category text not null,
    image_url text,
    requirements text,
    created_at timestamp with time zone default now()
);

GRANT SELECT ON public.marketplace_items TO authenticated;
GRANT ALL ON public.marketplace_items TO service_role;

ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated to read marketplace items"
ON public.marketplace_items FOR SELECT
TO authenticated
USING (true);
