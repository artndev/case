'use server'

import { createClient } from '@/utils/supabase/server'

export const getTrack = async (trackname: string): Promise<string | null> => {
  const supabase = await createClient()

  const { data, error } = await supabase.storage
    .from('music')
    .createSignedUrl(trackname, 3600)

  if (error) {
    console.log('Error has occurred while fetching track', error)
    return null
  }

  console.log('Track has been got successfully')
  return data.signedUrl
}
