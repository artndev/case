'use server'

import { createClient } from '@/utils/supabase/server'
import { v4 as uuidv4 } from 'uuid'

export const saveWidgets = async (
  widgets: N_Widgets_API.I_Widget[]
): Promise<boolean | null> => {
  const supabase = await createClient()

  // If row exist, provided id will be overlapped
  const { error } = await supabase
    .from('widgets')
    .upsert([...widgets.map(wgt => ({ id: uuidv4(), ...wgt }))])

  if (error) {
    console.log('Error has occurred while saving widgets', error)
    return null
  }

  console.log('Widgets have been saved successfully')
  return true
}

export const getWidgets = async (
  id?: string | null
): Promise<N_Widgets_API.I_Widget[] | null> => {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.log('Error has occurred while fetching widgets', userError)
    return null
  }

  //// RLS automatically adjusts all filters
  const { data, error: selectError } = await supabase
    .from('widgets')
    .select(
      `
      *,
      widget_type_details:widget_types!widgets_widget_type_id_fkey (
        alias,
        widget_type
      )  
    `
    )
    .eq('user_id', id ?? user.id)

  if (selectError) {
    console.log('Error has occurred while fetching widgets', selectError)
    return null
  }

  console.log('Widgets have been got successfully')
  return data
}

export const deleteWidget = async (id: string): Promise<boolean | null> => {
  const supabase = await createClient()

  const { error } = await supabase.from('widgets').delete().eq('id', id)

  if (error) {
    console.log('Error has occurred while deleting widget', error)
    return null
  }

  console.log('Widget has been deleted successfully')
  return true
}
