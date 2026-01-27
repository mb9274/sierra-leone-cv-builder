-- Auto-create profile on signup
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

  -- Update platform stats
  update public.platform_stats
  set total_users = total_users + 1,
      updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Update stats when CV is created
create or replace function public.handle_new_cv()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.platform_stats
  set total_cvs = total_cvs + 1,
      updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_cv_created on public.cvs;

create trigger on_cv_created
  after insert on public.cvs
  for each row
  execute function public.handle_new_cv();

-- Update stats when application is created
create or replace function public.handle_new_application()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.platform_stats
  set total_applications = total_applications + 1,
      updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_application_created on public.applications;

create trigger on_application_created
  after insert on public.applications
  for each row
  execute function public.handle_new_application();
