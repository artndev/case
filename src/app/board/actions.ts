import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'

export type T_WidgetSize = 'sm' | 'md' | 'bg'

export type T_WidgetType = 'widget-1' | 'widget-2'

export interface I_Widget {
  id: string
  user_id: string
  x: number
  y: number
  size: T_WidgetSize
  created_at: string
}

export interface I_WidgetType {
  id: string
  widget_type: T_WidgetType
  created_at: string
}

export const saveWidgets = async (
  userId: string,
  widgets: PartialKeys<Omit<I_Widget, 'user_id' | 'created_at'>, 'id'>[],
  client?:
    | ReturnType<typeof createClient>
    | ReturnType<typeof createAdminClient>
): Promise<void> => {
  const supabase = await (client ? Promise.resolve(client) : createClient())

  const { error } = await supabase
    .from('widgets')
    .upsert([...widgets.map(wgt => ({ user_id: userId, ...wgt }))])

  if (error) {
    console.log('Error has occurred while saving widgets', error)
    return
  }

  console.log('Widgets have been saved successfully', widgets)
}

export const saveWidgetType = async (
  widgetType: Omit<I_WidgetType, 'created_at'>,
  client?:
    | ReturnType<typeof createClient>
    | ReturnType<typeof createAdminClient>
): Promise<boolean | null> => {
  const supabase = await (client ? Promise.resolve(client) : createClient())

  const { data, error: selectError } = await supabase
    .from('widgets')
    .select('id')
    .eq('id', widgetType.id)
    .maybeSingle()

  if (selectError) {
    console.log('Error has occurred while fetching widget info', selectError)
    return null
  }

  if (!data) {
    console.log('There is no widget with this id')
    return false
  }

  const { error: insertError } = await supabase
    .from('widget_types')
    .insert({ ...widgetType })

  if (insertError) {
    console.log('Error has occurred while saving widget type', insertError)
    return null
  }

  console.log('Widget type has been saved successfully', widgetType)
  return true
}

export const saveWidgetTypes = async (
  widgetTypes: Omit<I_WidgetType, 'created_at'>[],
  client?:
    | ReturnType<typeof createClient>
    | ReturnType<typeof createAdminClient>
): Promise<void> => {
  const supabase = await (client ? Promise.resolve(client) : createClient())

  loop: for (const widgetType of widgetTypes) {
    const res = await saveWidgetType(widgetType, supabase)

    if (!res) {
      console.log(`Failed to save widget type with id: ${widgetType.id}`)
      break loop
    }
  }

  console.log('All widget types have been saved successfully')
}

export const getWidgets = async (
  userId: string,
  client?:
    | ReturnType<typeof createClient>
    | ReturnType<typeof createAdminClient>
): Promise<I_Widget[] | []> => {
  const supabase = await (client ? Promise.resolve(client) : createClient())

  const { data, error } = await supabase
    .from('widgets')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    console.log('Error has occurred while fetching widgets', error)
    return []
  }

  return data
}

export const getWidgetType = async (
  widgetId: string,
  client?:
    | ReturnType<typeof createClient>
    | ReturnType<typeof createAdminClient>
): Promise<I_WidgetType | null> => {
  const supabase = await (client ? Promise.resolve(client) : createClient())

  const { data, error } = await supabase
    .from('widget_types')
    .select('*')
    .eq('id', widgetId)
    .maybeSingle()

  if (error) {
    console.log('Error has occurred while fetching widget types', error)
    return null
  }

  return data
}
