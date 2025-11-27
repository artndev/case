'use server'

import { createClient } from '@/utils/supabase/server'

export const getCasename = async (
  casename: string
): Promise<boolean | null> => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('casenames')
    .select('casename')
    .eq('casename', casename)
    .maybeSingle()

  if (error) {
    console.log('Error has occurred while fetching casename', error)
    return null
  }

  console.log('Casename has been got successfully')
  return !!data
}
