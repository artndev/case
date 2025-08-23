import {
  I_WidgetAPI,
  I_Widget as I_Widget_original,
  T_WidgetSize as T_WidgetSize_original,
} from '@/app/api/widgets/_types'
import {
  I_WidgetTypeAPI,
  T_WidgetType as T_WidgetType_original,
} from '@/app/api/widget_types/_types'
import {
  T_deleteWidget_id,
  T_saveWidgets_body,
} from '@/app/api/widgets/_validations'

export type T_WidgetType = T_WidgetType_original

export interface I_WidgetType extends RequiredKeys<I_WidgetTypeAPI, 'id'> {}

export type T_WidgetSize = T_WidgetSize_original

export interface I_Widget
  extends RequiredKeys<
    Omit<I_Widget_original, 'user_id' | 'created_at'>,
    'id'
  > {}

export interface I_BoardProps extends React.ComponentProps<'div'> {
  initialWidgets: I_Widget[]
  initialWidgetTypes: I_WidgetType[]
  // saveWidgets: (
  //   data: T_saveWidgets_body
  // ) => Promise<I_AxiosResponse<boolean | null>>
  // deleteWidget: (
  //   id: T_deleteWidget_id
  // ) => Promise<I_AxiosResponse<boolean | null>>
}

export interface I_WidgetProps extends React.ComponentProps<'div'> {
  widget: I_Widget
  gridSize: number
  style?: React.CSSProperties
  isDragging: boolean
}

export interface I_WidgetOverlayProps extends React.ComponentProps<'div'> {
  widget: I_Widget
  gridSize: number
}
