import { WidgetTypes } from './config'

export type T_WidgetType = (typeof WidgetTypes)[number]

export interface I_WidgetType {
  id: string
  widget_type: T_WidgetType
  alias: string
  created_at: string
}

export interface I_WidgetTypeAPI
  extends PartialKeys<Omit<I_WidgetType, 'created_at'>, 'id'> {}
