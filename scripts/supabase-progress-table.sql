create table if not exists public.fluentia_user_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.fluentia_user_progress enable row level security;

drop policy if exists "Users can read their own Fluentia progress" on public.fluentia_user_progress;
create policy "Users can read their own Fluentia progress"
  on public.fluentia_user_progress
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can write their own Fluentia progress" on public.fluentia_user_progress;
create policy "Users can write their own Fluentia progress"
  on public.fluentia_user_progress
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own Fluentia progress" on public.fluentia_user_progress;
create policy "Users can update their own Fluentia progress"
  on public.fluentia_user_progress
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
