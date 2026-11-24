-- Migration: 20261126000001_sync_customer_sequence_function.sql
-- Release 1.5.1: Sequence synchronization helper for customer_code_seq

CREATE OR REPLACE FUNCTION public.fn_sync_customer_code_seq(p_val BIGINT DEFAULT NULL)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_max BIGINT;
BEGIN
  IF p_val IS NOT NULL THEN
    PERFORM setval('public.customer_code_seq', p_val, true);
    RETURN p_val;
  END IF;

  SELECT COALESCE(MAX(NULLIF(regexp_replace(customer_code, '\D', '', 'g'), '')::BIGINT), 99)
  INTO v_max
  FROM public.workspace_customers;

  PERFORM setval('public.customer_code_seq', GREATEST(v_max, 99), true);
  RETURN GREATEST(v_max, 99);
END;
$$;

REVOKE ALL ON FUNCTION public.fn_sync_customer_code_seq(BIGINT) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.fn_sync_customer_code_seq(BIGINT) TO authenticated, service_role;
