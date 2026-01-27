-- Create CVs table to store user CVs
create table if not exists public.cvs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text not null,
  age integer not null,
  summary text,
  education jsonb default '[]'::jsonb,
  experience jsonb default '[]'::jsonb,
  skills jsonb default '[]'::jsonb,
  languages jsonb default '[]'::jsonb,
  photo_url text,
  template text default 'professional',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.cvs enable row level security;

-- RLS Policies
create policy "cvs_select_own"
  on public.cvs for select
  using (auth.uid() = user_id);

create policy "cvs_insert_own"
  on public.cvs for insert
  with check (auth.uid() = user_id);

create policy "cvs_update_own"
  on public.cvs for update
  using (auth.uid() = user_id);

create policy "cvs_delete_own"
  on public.cvs for delete
  using (auth.uid() = user_id);
