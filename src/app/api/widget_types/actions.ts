'use server'

import { createClient } from '@/utils/supabase/server'
import { I_WidgetType } from './_types'

export const getWidgetTypes = async (): Promise<I_WidgetType[] | null> => {
  const supabase = await createClient()

  const { data, error } = await supabase.from('widget_types').select('*')

  if (error) {
    console.log('Error has occurred while fetching widget types', error)
    return null
  }

  console.log('Widget types have been got successfully')
  return data
}
