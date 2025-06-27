-- ? can be run using sql editor
-- sync public.profiles with auth.users

-- === create ===
-- insert row into public.profiles
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (
    new.id, 
    new.raw_user_meta_data ->> 'email', 
  );
  return new;
end;
$$;

-- trigger function every time user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- === update ===
-- it is not worth to update public.profiles whenever auth.users are updated
-- because public.profiles are only used to display core values like email and id
-- which are not expected to be changed