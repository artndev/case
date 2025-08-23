import {
  T_saveWidgets_body_widget,
  T_getWidgets_widget_type_id,
} from '../_validations'
import { WidgetSizes } from './config'
import { T_WidgetType } from '@/app/api/widget_types/_types'

export type T_WidgetSize = (typeof WidgetSizes)[number]

export interface I_Widget {
  id: string
  user_id: string
  x: number
  y: number
  size: T_WidgetSize
  widget_type_id: string
  widget_type_details: {
    alias: string
    widget_type: T_WidgetType
  }
  created_at: string
}

export interface I_WidgetAPI extends T_saveWidgets_body_widget {}
