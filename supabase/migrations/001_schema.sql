-- ============================================================
-- Rosie's Beauty Spa — Supabase Database Schema
-- Migration: 001_schema.sql
-- Run this in Supabase SQL Editor (Project > SQL Editor > New Query)
-- ============================================================


-- ============================================================
-- EXTENSIONS
-- ============================================================

-- gen_random_uuid() is available by default in Supabase (pgcrypto)
-- but enable just in case
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ============================================================
-- TABLES
-- ============================================================

-- ----------------------------------------------------------
-- profiles (extends auth.users)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id                  UUID          PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name                TEXT          NOT NULL DEFAULT '',
  email               TEXT          NOT NULL DEFAULT '',
  phone               TEXT          DEFAULT NULL,
  photo_url           TEXT          DEFAULT NULL,
  glow_points         INTEGER       NOT NULL DEFAULT 0,
  visit_streak        INTEGER       NOT NULL DEFAULT 0,
  notification_prefs  JSONB         NOT NULL DEFAULT '{"reminders":true,"rewards":true,"offers":true,"openings":true}'::jsonb,
  created_at          TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------
-- appointments
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.appointments (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_name      TEXT        NOT NULL,
  service_category  TEXT        NOT NULL DEFAULT '',
  date              DATE        NOT NULL,
  time              TIME        NOT NULL,
  status            TEXT        NOT NULL DEFAULT 'booked'
                                CHECK (status IN ('booked', 'completed', 'cancelled')),
  reminder_sent     BOOLEAN     NOT NULL DEFAULT false,
  notes             TEXT        DEFAULT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------
-- rewards_history
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.rewards_history (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type        TEXT        NOT NULL CHECK (type IN ('earned', 'redeemed')),
  points      INTEGER     NOT NULL,
  description TEXT        NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------
-- push_tokens
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.push_tokens (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  token       TEXT        NOT NULL,
  platform    TEXT        NOT NULL CHECK (platform IN ('ios', 'android', 'web')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, token)
);

-- ----------------------------------------------------------
-- notifications
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        DEFAULT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title       TEXT        NOT NULL,
  body        TEXT        NOT NULL,
  type        TEXT        NOT NULL CHECK (type IN ('reminder', 'reward', 'promo')),
  read        BOOLEAN     NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_appointments_user_date
  ON public.appointments (user_id, date);

CREATE INDEX IF NOT EXISTS idx_appointments_reminder
  ON public.appointments (date, time, reminder_sent)
  WHERE status = 'booked';

CREATE INDEX IF NOT EXISTS idx_rewards_history_user
  ON public.rewards_history (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_push_tokens_user
  ON public.push_tokens (user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user
  ON public.notifications (user_id, created_at DESC);


-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_tokens    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications  ENABLE ROW LEVEL SECURITY;


-- ----------------------------------------------------------
-- profiles policies
-- ----------------------------------------------------------

-- Users can read their own profile
CREATE POLICY "profiles: select own"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "profiles: update own"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);


-- ----------------------------------------------------------
-- appointments policies
-- (Ashley manages appointments via service role key server-side)
-- ----------------------------------------------------------

-- Users can read their own appointments
CREATE POLICY "appointments: select own"
  ON public.appointments
  FOR SELECT
  USING (auth.uid() = user_id);


-- ----------------------------------------------------------
-- rewards_history policies
-- ----------------------------------------------------------

-- Users can read their own rewards history
CREATE POLICY "rewards_history: select own"
  ON public.rewards_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert redemption rows only (earned rows created server-side)
CREATE POLICY "rewards_history: insert own redeemed"
  ON public.rewards_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id AND type = 'redeemed');


-- ----------------------------------------------------------
-- push_tokens policies
-- ----------------------------------------------------------

CREATE POLICY "push_tokens: select own"
  ON public.push_tokens
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "push_tokens: insert own"
  ON public.push_tokens
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "push_tokens: delete own"
  ON public.push_tokens
  FOR DELETE
  USING (auth.uid() = user_id);


-- ----------------------------------------------------------
-- notifications policies
-- ----------------------------------------------------------

-- Users can read their own notifications AND broadcast notifications (user_id IS NULL)
CREATE POLICY "notifications: select own or broadcast"
  ON public.notifications
  FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Users can mark their own notifications as read
CREATE POLICY "notifications: update read on own"
  ON public.notifications
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ============================================================
-- FUNCTIONS
-- ============================================================

-- ----------------------------------------------------------
-- update_updated_at() — used by trigger on profiles
-- ----------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ----------------------------------------------------------
-- handle_new_user() — fires after auth.users insert
-- Creates profile, awards 50 glow points, logs reward
-- ----------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_name  TEXT;
  v_email TEXT;
BEGIN
  -- Pull name and email from auth metadata (populated by Supabase Auth)
  v_name  := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '');
  v_email := COALESCE(NEW.email, '');

  -- Create the profile row
  INSERT INTO public.profiles (id, name, email)
  VALUES (NEW.id, v_name, v_email);

  -- Award 50 glow points for app download / sign-up
  UPDATE public.profiles
  SET glow_points = 50
  WHERE id = NEW.id;

  -- Log the bonus reward
  INSERT INTO public.rewards_history (user_id, type, points, description)
  VALUES (NEW.id, 'earned', 50, 'App download bonus');

  RETURN NEW;
END;
$$;

-- ----------------------------------------------------------
-- redeem_reward() — safe point deduction (SECURITY DEFINER)
-- Returns TRUE on success, FALSE if insufficient points
-- ----------------------------------------------------------
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


-- ============================================================
-- TRIGGERS
-- ============================================================

-- Fire handle_new_user() whenever a new auth user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Keep profiles.updated_at current on every update
CREATE OR REPLACE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- ============================================================
-- STORAGE (run separately if bucket doesn't exist yet)
-- ============================================================

/*

-- Create the avatars storage bucket (public read, authenticated write)
-- Run these in the Supabase SQL Editor after enabling the Storage extension.

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Public read: anyone can view avatar images
CREATE POLICY "avatars: public read"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'avatars');

-- Authenticated users can upload their own avatar
CREATE POLICY "avatars: authenticated insert"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can update their own avatar
CREATE POLICY "avatars: update own"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can delete their own avatar
CREATE POLICY "avatars: delete own"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

*/
