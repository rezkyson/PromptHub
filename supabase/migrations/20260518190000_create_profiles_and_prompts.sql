create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.generate_username_from_email(email text, user_id uuid)
returns text
language plpgsql
stable
as $$
declare
  base_username text;
  candidate_username text;
begin
  base_username := lower(
    regexp_replace(
      split_part(coalesce(email, 'user'), '@', 1),
      '[^a-z0-9_]+',
      '_',
      'g'
    )
  );

  base_username := trim(both '_' from base_username);

  if base_username = '' then
    base_username := 'user';
  end if;

  if char_length(base_username) < 3 then
    base_username := 'user_' || replace(user_id::text, '-', '');
  end if;

  candidate_username := left(base_username, 40);

  if exists(select 1 from public.profiles where username = candidate_username) then
    candidate_username := left(base_username, 7) || '_' || replace(user_id::text, '-', '');
  end if;

  return candidate_username;
end;
$$;

create or replace function public.are_prompt_tags_valid(tag_list text[])
returns boolean
language sql
immutable
as $$
  select coalesce(
    bool_and(char_length(tag) <= 30 and btrim(tag) <> ''),
    true
  )
  from unnest(tag_list) as tag;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_length_check
    check (username is null or char_length(username) between 3 and 40),
  constraint profiles_bio_length_check
    check (bio is null or char_length(bio) <= 300)
);

create table if not exists public.prompts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  category text not null,
  tags text[] not null default '{}',
  content text not null,
  visibility text not null default 'private',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint prompts_title_length_check
    check (char_length(title) between 3 and 100),
  constraint prompts_description_length_check
    check (description is null or char_length(description) <= 300),
  constraint prompts_category_check
    check (
      category in (
        'Programming',
        'Writing',
        'Marketing',
        'Business',
        'Education',
        'Design',
        'Image Generation',
        'Productivity',
        'Social Media',
        'Other'
      )
    ),
  constraint prompts_tags_count_check
    check (cardinality(tags) <= 5),
  constraint prompts_tags_length_check
    check (public.are_prompt_tags_valid(tags)),
  constraint prompts_content_length_check
    check (char_length(content) between 10 and 10000),
  constraint prompts_visibility_check
    check (visibility in ('public', 'private'))
);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_prompts_updated_at on public.prompts;
create trigger set_prompts_updated_at
before update on public.prompts
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    public.generate_username_from_email(new.email, new.id),
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      new.raw_user_meta_data ->> 'full_name'
    )
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

create index if not exists prompts_user_id_idx on public.prompts(user_id);
create index if not exists prompts_visibility_idx on public.prompts(visibility);
create index if not exists prompts_created_at_idx on public.prompts(created_at desc);
create index if not exists prompts_category_idx on public.prompts(category);
create unique index if not exists profiles_username_lower_idx
on public.profiles(lower(username))
where username is not null;

grant usage on schema public to anon, authenticated;
grant select on public.profiles to anon, authenticated;
grant insert, update on public.profiles to authenticated;
grant select on public.prompts to anon, authenticated;
grant insert, update, delete on public.prompts to authenticated;

alter table public.profiles enable row level security;
alter table public.prompts enable row level security;

drop policy if exists "Profiles are readable by everyone" on public.profiles;
create policy "Profiles are readable by everyone"
on public.profiles
for select
to anon, authenticated
using (true);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
on public.profiles
for insert
to authenticated
with check (id = auth.uid());

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "Public prompts and owner prompts are readable" on public.prompts;
create policy "Public prompts and owner prompts are readable"
on public.prompts
for select
to anon, authenticated
using (visibility = 'public' or user_id = auth.uid());

drop policy if exists "Users can insert their own prompts" on public.prompts;
create policy "Users can insert their own prompts"
on public.prompts
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "Users can update their own prompts" on public.prompts;
create policy "Users can update their own prompts"
on public.prompts
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Users can delete their own prompts" on public.prompts;
create policy "Users can delete their own prompts"
on public.prompts
for delete
to authenticated
using (user_id = auth.uid());
