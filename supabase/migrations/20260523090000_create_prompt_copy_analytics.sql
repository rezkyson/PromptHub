alter table public.prompts
add column if not exists copy_count integer not null default 0;

alter table public.prompts
drop constraint if exists prompts_copy_count_check;

alter table public.prompts
add constraint prompts_copy_count_check
check (copy_count >= 0);

create table if not exists public.prompt_copies (
  user_id uuid not null references public.profiles(id) on delete cascade,
  prompt_id uuid not null references public.prompts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, prompt_id)
);

create index if not exists prompt_copies_prompt_created_at_idx
on public.prompt_copies(prompt_id, created_at desc);

create index if not exists prompt_copies_user_created_at_idx
on public.prompt_copies(user_id, created_at desc);

update public.prompts
set copy_count = coalesce(copy_totals.total, 0)
from (
  select prompt_id, count(*)::integer as total
  from public.prompt_copies
  group by prompt_id
) as copy_totals
where prompts.id = copy_totals.prompt_id;

grant select on public.prompt_copies to authenticated;

alter table public.prompt_copies enable row level security;

drop policy if exists "Users can read their own copy history" on public.prompt_copies;
create policy "Users can read their own copy history"
on public.prompt_copies
for select
to authenticated
using (user_id = auth.uid());

create or replace function public.record_prompt_copy(target_prompt_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_count integer;
begin
  if auth.uid() is null then
    return false;
  end if;

  if not exists (
    select 1
    from public.prompts
    where prompts.id = target_prompt_id
      and (
        prompts.visibility = 'public'
        or prompts.user_id = auth.uid()
      )
  ) then
    return false;
  end if;

  insert into public.prompt_copies (user_id, prompt_id)
  values (auth.uid(), target_prompt_id)
  on conflict (user_id, prompt_id) do nothing;

  get diagnostics inserted_count = row_count;

  if inserted_count = 1 then
    update public.prompts
    set copy_count = copy_count + 1
    where id = target_prompt_id;

    return true;
  end if;

  return false;
end;
$$;

grant execute on function public.record_prompt_copy(uuid) to authenticated;
