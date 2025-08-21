export type T_WidgetSize = 'sm' | 'md' | 'bg'

export type T_WidgetType = 'widget-1' | 'widget-2'

export interface I_Widget {
  id: string
  user_id: string
  x: number
  y: number
  size: T_WidgetSize
  widget_type: I_WidgetType
  created_at: string
}

export interface I_WidgetType {
  id: string
  widget_type: T_WidgetType
  alias: string
  created_at: string
}
