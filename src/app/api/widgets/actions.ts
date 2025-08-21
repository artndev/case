'use server'

import { createClient } from '@/utils/supabase/server'
import { I_Widget } from './_types'

export const saveWidgets = async (
  userId: string,
  widgets: PartialKeys<
    Omit<I_Widget, 'user_id' | 'widget_type' | 'created_at'>,
    'id'
  >[]
): Promise<void> => {
  const supabase = await createClient()

  const { error } = await supabase
    .from('widgets')
    .upsert([...widgets.map(wgt => ({ user_id: userId, ...wgt }))])

  if (error) {
    console.log('Error has occurred while saving widgets', error)
    return
  }

  console.log('Widgets have been saved successfully', widgets)
}

export const getWidgets = async (): Promise<I_Widget[] | null> => {
  const supabase = await createClient()

  // RLS automatically adjusts all filters
  const { data, error } = await supabase.from('widgets').select(
    `
      *,
      widget_type_details:widget_types!widgets_widget_type_id_fkey (
        alias,
        widget_type
      )  
    `
  )

  if (error) {
    console.log('Error has occurred while fetching widgets', error)
    return null
  }

  return data
}

export const deleteWidget = async (widgetId: string): Promise<void> => {
  const supabase = await createClient()

  const { error } = await supabase.from('widgets').delete().eq('id', widgetId)

  if (error) {
    console.log('Error has occurred while deleting widget', error)
    return
  }

  console.log('Widget has been deleted successfully')
}
