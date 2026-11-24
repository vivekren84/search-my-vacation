-- Rollback: 20261127000001_ensure_workspace_vendors_columns.rollback.sql
ALTER TABLE public.workspace_vendors
  DROP COLUMN IF EXISTS star_rating,
  DROP COLUMN IF EXISTS poc_name,
  DROP COLUMN IF EXISTS poc_mobile,
  DROP COLUMN IF EXISTS office_phone,
  DROP COLUMN IF EXISTS email,
  DROP COLUMN IF EXISTS website,
  DROP COLUMN IF EXISTS rate_card_link,
  DROP COLUMN IF EXISTS b2b_rates,
  DROP COLUMN IF EXISTS comments,
  DROP COLUMN IF EXISTS region,
  DROP COLUMN IF EXISTS metadata;

NOTIFY pgrst, 'reload schema';
