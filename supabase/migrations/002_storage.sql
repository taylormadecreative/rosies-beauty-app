INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "avatars: public read"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "avatars: authenticated insert"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (SPLIT_PART(name, '.', 1) = auth.uid()::text OR (storage.foldername(name))[1] = auth.uid()::text)
  );

CREATE POLICY "avatars: update own"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (SPLIT_PART(name, '.', 1) = auth.uid()::text OR (storage.foldername(name))[1] = auth.uid()::text)
  );

CREATE POLICY "avatars: delete own"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (SPLIT_PART(name, '.', 1) = auth.uid()::text OR (storage.foldername(name))[1] = auth.uid()::text)
  );
