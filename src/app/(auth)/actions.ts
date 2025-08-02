'use server'

import { createClient } from '@/utils/supabase/server'
import type { Provider } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function validateCaseName(caseName: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('casename', caseName)
    .maybeSingle()

  if (error) return null

  return data
}

export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) redirect('/error')

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signUp(formData: FormData) {
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

  // no need to use revalidatePath here as user is redirected to status page
  redirect('/auth/success')
}

export async function signInWithOAuth(provider: Provider, caseName?: string) {
  const supabase = await createClient()

  const url = new URL(`${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`)
  if (caseName) url.searchParams.append('casename', caseName)

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

  const email = formData.get('email') as string

  const { error } = await supabase.auth.resetPasswordForEmail(email)

  if (error) redirect('/error')

  redirect('/auth/success')
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()

  const password = formData.get('password') as string

  const { error } = await supabase.auth.updateUser({ password: password })

  if (error) redirect('/error')

  revalidatePath('/', 'layout')
  redirect('/')
}
