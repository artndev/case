'use server'

import axios from '@/lib/axios'
import { createClient } from '@/utils/supabase/server'
import type { Provider } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { I_AxiosResponse, I_StatePayload } from '../types'

export const validateCaseName = async (
  caseName: string
): Promise<boolean | null> => {
  return axios
    .get<I_AxiosResponse<boolean>>('/api/casenames', {
      headers: {
        'X-API-KEY': process.env.X_API_KEY!,
      },
      params: {
        value: caseName,
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

  if (error) redirect('/error')

  revalidatePath('/', 'layout')
  redirect('/')
}

export const signUp = async (formData: FormData): Promise<void> => {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    casename: formData.get('casename') as string,
  }

  const { casename, ...signUpPayload } = data
  const {
    data: { user },
    error: signUpError,
  } = await supabase.auth.signUp(signUpPayload)

  if (signUpError || !user) redirect('/error')

  const { password, ...insertPayload } = data
  const { error: insertError } = await supabase.from('profiles').insert({
    id: user.id,
    ...insertPayload,
  })

  if (insertError) redirect('/error')

  redirect('/auth/success')
}

export async function signInWithOAuth(provider: Provider, caseName?: string) {
  const supabase = await createClient()

  const state = caseName
    ? createState({ casename: caseName, type: 'sign-up' })
    : createState({ type: 'sign-in' })

  const url = new URL(`${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`)
  url.searchParams.append('state', state)

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: url.toString(),
    },
  })

  if (error) console.log(error)

  if (!data.url) return

  redirect(data.url)
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(
    formData.get('email') as string
  )

  if (error) redirect('/error')

  redirect('/auth/success')
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    password: formData.get('password') as string,
  })

  if (error) redirect('/error')

  revalidatePath('/', 'layout')
  redirect('/')
}
