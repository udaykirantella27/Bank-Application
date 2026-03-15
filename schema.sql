-- Drop existing tables (if re-running script)
drop table if exists public.loan_status cascade;
drop table if exists public.documents cascade;
drop table if exists public.loan_applications cascade;
drop table if exists public.users cascade;

-- 1. Create custom users table extending auth.users
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  phone text,
  role text not null check (role in ('customer', 'admin')) default 'customer',
  name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for users
alter table public.users enable row level security;

create policy "Public users viewable by everyone." on public.users for select using (true);
create policy "Users can insert their own profile." on public.users for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.users for update using (auth.uid() = id);

-- Trigger to automatically create a user record when a new user signs up in auth.users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', coalesce(new.raw_user_meta_data->>'role', 'customer'));
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. Create loan_applications table
create table public.loan_applications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  loan_amount numeric not null,
  loan_purpose text not null,
  employment_type text not null,
  monthly_salary numeric not null,
  status text not null check (status in ('pending', 'approved', 'rejected')) default 'pending',
  term_months integer not null default 12, -- Keeping term_months as it might be useful, but adapting to user requirements
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.loan_applications enable row level security;

create policy "Customers can view their own applications" on public.loan_applications for select using (auth.uid() = user_id);
create policy "Admins can view all applications" on public.loan_applications for select using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));
create policy "Customers can insert their own applications" on public.loan_applications for insert with check (auth.uid() = user_id);
create policy "Admins can update application status" on public.loan_applications for update using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- 3. Create loan_status tracking table
create table public.loan_status (
  id uuid default gen_random_uuid() primary key,
  loan_id uuid references public.loan_applications(id) on delete cascade not null,
  status text not null check (status in ('pending', 'approved', 'rejected')),
  updated_by uuid references public.users(id),
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.loan_status enable row level security;
create policy "Users can view their own loan historical statuses" on public.loan_status for select using (
  exists (select 1 from public.loan_applications where id = public.loan_status.loan_id and user_id = auth.uid())
  or exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);
create policy "Admins can insert status history" on public.loan_status for insert with check (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  or (auth.uid() = updated_by and status = 'pending') -- Allows initial pending status on creation
);

-- Trigger to log loan_status changes automatically on insert/update of loan_applications
create or replace function public.log_loan_status_change()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') or (TG_OP = 'UPDATE' and old.status is distinct from new.status) then
    insert into public.loan_status (loan_id, status, updated_by)
    values (new.id, new.status, auth.uid());
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_loan_status_change
  after insert or update on public.loan_applications
  for each row execute procedure public.log_loan_status_change();


-- 4. Create documents table
create table public.documents (
  id uuid default gen_random_uuid() primary key,
  loan_id uuid references public.loan_applications(id) on delete cascade not null,
  document_type text not null,
  file_url text not null,
  file_name text not null,
  uploaded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.documents enable row level security;
create policy "Customers can view their own documents" on public.documents for select using (
  exists (select 1 from public.loan_applications where id = public.documents.loan_id and user_id = auth.uid())
);
create policy "Admins can view all documents" on public.documents for select using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));
create policy "Customers can insert documents" on public.documents for insert with check (
  exists (select 1 from public.loan_applications where id = public.documents.loan_id and user_id = auth.uid())
);

-- 5. Storage policies
insert into storage.buckets (id, name, public) values ('documents', 'documents', false) on conflict do nothing;
-- Storage policies handled similarly. Note: user needs to execute this via supabase dashboard if bucket already exists.
