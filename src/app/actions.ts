import jwt from 'jsonwebtoken'
import { I_StatePayload } from './types'
import { createAdminClient } from '@/utils/supabase/admin'

export const verifyState = (state: string): I_StatePayload | null => {
  try {
    return jwt.verify(state, process.env.STATE_SECRET!) as I_StatePayload
  } catch (err) {
    return null
  }
}

export const checkUser = async (id: string): Promise<boolean | null> => {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', id)
    .maybeSingle()

  if (error) return null

  return data ? true : false
}
