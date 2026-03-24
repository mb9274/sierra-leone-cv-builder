insert into storage.buckets (id, name, public)
values ('cvuploads', 'cvuploads', false)
on conflict (id) do nothing;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'mobile cv upload insert'
  ) then
    create policy "mobile cv upload insert"
    on storage.objects
    for insert
    to authenticated
    with check (bucket_id = 'cvuploads' and owner = auth.uid());
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'mobile cv upload read'
  ) then
    create policy "mobile cv upload read"
    on storage.objects
    for select
    to authenticated
    using (bucket_id = 'cvuploads' and owner = auth.uid());
  end if;
end $$;
