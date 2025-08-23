'use server'

import { createAdminClient } from '@/utils/supabase/admin'

export const getCasename = async (
  casename: string
): Promise<boolean | null> => {
  const supabase = await createAdminClient()

  const { data, error } = await supabase
    .from('profiles')
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
