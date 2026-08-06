-- Storage RLS Policies for Assets
-- Allow authenticated users to read from all these buckets
DO $$
DECLARE
    bucket_name TEXT;
    buckets TEXT[] := ARRAY[
        'laboratories', 'circuits', 'diagrams', 'panels', 'components', 
        'measurements', 'manuals', 'videos', 'audios', 'animations', 
        'documents', 'checklists', 'thumbnails', 'certificates', 'logos', 'icons'
    ];
BEGIN
    FOREACH bucket_name IN ARRAY buckets
    LOOP
        -- Check if policy already exists before creating
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = format('Allow authenticated to read %s', bucket_name)
        ) THEN
            EXECUTE format('
                CREATE POLICY "Allow authenticated to read %s" ON storage.objects
                FOR SELECT TO authenticated USING (bucket_id = %L);
            ', bucket_name, bucket_name);
        END IF;

        IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = format('Allow service_role to manage %s', bucket_name)
        ) THEN
            EXECUTE format('
                CREATE POLICY "Allow service_role to manage %s" ON storage.objects
                FOR ALL TO service_role USING (bucket_id = %L) WITH CHECK (bucket_id = %L);
            ', bucket_name, bucket_name, bucket_name);
        END IF;
    END LOOP;
END $$;
