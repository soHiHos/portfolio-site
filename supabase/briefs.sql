-- Project briefs from the contact form (home, about, projects and services pages). Run once in the Supabase SQL editor.
-- Only the server route (/api/lead, kind "brief") writes here, with a secret key, so row level security is on with
-- no policies: the public (publishable) key can neither read nor write briefs.

create table if not exists public.briefs (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text not null default '',
  whatsapp text not null default '',
  email text not null default '',
  services text[] not null default '{}',   -- ids from the services page categories
  timeline text not null default '',
  message text not null,
  consent boolean not null                 -- agreed to be contacted and to the details being stored
);

alter table public.briefs enable row level security;

create index if not exists briefs_created_at_idx on public.briefs (created_at desc);
