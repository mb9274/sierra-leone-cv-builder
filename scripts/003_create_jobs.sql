-- Create jobs table
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  company text not null,
  location text not null,
  type text not null,
  salary text default '500 Leones',
  description text not null,
  requirements jsonb default '[]'::jsonb,
  status text default 'active' check (status in ('active', 'closed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.jobs enable row level security;

-- Anyone can view active jobs
create policy "jobs_select_active"
  on public.jobs for select
  using (status = 'active');

-- Only employers can insert their own jobs
create policy "jobs_insert_own"
  on public.jobs for insert
  with check (auth.uid() = employer_id);

-- Only employers can update their own jobs
create policy "jobs_update_own"
  on public.jobs for update
  using (auth.uid() = employer_id);

-- Only employers can delete their own jobs
create policy "jobs_delete_own"
  on public.jobs for delete
  using (auth.uid() = employer_id);
