-- Leads from the price estimator (/services/estimate). Run once in the Supabase SQL editor.
-- Only the server route writes here, with the service role key, so row level security is on with no
-- policies: the public (anon) key can neither read nor write leads.

create table if not exists public.leads (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text not null,
  business_name text not null,
  phone text not null,
  email text not null,
  start text not null,        -- now | soon | exploring, to sort follow-ups
  answers jsonb not null,     -- the eight questionnaire answers
  estimate jsonb not null     -- the ranges shown in their PDF
);

alter table public.leads enable row level security;

create index if not exists leads_created_at_idx on public.leads (created_at desc);
