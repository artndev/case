CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  IF COALESCE(NEW.raw_app_meta_data ->> 'provider', '') = 'email' THEN
    INSERT INTO public.profiles (id, email, casename)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'casename');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
