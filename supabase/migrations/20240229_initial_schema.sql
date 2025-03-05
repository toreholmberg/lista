-- Create tables
create table public.items (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  essential boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users(id) on delete cascade not null
);

create table public.lists (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users(id) on delete cascade not null
);

create table public.list_items (
  list_id uuid references public.lists(id) on delete cascade not null,
  item_id uuid references public.items(id) on delete cascade not null,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (list_id, item_id)
);

-- Enable RLS
alter table public.items enable row level security;
alter table public.lists enable row level security;
alter table public.list_items enable row level security;

-- Create policies
create policy "Users can view their own items"
  on public.items for select
  using (auth.uid() = created_by);

create policy "Users can insert their own items"
  on public.items for insert
  with check (auth.uid() = created_by);

create policy "Users can update their own items"
  on public.items for update
  using (auth.uid() = created_by);

create policy "Users can delete their own items"
  on public.items for delete
  using (auth.uid() = created_by);

create policy "Users can view their own lists"
  on public.lists for select
  using (auth.uid() = created_by);

create policy "Users can insert their own lists"
  on public.lists for insert
  with check (auth.uid() = created_by);

create policy "Users can update their own lists"
  on public.lists for update
  using (auth.uid() = created_by);

create policy "Users can delete their own lists"
  on public.lists for delete
  using (auth.uid() = created_by);

create policy "Users can view list items for their lists"
  on public.list_items for select
  using (
    exists (
      select 1 from public.lists
      where id = list_id and created_by = auth.uid()
    )
  );

create policy "Users can insert list items to their lists"
  on public.list_items for insert
  with check (
    exists (
      select 1 from public.lists
      where id = list_id and created_by = auth.uid()
    )
  );

create policy "Users can update list items in their lists"
  on public.list_items for update
  using (
    exists (
      select 1 from public.lists
      where id = list_id and created_by = auth.uid()
    )
  );

create policy "Users can delete list items from their lists"
  on public.list_items for delete
  using (
    exists (
      select 1 from public.lists
      where id = list_id and created_by = auth.uid()
    )
  ); 