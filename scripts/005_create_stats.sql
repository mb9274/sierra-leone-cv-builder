-- Create stats table for tracking platform metrics
create table if not exists public.platform_stats (
  id uuid primary key default gen_random_uuid(),
  total_cvs integer default 0,
  total_users integer default 0,
  total_applications integer default 0,
  updated_at timestamptz default now()
);

-- Insert initial row
insert into public.platform_stats (total_cvs, total_users, total_applications)
values (2847, 1523, 456)
on conflict do nothing;

-- Enable RLS (allow everyone to read stats)
alter table public.platform_stats enable row level security;

create policy "stats_select_all"
  on public.platform_stats for select
  using (true);
