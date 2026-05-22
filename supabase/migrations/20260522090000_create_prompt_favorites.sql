create table if not exists public.prompt_favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  prompt_id uuid not null references public.prompts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, prompt_id)
);

create index if not exists prompt_favorites_user_created_at_idx
on public.prompt_favorites(user_id, created_at desc);

create index if not exists prompt_favorites_prompt_id_idx
on public.prompt_favorites(prompt_id);

grant select, insert, delete on public.prompt_favorites to authenticated;

alter table public.prompt_favorites enable row level security;

drop policy if exists "Users can read their own favorites" on public.prompt_favorites;
create policy "Users can read their own favorites"
on public.prompt_favorites
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Users can favorite public prompts" on public.prompt_favorites;
create policy "Users can favorite public prompts"
on public.prompt_favorites
for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.prompts
    where prompts.id = prompt_favorites.prompt_id
      and prompts.visibility = 'public'
  )
);

drop policy if exists "Users can delete their own favorites" on public.prompt_favorites;
create policy "Users can delete their own favorites"
on public.prompt_favorites
for delete
to authenticated
using (user_id = auth.uid());
