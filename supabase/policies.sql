alter table public.boards enable row level security;
alter table public.lists enable row level security;
alter table public.cards enable row level security;
alter table public.tags enable row level security;
alter table public.card_tags enable row level security;
alter table public.board_backups enable row level security;
alter table public.board_backup_settings enable row level security;
alter table public.app_state enable row level security;

create policy "boards_select_own" on public.boards
for select using (auth.uid() = user_id);
create policy "boards_insert_own" on public.boards
for insert with check (auth.uid() = user_id);
create policy "boards_update_own" on public.boards
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "boards_delete_own" on public.boards
for delete using (auth.uid() = user_id);

create policy "lists_select_own" on public.lists
for select using (auth.uid() = user_id);
create policy "lists_insert_own" on public.lists
for insert with check (auth.uid() = user_id);
create policy "lists_update_own" on public.lists
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "lists_delete_own" on public.lists
for delete using (auth.uid() = user_id);

create policy "cards_select_own" on public.cards
for select using (auth.uid() = user_id);
create policy "cards_insert_own" on public.cards
for insert with check (auth.uid() = user_id);
create policy "cards_update_own" on public.cards
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "cards_delete_own" on public.cards
for delete using (auth.uid() = user_id);

create policy "tags_select_own" on public.tags
for select using (auth.uid() = user_id);
create policy "tags_insert_own" on public.tags
for insert with check (auth.uid() = user_id);
create policy "tags_update_own" on public.tags
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "tags_delete_own" on public.tags
for delete using (auth.uid() = user_id);

create policy "card_tags_select_own" on public.card_tags
for select using (auth.uid() = user_id);
create policy "card_tags_insert_own" on public.card_tags
for insert with check (auth.uid() = user_id);
create policy "card_tags_update_own" on public.card_tags
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "card_tags_delete_own" on public.card_tags
for delete using (auth.uid() = user_id);

create policy "board_backups_select_own" on public.board_backups
for select using (auth.uid() = user_id);
create policy "board_backups_insert_own" on public.board_backups
for insert with check (auth.uid() = user_id);
create policy "board_backups_update_own" on public.board_backups
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "board_backups_delete_own" on public.board_backups
for delete using (auth.uid() = user_id);

create policy "board_backup_settings_select_own" on public.board_backup_settings
for select using (auth.uid() = user_id);
create policy "board_backup_settings_insert_own" on public.board_backup_settings
for insert with check (auth.uid() = user_id);
create policy "board_backup_settings_update_own" on public.board_backup_settings
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "board_backup_settings_delete_own" on public.board_backup_settings
for delete using (auth.uid() = user_id);

create policy "app_state_select_own" on public.app_state
for select using (auth.uid() = user_id);
create policy "app_state_insert_own" on public.app_state
for insert with check (auth.uid() = user_id);
create policy "app_state_update_own" on public.app_state
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "app_state_delete_own" on public.app_state
for delete using (auth.uid() = user_id);
