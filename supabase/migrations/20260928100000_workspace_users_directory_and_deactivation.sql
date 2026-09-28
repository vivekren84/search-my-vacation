-- EBC-R1.3-WS13-005 Phase 0, migration M01 (EBC-R1.3-WS13-004 §6.2, WP-0.1).
-- AD-WS13-007 (ratified, DEC-R1.3-020): Workspace User directory and
-- activation state.
--
-- Adds two nullable columns to workspace_users and one read-only
-- SECURITY DEFINER directory function. The workspace_users table's own RLS
-- policies are NOT changed: a Workspace User still reads only their own
-- row (Administrators read all). The directory function is the single,
-- deliberately narrow way for any Workspace User to see other users' names
-- (owner names on every Journey row, FR-JW-03 AC3; the assign/reassign
-- picker, UX §16; AL-16). It exposes no email address.
--
-- Deactivation, not deletion, is the user-exit path (AD-WS13-007, SEC-04).
-- Setting deactivated_at is an Administrator data operation in Release 1.3
-- (no user-management UI). The application rejects deactivated users at
-- sign-in and on every protected request (auth/service.ts).
--
-- Additive only. Rollback (forward-fix): drop function
-- public.workspace_user_directory(); alter table public.workspace_users
-- drop column display_name, drop column deactivated_at. No data loss for
-- any pre-existing column.

alter table public.workspace_users
  add column if not exists display_name text,
  add column if not exists deactivated_at timestamptz;

alter table public.workspace_users
  add constraint workspace_users_display_name_check
  check (display_name is null or length(trim(display_name)) > 0);

comment on column public.workspace_users.display_name is
  'AD-WS13-007: optional display name. When NULL, the directory and the application fall back to Supabase Auth user_metadata full_name/name, then the email local part (auth/displayName.ts deriveWorkspaceDisplayName; the SQL fallback below mirrors it).';
comment on column public.workspace_users.deactivated_at is
  'AD-WS13-007: set by an Administrator (data operation, Release 1.3) to deactivate a Workspace User. Deactivated users cannot sign in to the Workspace; their Journeys stay assigned until reassigned (D-03, E-06, AL-16). Deactivation replaces deletion (SEC-04).';

-- Directory: every Workspace User, with a display name derived exactly as
-- deriveWorkspaceDisplayName() does in TypeScript (display_name column
-- first, then user_metadata full_name / name, then the email local part,
-- then "Workspace User"). Callers must themselves be a provisioned
-- Workspace User; any other authenticated caller receives no rows.
create or replace function public.workspace_user_directory()
returns table (
  user_id uuid,
  display_name text,
  role text,
  is_active boolean
)
language sql
stable
security definer
set search_path = public
as $$
  select
    wu.user_id,
    coalesce(
      nullif(trim(wu.display_name), ''),
      nullif(trim(au.raw_user_meta_data ->> 'full_name'), ''),
      nullif(trim(au.raw_user_meta_data ->> 'name'), ''),
      nullif(split_part(coalesce(au.email, ''), '@', 1), ''),
      'Workspace User'
    ) as display_name,
    wu.role,
    wu.deactivated_at is null as is_active
  from public.workspace_users wu
  left join auth.users au on au.id = wu.user_id
  where public.workspace_current_user_role() is not null
  order by 2;
$$;

comment on function public.workspace_user_directory() is
  'AD-WS13-007: read-only Workspace User directory (id, display name, role, active) for any provisioned Workspace User. Exposes no email. workspace_users RLS is unchanged.';

revoke all on function public.workspace_user_directory() from public, anon;
grant execute on function public.workspace_user_directory() to authenticated;
