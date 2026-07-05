create extension if not exists pgcrypto;

create table if not exists public.boards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  board_id uuid not null references public.boards(id) on delete cascade,
  title text not null,
  archived boolean not null default false,
  locked boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  board_id uuid not null references public.boards(id) on delete cascade,
  list_id uuid not null references public.lists(id) on delete cascade,
  title text not null,
  comment text not null default '',
  due_at timestamptz,
  done boolean not null default false,
  archived boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text not null default '#2563eb',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.card_tags (
  user_id uuid not null references auth.users(id) on delete cascade,
  card_id uuid not null references public.cards(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  deleted_at timestamptz,
  primary key (card_id, tag_id)
);

create table if not exists public.board_backups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  board_id uuid not null references public.boards(id) on delete cascade,
  board_title text not null,
  reason text not null default 'Board backup',
  snapshot jsonb not null,
  snapshot_hash text not null,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.board_backup_settings (
  board_id uuid primary key references public.boards(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  enabled boolean not null default false,
  frequency text not null default 'weekly' check (frequency in ('daily', 'interval', 'weekly', 'monthly')),
  interval_days integer not null default 7 check (interval_days between 1 and 365),
  day_of_week integer not null default 1 check (day_of_week between 0 and 6),
  day_of_month integer not null default 1 check (day_of_month between 1 and 31),
  last_auto_backup_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.app_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  active_board_id uuid references public.boards(id) on delete set null,
  theme text not null default 'light' check (theme in ('light', 'dark')),
  updated_at timestamptz not null default now()
);

create index if not exists boards_user_sort_idx on public.boards (user_id, sort_order);
create index if not exists lists_board_sort_idx on public.lists (board_id, sort_order);
create index if not exists cards_list_sort_idx on public.cards (list_id, sort_order);
create index if not exists cards_user_due_idx on public.cards (user_id, due_at);
create index if not exists tags_user_sort_idx on public.tags (user_id, sort_order);
create index if not exists board_backups_board_created_idx on public.board_backups (board_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_boards_updated_at on public.boards;
create trigger set_boards_updated_at
before update on public.boards
for each row execute function public.set_updated_at();

drop trigger if exists set_lists_updated_at on public.lists;
create trigger set_lists_updated_at
before update on public.lists
for each row execute function public.set_updated_at();

drop trigger if exists set_cards_updated_at on public.cards;
create trigger set_cards_updated_at
before update on public.cards
for each row execute function public.set_updated_at();

drop trigger if exists set_tags_updated_at on public.tags;
create trigger set_tags_updated_at
before update on public.tags
for each row execute function public.set_updated_at();

drop trigger if exists set_board_backup_settings_updated_at on public.board_backup_settings;
create trigger set_board_backup_settings_updated_at
before update on public.board_backup_settings
for each row execute function public.set_updated_at();

drop trigger if exists set_app_state_updated_at on public.app_state;
create trigger set_app_state_updated_at
before update on public.app_state
for each row execute function public.set_updated_at();
