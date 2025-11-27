'use server'

import axios from '@/lib/axios-client'
import { createClient } from '@/utils/supabase/server'
import type { Provider } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { I_StatePayload } from '../_types'

export const validateCaseName = async (
  casename: string
): Promise<boolean | null> => {
  return axios
    .get<I_AxiosResponse<boolean>>('/api/casenames', {
      headers: {
        'X-API-KEY': process.env.API_KEY!,
      },
      params: {
        value: casename,
      },
    })
    .then(({ data }) => data.answer)
    .catch(err => {
      console.log(err)

      return null
    })
}

const createState = (statePayload: I_StatePayload): string => {
  return jwt.sign(statePayload, process.env.STATE_SECRET!, {
    algorithm: 'HS256',
    jwtid: uuidv4(),
    expiresIn: '5m',
  })
}

export const signIn = async (formData: FormData): Promise<void> => {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

/*
BEGIN
  IF COALESCE(NEW.raw_app_meta_data ->> 'provider', '') = 'email' THEN
    INSERT INTO public.profiles (id, email)
    VALUES (NEW.id, NEW.email);

    INSERT INTO public.casenames (user_id, casename)
    VALUES (NEW.id, NEW.raw_user_meta_data ->> 'casename');
  END IF;

  RETURN NEW;
END;
*/
export const signUp = async (formData: FormData): Promise<void> => {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    // Passing options to raw_user_meta_data in the provided trigger
    options: {
      data: {
        casename: formData.get('casename') as string,
      },
    },
  })

  if (!data.user || error) {
    console.log(data.user, error, formData)

    redirect('/error')
  }

  redirect('/auth/success')
}

export const signInWithOAuth = async (
  provider: Provider,
  casename?: string
): Promise<void> => {
  const supabase = await createClient()

  const state = casename
    ? createState({ casename, type: 'sign-up' })
    : createState({ type: 'sign-in' })

  const url = new URL(`${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`)
  url.searchParams.append('state', state)

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: url.toString(),
    },
  })

  if (error) {
    console.log(error)
  }

  if (!data.url) {
    return
  }

  redirect(data.url)
}

export const resetPassword = async (formData: FormData) => {
  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(
    formData.get('email') as string
  )

  if (error) {
    redirect('/error')
  }

  redirect('/auth/success')
}

export const updatePassword = async (formData: FormData) => {
  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    password: formData.get('password') as string,
  })

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
