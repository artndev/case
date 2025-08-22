import { T_saveWidgets_body_widget } from '../_validations'
import { WidgetSizes } from './config'

export type T_WidgetSize = (typeof WidgetSizes)[number]

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
