-- Run this once in the Supabase SQL editor before using the CMS.
create extension if not exists "pgcrypto";

create table if not exists public.locales (
  code text primary key check (code in ('en-US', 'zh-HK', 'zh-CN')),
  label text not null, enabled boolean not null default true, "order" integer not null default 0
);
insert into public.locales (code, label, "order") values
  ('en-US', 'English (US)', 1), ('zh-HK', '繁體中文（香港）', 2), ('zh-CN', '简体中文', 3)
on conflict (code) do nothing;

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(), icon text not null, title jsonb not null,
  description jsonb not null, "order" integer not null default 0,
  "createdAt" timestamptz not null default now(), "updatedAt" timestamptz not null default now()
);
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(), name text not null, "propertyType" text not null,
  rating integer not null check (rating between 1 and 5), comment jsonb not null, initials text not null,
  "order" integer not null default 0, "createdAt" timestamptz not null default now(), "updatedAt" timestamptz not null default now()
);
create table if not exists public.portfolio (
  id uuid primary key default gen_random_uuid(), title jsonb not null, "propertyType" text not null,
  "budgetRange" jsonb not null, style jsonb not null, "beforeImage" text not null, "afterImage" text not null,
  cost numeric not null, description jsonb not null, "completedDate" text not null, "order" integer default 0,
  "createdAt" timestamptz not null default now(), "updatedAt" timestamptz not null default now()
);
create table if not exists public.calculator_pricing (
  id text primary key default 'pricing', "basePricePerSqft" jsonb not null, "qualityMultipliers" jsonb not null,
  "scopeMultipliers" jsonb not null, "roomBaseCosts" jsonb not null, "specialRequirementGroups" jsonb not null,
  variance numeric not null default .2, "updatedAt" timestamptz not null default now()
);
create table if not exists public.hero_stats (
  id text primary key default 'stats', stats jsonb not null default '[]'::jsonb, "updatedAt" timestamptz not null default now()
);
create table if not exists public.config_groups (
  id uuid primary key default gen_random_uuid(), name text not null unique, label text not null,
  description text, "order" integer not null default 0
);
create table if not exists public.config_items (
  id uuid primary key default gen_random_uuid(), group_id uuid not null references public.config_groups(id) on delete cascade,
  key text not null unique, value jsonb not null, label text not null, description text,
  type text not null, options jsonb, "order" integer not null default 0
);

-- Public visitors can read published content; only signed-in users can change CMS content.
alter table public.services enable row level security;
alter table public.testimonials enable row level security;
alter table public.portfolio enable row level security;
alter table public.calculator_pricing enable row level security;
alter table public.hero_stats enable row level security;
alter table public.config_groups enable row level security;
alter table public.config_items enable row level security;
alter table public.locales enable row level security;

create policy "public read services" on public.services for select using (true);
create policy "public read testimonials" on public.testimonials for select using (true);
create policy "public read portfolio" on public.portfolio for select using (true);
create policy "public read calculator" on public.calculator_pricing for select using (true);
create policy "public read hero" on public.hero_stats for select using (true);
create policy "public read config groups" on public.config_groups for select using (true);
create policy "public read config items" on public.config_items for select using (true);
create policy "public read locales" on public.locales for select using (true);
create policy "authenticated manages services" on public.services for all to authenticated using (true) with check (true);
create policy "authenticated manages testimonials" on public.testimonials for all to authenticated using (true) with check (true);
create policy "authenticated manages portfolio" on public.portfolio for all to authenticated using (true) with check (true);
create policy "authenticated manages calculator" on public.calculator_pricing for all to authenticated using (true) with check (true);
create policy "authenticated manages hero" on public.hero_stats for all to authenticated using (true) with check (true);
create policy "authenticated manages config groups" on public.config_groups for all to authenticated using (true) with check (true);
create policy "authenticated manages config items" on public.config_items for all to authenticated using (true) with check (true);
create policy "authenticated manages locales" on public.locales for all to authenticated using (true) with check (true);

create or replace function public.seed_default_config() returns void language plpgsql security definer as $$
declare company_id uuid; site_id uuid; contact_id uuid;
begin
  insert into public.config_groups (name, label, description, "order") values
    ('company', '公司資訊', '公司基本資訊設置', 1), ('site', '網站設置', '網站基本設置', 2), ('contact', '聯絡方式', '聯絡資訊設置', 3)
  on conflict (name) do nothing;
  select id into company_id from public.config_groups where name = 'company';
  select id into site_id from public.config_groups where name = 'site';
  select id into contact_id from public.config_groups where name = 'contact';
  insert into public.config_items (group_id, key, value, label, type, "order") values
    (company_id, 'company_name', '"豐進裝修工程有限公司"', '公司名稱', 'text', 1),
    (company_id, 'company_name_short', '"豐進裝修工程"', '公司簡稱', 'text', 2),
    (site_id, 'site_title', '"專業裝修工程"', '網站標題', 'text', 1),
    (contact_id, 'whatsapp_number', '"85264798033"', 'WhatsApp 號碼', 'text', 1)
  on conflict (key) do nothing;
end; $$;
