-- Create applications table
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  cv_id uuid references public.cvs(id) on delete set null,
  cover_letter text,
  status text default 'pending' check (status in ('pending', 'reviewed', 'accepted', 'rejected')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(job_id, user_id)
);

-- Enable RLS
alter table public.applications enable row level security;

-- Users can view their own applications
create policy "applications_select_own"
  on public.applications for select
  using (auth.uid() = user_id);

-- Employers can view applications for their jobs
create policy "applications_select_employer"
  on public.applications for select
  using (
    exists (
      select 1 from public.jobs
      where jobs.id = applications.job_id
      and jobs.employer_id = auth.uid()
    )
  );

-- Users can insert their own applications
create policy "applications_insert_own"
  on public.applications for insert
  with check (auth.uid() = user_id);

-- Users can update their own applications
create policy "applications_update_own"
  on public.applications for update
  using (auth.uid() = user_id);

-- Employers can update applications for their jobs
create policy "applications_update_employer"
  on public.applications for update
  using (
    exists (
      select 1 from public.jobs
      where jobs.id = applications.job_id
      and jobs.employer_id = auth.uid()
    )
  );
