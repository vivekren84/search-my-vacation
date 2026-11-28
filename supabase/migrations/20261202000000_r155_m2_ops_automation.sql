-- Release 1.5.5 Milestone 2: Operations Pipeline Automation & Rollback Governance (EPIC 1.1)

-- 1. Extend workspace_trips.deal_stage CHECK constraint to include 'In Travel'
ALTER TABLE public.workspace_trips
  DROP CONSTRAINT IF EXISTS workspace_trips_deal_stage_check;

ALTER TABLE public.workspace_trips
  ADD CONSTRAINT workspace_trips_deal_stage_check
  CHECK (deal_stage IN ('Enquiry', 'In Progress', 'Booked/Won', 'In Travel', 'Lost', 'On Hold', 'Cancelled'));

-- 2. Idempotent Auto-Promotion RPC: Booked/Won -> In Travel when start_date <= today (IST)
CREATE OR REPLACE FUNCTION public.promote_due_trips_to_in_travel()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_today_ist DATE := (now() AT TIME ZONE 'Asia/Kolkata')::date;
  v_promoted RECORD;
  v_count INTEGER := 0;
  v_refs TEXT[] := ARRAY[]::TEXT[];
BEGIN
  FOR v_promoted IN
    UPDATE public.workspace_trips
    SET
      deal_stage = 'In Travel',
      trip_status = CASE WHEN trip_status = 'Complete' THEN trip_status ELSE 'In Progress' END,
      updated_at = now()
    WHERE deal_stage = 'Booked/Won'
      AND is_archived = false
      AND trip_status <> 'Complete'
      AND start_date IS NOT NULL
      AND start_date <= v_today_ist
    RETURNING id, deal_reference_id, start_date
  LOOP
    v_count := v_count + 1;
    v_refs := array_append(v_refs, v_promoted.deal_reference_id);

    INSERT INTO public.workspace_trip_events (
      trip_id,
      actor_id,
      actor_name,
      event_type,
      previous_state,
      new_state,
      reason_code,
      comment
    )
    VALUES (
      v_promoted.id,
      NULL,
      'System Automation',
      'STAGE_CHANGED',
      jsonb_build_object('deal_stage', 'Booked/Won'),
      jsonb_build_object('deal_stage', 'In Travel', 'start_date', v_promoted.start_date, 'evaluated_date_ist', v_today_ist),
      'AUTO_PROMOTION_IST',
      'Automatically promoted to In Travel / Active on start date (' || v_promoted.start_date::text || ' IST)'
    );
  END LOOP;

  RETURN jsonb_build_object(
    'promoted_count', v_count,
    'promoted_refs', to_jsonb(v_refs),
    'evaluated_date_ist', v_today_ist
  );
END;
$$;

REVOKE ALL ON FUNCTION public.promote_due_trips_to_in_travel FROM anon, public;
GRANT EXECUTE ON FUNCTION public.promote_due_trips_to_in_travel TO authenticated, service_role;

-- 3. Backfill any currently due Booked/Won trips immediately
SELECT public.promote_due_trips_to_in_travel();

-- 4. Schedule daily pg_cron job at 00:05 IST (18:35 UTC)
DO $$
BEGIN
  CREATE EXTENSION IF NOT EXISTS pg_cron;
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'smv_promote_due_trips_in_travel') THEN
      PERFORM cron.unschedule('smv_promote_due_trips_in_travel');
    END IF;
    PERFORM cron.schedule(
      'smv_promote_due_trips_in_travel',
      '35 18 * * *',
      'SELECT public.promote_due_trips_to_in_travel();'
    );
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'pg_cron scheduling skipped or unavailable on this environment: %', SQLERRM;
END $$;
