-- custom fields can be added to public.profiles without dealing with auth.users
create table public.profiles (
  id uuid not null,
  email character varying null,
  created_at timestamp with time zone null default now(),
  constraint profiles_pkey primary key (id),
  constraint profiles_email_key unique (email),
  constraint profiles_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE -- row will be deleted if one in auth.users is deleted
) TABLESPACE pg_default;