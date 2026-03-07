-- Full database setup for AI CV Builder (Supabase/Postgres)
-- Safe to run multiple times (idempotent where possible).

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- Tables
-- ------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  age integer check (age >= 18 and age <= 30),
  role text not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cvs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  cv_id uuid references public.cvs(id) on delete set null,
  cover_letter text,
  status text default 'pending' check (status in ('pending', 'reviewed', 'accepted', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(job_id, user_id)
);

create table if not exists public.platform_stats (
  id uuid primary key default gen_random_uuid(),
  total_cvs integer not null default 0,
  total_users integer not null default 0,
  total_applications integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.teacher_content (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid references auth.users(id) on delete cascade,
  teacher_name text not null,
  teacher_email text not null,
  course_title text not null,
  course_description text not null,
  category text not null,
  level text not null default 'Beginner',
  duration text not null,
  thumbnail_url text,
  lessons jsonb not null default '[]'::jsonb,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  approved_by uuid references auth.users(id),
  approved_at timestamptz
);

create table if not exists public.teacher_lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.teacher_content(id) on delete cascade,
  title text not null,
  description text,
  video_url text not null,
  video_title text,
  duration text not null,
  order_index integer not null,
  resources jsonb default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Compatibility migration for older cvs schema
-- ------------------------------------------------------------

alter table public.profiles add column if not exists role text not null default 'user';
alter table public.cvs add column if not exists data jsonb not null default '{}'::jsonb;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public' and table_name = 'cvs' and column_name = 'full_name'
  ) then
    update public.cvs
    set data = jsonb_build_object(
      'id', id::text,
      'personalInfo', jsonb_build_object(
        'fullName', coalesce(full_name, ''),
        'email', coalesce(email, ''),
        'phone', coalesce(phone, ''),
        'age', coalesce(age::text, ''),
        'summary', coalesce(summary, ''),
        'profilePhoto', coalesce(photo_url, '')
      ),
      'education', coalesce(education, '[]'::jsonb),
      'experience', coalesce(experience, '[]'::jsonb),
      'skills', coalesce(skills, '[]'::jsonb),
      'languages', coalesce(languages, '[]'::jsonb),
      'templateId', coalesce(template, 'professional'),
      'createdAt', to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
      'updatedAt', to_char(updated_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
    )
    where data = '{}'::jsonb;
  end if;
end $$;

-- ------------------------------------------------------------
-- Indexes
-- ------------------------------------------------------------

create index if not exists idx_cvs_user_id on public.cvs(user_id);
create index if not exists idx_cvs_updated_at on public.cvs(updated_at desc);
create index if not exists idx_jobs_employer_id on public.jobs(employer_id);
create index if not exists idx_jobs_status on public.jobs(status);
create index if not exists idx_applications_job_id on public.applications(job_id);
create index if not exists idx_applications_user_id on public.applications(user_id);
create index if not exists idx_teacher_content_teacher_id on public.teacher_content(teacher_id);
create index if not exists idx_teacher_content_status on public.teacher_content(status);
create index if not exists idx_teacher_content_category on public.teacher_content(category);
create index if not exists idx_teacher_lessons_course_id on public.teacher_lessons(course_id);
create index if not exists idx_teacher_lessons_order on public.teacher_lessons(course_id, order_index);

-- ------------------------------------------------------------
-- Triggers / functions
-- ------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_cvs_updated_at on public.cvs;
create trigger trg_cvs_updated_at
before update on public.cvs
for each row execute function public.set_updated_at();

drop trigger if exists trg_jobs_updated_at on public.jobs;
create trigger trg_jobs_updated_at
before update on public.jobs
for each row execute function public.set_updated_at();

drop trigger if exists trg_applications_updated_at on public.applications;
create trigger trg_applications_updated_at
before update on public.applications
for each row execute function public.set_updated_at();

drop trigger if exists trg_teacher_content_updated_at on public.teacher_content;
create trigger trg_teacher_content_updated_at
before update on public.teacher_content
for each row execute function public.set_updated_at();

create or replace function public.ensure_platform_stats_row()
returns void
language plpgsql
as $$
begin
  if not exists (select 1 from public.platform_stats) then
    insert into public.platform_stats (total_cvs, total_users, total_applications)
    values (0, 0, 0);
  end if;
end;
$$;

select public.ensure_platform_stats_row();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;

  perform public.ensure_platform_stats_row();

  update public.platform_stats
  set total_users = total_users + 1,
      updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.handle_new_cv()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.ensure_platform_stats_row();

  update public.platform_stats
  set total_cvs = total_cvs + 1,
      updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_cv_created on public.cvs;
create trigger on_cv_created
after insert on public.cvs
for each row execute function public.handle_new_cv();

create or replace function public.handle_new_application()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.ensure_platform_stats_row();

  update public.platform_stats
  set total_applications = total_applications + 1,
      updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_application_created on public.applications;
create trigger on_application_created
after insert on public.applications
for each row execute function public.handle_new_application();

-- ------------------------------------------------------------
-- RLS + Policies
-- ------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.cvs enable row level security;
alter table public.jobs enable row level security;
alter table public.applications enable row level security;
alter table public.platform_stats enable row level security;
alter table public.teacher_content enable row level security;
alter table public.teacher_lessons enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "profiles_delete_own" on public.profiles;
create policy "profiles_delete_own"
  on public.profiles for delete
  using (auth.uid() = id);

drop policy if exists "cvs_select_own" on public.cvs;
create policy "cvs_select_own"
  on public.cvs for select
  using (auth.uid() = user_id);

drop policy if exists "cvs_insert_own" on public.cvs;
create policy "cvs_insert_own"
  on public.cvs for insert
  with check (auth.uid() = user_id);

drop policy if exists "cvs_update_own" on public.cvs;
create policy "cvs_update_own"
  on public.cvs for update
  using (auth.uid() = user_id);

drop policy if exists "cvs_delete_own" on public.cvs;
create policy "cvs_delete_own"
  on public.cvs for delete
  using (auth.uid() = user_id);

drop policy if exists "jobs_select_active" on public.jobs;
create policy "jobs_select_active"
  on public.jobs for select
  using (status = 'active' or auth.uid() = employer_id);

drop policy if exists "jobs_insert_own" on public.jobs;
create policy "jobs_insert_own"
  on public.jobs for insert
  with check (auth.uid() = employer_id);

drop policy if exists "jobs_update_own" on public.jobs;
create policy "jobs_update_own"
  on public.jobs for update
  using (auth.uid() = employer_id);

drop policy if exists "jobs_delete_own" on public.jobs;
create policy "jobs_delete_own"
  on public.jobs for delete
  using (auth.uid() = employer_id);

drop policy if exists "applications_select_own" on public.applications;
create policy "applications_select_own"
  on public.applications for select
  using (auth.uid() = user_id);

drop policy if exists "applications_select_employer" on public.applications;
create policy "applications_select_employer"
  on public.applications for select
  using (
    exists (
      select 1 from public.jobs
      where jobs.id = applications.job_id
      and jobs.employer_id = auth.uid()
    )
  );

drop policy if exists "applications_insert_own" on public.applications;
create policy "applications_insert_own"
  on public.applications for insert
  with check (auth.uid() = user_id);

drop policy if exists "applications_update_own" on public.applications;
create policy "applications_update_own"
  on public.applications for update
  using (auth.uid() = user_id);

drop policy if exists "applications_update_employer" on public.applications;
create policy "applications_update_employer"
  on public.applications for update
  using (
    exists (
      select 1 from public.jobs
      where jobs.id = applications.job_id
      and jobs.employer_id = auth.uid()
    )
  );

drop policy if exists "stats_select_all" on public.platform_stats;
create policy "stats_select_all"
  on public.platform_stats for select
  using (true);

drop policy if exists "Teachers can create content" on public.teacher_content;
create policy "Teachers can create content" on public.teacher_content
  for insert to authenticated
  with check (auth.uid() = teacher_id);

drop policy if exists "Teachers can view own content" on public.teacher_content;
create policy "Teachers can view own content" on public.teacher_content
  for select to authenticated
  using (auth.uid() = teacher_id);

drop policy if exists "Teachers can update own pending content" on public.teacher_content;
create policy "Teachers can update own pending content" on public.teacher_content
  for update to authenticated
  using (auth.uid() = teacher_id and status = 'pending');

drop policy if exists "Admins can view all content" on public.teacher_content;
create policy "Admins can view all content" on public.teacher_content
  for select to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

drop policy if exists "Admins can update content" on public.teacher_content;
create policy "Admins can update content" on public.teacher_content
  for update to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

drop policy if exists "Anyone can view approved content" on public.teacher_content;
create policy "Anyone can view approved content" on public.teacher_content
  for select to public
  using (status = 'approved');

drop policy if exists "Anyone can view lessons of approved courses" on public.teacher_lessons;
create policy "Anyone can view lessons of approved courses" on public.teacher_lessons
  for select to public
  using (
    exists (
      select 1
      from public.teacher_content
      where teacher_content.id = teacher_lessons.course_id
      and teacher_content.status = 'approved'
    )
  );

drop policy if exists "Teachers can manage own lessons" on public.teacher_lessons;
create policy "Teachers can manage own lessons" on public.teacher_lessons
  for all to authenticated
  using (
    exists (
      select 1
      from public.teacher_content
      where teacher_content.id = teacher_lessons.course_id
      and teacher_content.teacher_id = auth.uid()
    )
  );
