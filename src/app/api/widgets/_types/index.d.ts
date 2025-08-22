import { T_saveWidgets_body_widget } from '../_validations'
import { WidgetSizes, WidgetTypes } from './config'

export type T_WidgetSize = (typeof WidgetSizes)[number]

export type T_WidgetType = (typeof WidgetTypes)[number]

export interface I_Widget {
  id: string
  user_id: string
  x: number
  y: number
  size: T_WidgetSize
  widget_type: I_WidgetType
  created_at: string
}

export interface I_WidgetAPI extends T_saveWidgets_body_widget {}

export interface I_WidgetType {
  id: string
  widget_type: T_WidgetType
  alias: string
  created_at: string
}

export interface I_WidgetTypeAPI
  extends PartialKeys<Omit<I_WidgetType, 'created_at'>, 'id'> {}
