import { WidgetSizes } from '@/lib/config'

declare global {
  namespace N_WidgetSettings {
    type T_WidgetSize = (typeof WidgetSizes)[number]
  }

  namespace N_Widgets {
    export interface I_Widget {
      id: string
      user_id: string
      x: number
      y: number
      size: N_WidgetSettings.T_WidgetSize
      widget_type_id: string
      widget_type_details: {
        alias: string
        widget_type: N_WidgetSettings.T_WidgetType
      }
      created_at: string
    }
  }

  namespace N_Widgets_API {
    /* INTERFACES */

    export interface I_Widget
      extends PartialKeys<
        Omit<
          N_Widgets.I_Widget,
          'user_id' | 'widget_type_details' | 'created_at'
        >,
        'id' | 'widget_type_id'
      > {}

    /* REQUEST METHODS */

    export interface POST {
      user_id: string
      widgets: N_Widgets_API.I_Widget[]
    }
  }
}
