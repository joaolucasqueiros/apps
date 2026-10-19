create table public.learning_states (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null check (jsonb_typeof(payload) = 'object' and payload->>'version' = '1'),
  version bigint not null default 1 check (version > 0),
  updated_at timestamptz not null default now()
);
alter table public.learning_states enable row level security;
create policy "Read own learning state" on public.learning_states for select to authenticated using ((select auth.uid()) = user_id);
create policy "Insert own learning state" on public.learning_states for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own learning state" on public.learning_states for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
grant select, insert, update on public.learning_states to authenticated;
revoke all on public.learning_states from anon;

create function public.sync_learning_state(expected_version bigint, in_payload jsonb)
returns void language plpgsql security invoker set search_path = '' as $$
declare affected integer;
begin
  if auth.uid() is null then raise exception 'authentication_required'; end if;
  if jsonb_typeof(in_payload) <> 'object' or in_payload->>'version' is distinct from '1' then raise exception 'invalid_payload'; end if;
  if expected_version = 0 then
    insert into public.learning_states(user_id,payload,version)
    values(auth.uid(),in_payload,1) on conflict(user_id) do nothing;
  else
    update public.learning_states set payload=in_payload, version=version+1, updated_at=now()
    where user_id=auth.uid() and version=expected_version;
  end if;
  get diagnostics affected = row_count;
  if affected = 0 then raise exception 'sync_conflict'; end if;
end; $$;
revoke all on function public.sync_learning_state(bigint,jsonb) from public;
grant execute on function public.sync_learning_state(bigint,jsonb) to authenticated;
