create table public.profiles (
  id uuid not null default gen_random_uuid (),
  email character varying null,
  created_at timestamp with time zone null default now(),
  casename character varying null,
  constraint profiles_pkey primary key (id),
  constraint profiles_casename_key unique (casename),
  constraint profiles_email_key unique (email)
) TABLESPACE pg_default;