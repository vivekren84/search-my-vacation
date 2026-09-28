-- EBC-R1.3-WS13-005 Phase 0, migration M04 (EBC-R1.3-WS13-004 §6.2,
-- WP-0.4). AD-WS13-006: task category and kind (FR-JW-24, I-01, D-05).
--
-- category: a code from the configured task_categories list
-- (workspace_configuration, M05), validated by the application. NULL on
-- every pre-existing (Journey Planning) task and shown as "Operational".
-- kind: 'task' (default) or 'follow_up'. A follow-up needs a due date
-- (FR-JW-24 AC2), enforced here.
--
-- Additive only; every existing row gets kind = 'task' and category NULL,
-- so Journey Planning tasks behave exactly as before.
-- Rollback (forward-fix): drop the CHECKs and the two columns.

alter table public.workspace_tasks
  add column if not exists category text,
  add column if not exists kind text not null default 'task';

alter table public.workspace_tasks
  add constraint workspace_tasks_kind_check
  check (kind in ('task', 'follow_up'));

alter table public.workspace_tasks
  add constraint workspace_tasks_follow_up_due_check
  check (kind <> 'follow_up' or due_at is not null);

alter table public.workspace_tasks
  add constraint workspace_tasks_category_check
  check (category is null or length(trim(category)) > 0);

comment on column public.workspace_tasks.category is
  'AD-WS13-006: task category code from workspace_configuration.task_categories (Operational, Traveller follow-up, Payment in Release 1.3). NULL = Operational (pre-WS13 rows).';
comment on column public.workspace_tasks.kind is
  'AD-WS13-006: task or follow_up. A follow-up requires due_at (FR-JW-24 AC2).';
