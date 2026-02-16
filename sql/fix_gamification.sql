-- Fix Gamification System Migration
-- Adds dedicated last_spin column, unique constraints, indexes, and RPC functions

-- Add dedicated last_spin column to leaderboard for spin cooldown
ALTER TABLE public.leaderboard
  ADD COLUMN IF NOT EXISTS last_spin timestamptz;

-- Deduplicate leaderboard: keep the row with highest total_points per user_id
DELETE FROM public.leaderboard
WHERE id NOT IN (
  SELECT DISTINCT ON (user_id) id
  FROM public.leaderboard
  ORDER BY user_id, total_points DESC, updated_at DESC
);

-- Now add unique constraint on user_id to prevent future duplicates
-- (enables upsert pattern)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'leaderboard_user_id_unique'
  ) THEN
    ALTER TABLE public.leaderboard
      ADD CONSTRAINT leaderboard_user_id_unique UNIQUE (user_id);
  END IF;
END $$;

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_leaderboard_user_id ON public.leaderboard(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_total_points_desc ON public.leaderboard(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_progress_user_id ON public.daily_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_challenges_user_id_type ON public.user_challenges(user_id, challenge_type);

-- RPC function for atomic XP update + spin tracking
CREATE OR REPLACE FUNCTION public.claim_daily_spin(
  p_user_id uuid,
  p_xp integer,
  p_username text DEFAULT 'Usuario'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_last_spin timestamptz;
  v_new_points integer;
  v_new_level integer;
BEGIN
  -- Check cooldown atomically
  SELECT last_spin INTO v_last_spin
  FROM public.leaderboard
  WHERE user_id = p_user_id
  FOR UPDATE;  -- Row lock prevents double-spin race condition

  -- If entry exists and spin was within 24 hours, reject
  IF v_last_spin IS NOT NULL AND v_last_spin > now() - interval '24 hours' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'cooldown_active',
      'next_spin', v_last_spin + interval '24 hours'
    );
  END IF;

  -- Upsert leaderboard entry with new XP
  INSERT INTO public.leaderboard (user_id, username, total_points, level, last_spin, last_activity, created_at, updated_at)
  VALUES (
    p_user_id,
    p_username,
    p_xp,
    1,
    now(),
    now(),
    now(),
    now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    total_points = public.leaderboard.total_points + p_xp,
    level = floor((public.leaderboard.total_points + p_xp) / 100) + 1,
    last_spin = now(),
    last_activity = now(),
    updated_at = now()
  RETURNING total_points, level INTO v_new_points, v_new_level;

  RETURN jsonb_build_object(
    'success', true,
    'new_points', v_new_points,
    'new_level', v_new_level,
    'xp_earned', p_xp
  );
END;
$$;

-- RPC function for fetching global stats
CREATE OR REPLACE FUNCTION public.get_global_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_users', count(*),
    'total_points', coalesce(sum(total_points), 0),
    'best_streak', coalesce(max(current_streak), 0),
    'challenges_completed', (
      SELECT count(*) FROM public.user_challenges WHERE is_active = false
    )
  ) INTO v_result
  FROM public.leaderboard;

  RETURN v_result;
END;
$$;
