-- Fix UPDATE statements that require WHERE clause
-- This script fixes the trigger functions that were updating platform_stats without WHERE clauses

-- Drop and recreate the handle_new_user function with proper WHERE clause
drop function if exists public.handle_new_user() cascade;

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
      updated_at = now()
  where id = (select id from public.platform_stats limit 1);

  return new;
end;
$$;

-- Drop and recreate the handle_new_cv function with proper WHERE clause
drop function if exists public.handle_new_cv() cascade;

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
      updated_at = now()
  where id = (select id from public.platform_stats limit 1);
  
  return new;
end;
$$;

-- Drop and recreate the handle_new_application function with proper WHERE clause
drop function if exists public.handle_new_application() cascade;

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
      updated_at = now()
  where id = (select id from public.platform_stats limit 1);
  
  return new;
end;
$$;

-- Recreate the triggers
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

drop trigger if exists on_cv_created on public.cvs;
create trigger on_cv_created
after insert on public.cvs
for each row execute function public.handle_new_cv();

drop trigger if exists on_application_created on public.applications;
create trigger on_application_created
after insert on public.applications
for each row execute function public.handle_new_application();

-- Also fix the compatibility migration UPDATE statement if it exists
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
