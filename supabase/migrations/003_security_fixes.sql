-- ============================================================
-- Security Fixes: RPC auth check, notification defaults, storage RLS
-- ============================================================

-- Fix 1: Replace redeem_reward with auth check
CREATE OR REPLACE FUNCTION public.redeem_reward(
  p_user_id    UUID,
  p_points     INTEGER,
  p_description TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_points INTEGER;
BEGIN
  -- Verify caller is the account owner
  IF auth.uid() != p_user_id THEN
    RETURN false;
  END IF;

  -- Lock the row to prevent race conditions
  SELECT glow_points
  INTO   v_current_points
  FROM   public.profiles
  WHERE  id = p_user_id
  FOR UPDATE;

  -- Insufficient balance
  IF v_current_points IS NULL OR v_current_points < p_points THEN
    RETURN false;
  END IF;

  -- Deduct points
  UPDATE public.profiles
  SET    glow_points = glow_points - p_points
  WHERE  id = p_user_id;

  -- Log the redemption (negative points for display consistency)
  INSERT INTO public.rewards_history (user_id, type, points, description)
  VALUES (p_user_id, 'redeemed', -p_points, p_description);

  RETURN true;
END;
$$;

-- Fix 2: Update storage policies to scope to user's own files
-- Drop old broad policies
DROP POLICY IF EXISTS "avatars: authenticated insert" ON storage.objects;
DROP POLICY IF EXISTS "avatars: update own" ON storage.objects;
DROP POLICY IF EXISTS "avatars: delete own" ON storage.objects;

-- Recreate with proper scoping (supports both flat userId.jpg and folder userId/avatar.jpg)
CREATE POLICY "avatars: authenticated insert own"
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
