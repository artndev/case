create table public.widget_types (
  id uuid not null,
  widget_type character varying not null,
  created_at timestamp with time zone null default now(),
  constraint widget_types_pkey primary key (id),
  constraint widget_types_id_fkey foreign KEY (id) references widgets (id) on delete CASCADE
) TABLESPACE pg_default;