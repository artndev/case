CREATE TABLE public.profiles (
  id UUID NOT NULL,
  email VARCHAR NULL,
  created_at TIMESTAMPTZ NULL DEFAULT now(),
  casename VARCHAR NULL,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_casename_key UNIQUE (casename),
  CONSTRAINT profiles_email_key UNIQUE (email),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE
) TABLESPACE pg_default;
