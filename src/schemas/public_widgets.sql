create table public.widgets (
  "userId" uuid not null,
  size character varying not null,
  x bigint not null,
  y bigint not null,
  created_at timestamp with time zone null default now(),
  id uuid not null default gen_random_uuid (),
  constraint widgets_pkey primary key (id),
  constraint widgets_userId_fkey foreign KEY ("userId") references profiles (id) on delete CASCADE
) TABLESPACE pg_default;