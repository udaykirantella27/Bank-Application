-- ============================================================
-- QIB Advanced Features — Extended Schema
-- Run this AFTER the base schema.sql
-- ============================================================

-- 6. AI Risk Scoring History
create table if not exists public.risk_assessments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  credit_score integer not null check (credit_score between 0 and 900),
  risk_level text not null check (risk_level in ('low', 'medium', 'high')),
  payment_history_score integer default 0,
  credit_utilization_score integer default 0,
  account_age_score integer default 0,
  credit_mix_score integer default 0,
  recent_inquiries_score integer default 0,
  model_name text not null default 'xgboost-v3.2.1',
  model_confidence numeric(5,2) not null default 0.00,
  assessed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.risk_assessments enable row level security;
create policy "Users can view their own risk assessments" on public.risk_assessments for select using (auth.uid() = user_id);
create policy "Admins can view all risk assessments" on public.risk_assessments for select using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));
create policy "System can insert risk assessments" on public.risk_assessments for insert with check (true);


-- 7. Real-Time Payments / Transactions
create table if not exists public.transactions (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references public.users(id) on delete set null,
  receiver_id uuid references public.users(id) on delete set null,
  amount numeric not null check (amount > 0),
  currency text not null default 'INR',
  payment_method text not null check (payment_method in ('upi_3.0', 'imps', 'rtgs', 'neft', 'auto_pay')),
  status text not null check (status in ('initiated', 'processing', 'settled', 'failed', 'reversed')),
  settlement_time_ms integer,
  reference_id text unique,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  settled_at timestamp with time zone
);

alter table public.transactions enable row level security;
create policy "Users can view their own transactions" on public.transactions for select using (auth.uid() = sender_id or auth.uid() = receiver_id);
create policy "Admins can view all transactions" on public.transactions for select using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));
create policy "Users can insert their own transactions" on public.transactions for insert with check (auth.uid() = sender_id);


-- 8. Open Banking API Keys & Consents
create table if not exists public.api_partners (
  id uuid default gen_random_uuid() primary key,
  partner_name text not null,
  client_id text unique not null,
  status text not null check (status in ('active', 'suspended', 'onboarding')) default 'onboarding',
  api_calls_today integer default 0,
  uptime_percent numeric(5,2) default 99.95,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.data_consents (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  partner_id uuid references public.api_partners(id) on delete cascade not null,
  scope text[] not null default '{}',
  status text not null check (status in ('active', 'revoked', 'expired')) default 'active',
  granted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone,
  revoked_at timestamp with time zone
);

alter table public.api_partners enable row level security;
alter table public.data_consents enable row level security;
create policy "Admins can manage API partners" on public.api_partners for all using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));
create policy "Users can view their consents" on public.data_consents for select using (auth.uid() = user_id);
create policy "Users can manage their consents" on public.data_consents for update using (auth.uid() = user_id);


-- 9. ESG / Sustainability Tracking
create table if not exists public.esg_scores (
  id uuid default gen_random_uuid() primary key,
  environmental_score integer not null check (environmental_score between 0 and 100),
  social_score integer not null check (social_score between 0 and 100),
  governance_score integer not null check (governance_score between 0 and 100),
  composite_score integer not null check (composite_score between 0 and 100),
  rating text not null check (rating in ('AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC')),
  co2_offset_tonnes numeric default 0,
  water_saved_litres numeric default 0,
  clean_energy_mw numeric default 0,
  trees_planted integer default 0,
  assessed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.green_investments (
  id uuid default gen_random_uuid() primary key,
  category text not null,
  amount numeric not null check (amount > 0),
  percentage numeric(5,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.esg_scores enable row level security;
alter table public.green_investments enable row level security;
create policy "Public ESG scores visible" on public.esg_scores for select using (true);
create policy "Public green investments visible" on public.green_investments for select using (true);


-- 10. Embedded Finance — Partner Widgets
create table if not exists public.embed_widgets (
  id uuid default gen_random_uuid() primary key,
  partner_id uuid references public.api_partners(id) on delete cascade,
  widget_type text not null check (widget_type in ('bnpl', 'credit_line', 'payment_gateway', 'kyc')),
  installs integer default 0,
  revenue numeric default 0,
  status text not null check (status in ('live', 'pilot', 'onboarding')) default 'onboarding',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.embed_widgets enable row level security;
create policy "Admins can manage widgets" on public.embed_widgets for all using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));


-- 11. Chatbot Conversations (for audit trail)
create table if not exists public.chatbot_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete set null,
  session_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.chatbot_messages (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references public.chatbot_sessions(id) on delete cascade not null,
  role text not null check (role in ('user', 'bot')),
  message text not null,
  intent text,
  confidence numeric(5,2),
  pii_detected boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.chatbot_sessions enable row level security;
alter table public.chatbot_messages enable row level security;
create policy "Users can view their own chat sessions" on public.chatbot_sessions for select using (auth.uid() = user_id);
create policy "Users can view their own chat messages" on public.chatbot_messages for select using (
  exists (select 1 from public.chatbot_sessions where id = public.chatbot_messages.session_id and user_id = auth.uid())
);
create policy "System can insert chat messages" on public.chatbot_messages for insert with check (true);
create policy "System can insert chat sessions" on public.chatbot_sessions for insert with check (true);


-- 12. Accessibility Audit Log
create table if not exists public.accessibility_audits (
  id uuid default gen_random_uuid() primary key,
  rule_name text not null,
  status text not null check (status in ('pass', 'warning', 'fail')),
  score numeric(5,2),
  required_score numeric(5,2),
  audited_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.accessibility_audits enable row level security;
create policy "Public accessibility audits" on public.accessibility_audits for select using (true);
