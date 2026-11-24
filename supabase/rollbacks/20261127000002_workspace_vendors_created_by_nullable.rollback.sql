-- Rollback: 20261127000002_workspace_vendors_created_by_nullable.rollback.sql
ALTER TABLE public.workspace_vendors ALTER COLUMN created_by_user_id DROP DEFAULT;
ALTER TABLE public.workspace_vendors ALTER COLUMN created_by_user_id SET NOT NULL;

NOTIFY pgrst, 'reload schema';
