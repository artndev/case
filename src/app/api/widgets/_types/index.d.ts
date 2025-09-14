import { WIDGET_SIZES } from '@/lib/constants'

declare global {
  namespace N_WidgetSettings {
    type T_WidgetSize = (typeof WIDGET_SIZES)[number]
  }

  namespace N_Widgets {
    export interface I_Widget {
      id: string
      user_id: string
      x_md: number
      y_md: number | null
      x_sm: number
      y_sm: number | null
      size: N_WidgetSettings.T_WidgetSize
      widget_type_id: string
      widget_type_details: {
        alias: string
        widget_type: N_WidgetSettings.T_WidgetType
      }
      metadata: string | null
      created_at: string
    }
  }

  namespace N_Widgets_API {
    /* INTERFACES */

    // Id is omitted because of creating new widgets
    export interface I_Widget
      extends PartialKeys<
        Omit<N_Widgets.I_Widget, 'widget_type_details' | 'created_at'>,
        'id' | 'widget_type_id' | 'metadata'
      > {}

    /* REQUEST METHODS */

    export interface POST {
      widgets: N_Widgets_API.I_Widget[]
    }
  }
}
