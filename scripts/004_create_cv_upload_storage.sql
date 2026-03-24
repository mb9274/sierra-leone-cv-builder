-- Create the bucket used by the CV upload route.
insert into storage.buckets (id, name, public)
values ('cv-uploads', 'cv-uploads', false)
on conflict (id) do nothing;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'users can upload own files'
  ) then
    create policy "users can upload own files"
    on storage.objects
    for insert
    to authenticated
    with check (bucket_id = 'cv-uploads' and owner = auth.uid());
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'users can read own files'
  ) then
    create policy "users can read own files"
    on storage.objects
    for select
    to authenticated
    using (bucket_id = 'cv-uploads' and owner = auth.uid());
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'users can delete own files'
  ) then
    create policy "users can delete own files"
    on storage.objects
    for delete
    to authenticated
    using (bucket_id = 'cv-uploads' and owner = auth.uid());
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'users can update own files'
  ) then
    create policy "users can update own files"
    on storage.objects
    for update
    to authenticated
    using (bucket_id = 'cv-uploads' and owner = auth.uid())
    with check (bucket_id = 'cv-uploads' and owner = auth.uid());
  end if;
end $$;
