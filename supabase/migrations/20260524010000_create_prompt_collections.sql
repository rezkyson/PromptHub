create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collections_name_length_check
    check (char_length(name) between 2 and 80),
  constraint collections_description_length_check
    check (description is null or char_length(description) <= 200)
);

create table if not exists public.collection_prompts (
  collection_id uuid not null references public.collections(id) on delete cascade,
  prompt_id uuid not null references public.prompts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (collection_id, prompt_id)
);

drop trigger if exists set_collections_updated_at on public.collections;
create trigger set_collections_updated_at
before update on public.collections
for each row
execute function public.set_updated_at();

create index if not exists collections_user_updated_at_idx
on public.collections(user_id, updated_at desc);

create index if not exists collection_prompts_prompt_id_idx
on public.collection_prompts(prompt_id);

grant select, insert, update, delete on public.collections to authenticated;
grant select, insert, delete on public.collection_prompts to authenticated;

alter table public.collections enable row level security;
alter table public.collection_prompts enable row level security;

drop policy if exists "Users can read their own collections" on public.collections;
create policy "Users can read their own collections"
on public.collections
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Users can create their own collections" on public.collections;
create policy "Users can create their own collections"
on public.collections
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "Users can update their own collections" on public.collections;
create policy "Users can update their own collections"
on public.collections
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Users can delete their own collections" on public.collections;
create policy "Users can delete their own collections"
on public.collections
for delete
to authenticated
using (user_id = auth.uid());

drop policy if exists "Users can read prompts in their own collections" on public.collection_prompts;
create policy "Users can read prompts in their own collections"
on public.collection_prompts
for select
to authenticated
using (
  exists (
    select 1
    from public.collections
    where collections.id = collection_prompts.collection_id
      and collections.user_id = auth.uid()
  )
);

drop policy if exists "Users can add their own prompts to their own collections" on public.collection_prompts;
create policy "Users can add their own prompts to their own collections"
on public.collection_prompts
for insert
to authenticated
with check (
  exists (
    select 1
    from public.collections
    where collections.id = collection_prompts.collection_id
      and collections.user_id = auth.uid()
  )
  and exists (
    select 1
    from public.prompts
    where prompts.id = collection_prompts.prompt_id
      and prompts.user_id = auth.uid()
  )
);

drop policy if exists "Users can remove prompts from their own collections" on public.collection_prompts;
create policy "Users can remove prompts from their own collections"
on public.collection_prompts
for delete
to authenticated
using (
  exists (
    select 1
    from public.collections
    where collections.id = collection_prompts.collection_id
      and collections.user_id = auth.uid()
  )
);
