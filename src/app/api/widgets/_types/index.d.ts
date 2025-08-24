import { WidgetSizes } from '@/lib/config'

declare global {
  namespace WidgetSettings {
    type T_WidgetSize = (typeof WidgetSizes)[number]
  }

  namespace Widgets {
    export interface I_Widget {
      id: string
      user_id: string
      x: number
      y: number
      size: WidgetSettings.T_WidgetSize
      widget_type_id: string
      widget_type_details: {
        alias: string
        widget_type: WidgetSettings.T_WidgetType
      }
      created_at: string
    }
  }

  namespace Widgets_API {
    /* REQUEST METHODS */

    export interface POST {
      user_id: string
      widgets: Widgets_API.I_Widget[]
    }

    /* INTERFACES */

    export interface I_Widget
      extends PartialKeys<
        Omit<
          Widgets.I_Widget,
          'user_id' | 'widget_type_details' | 'created_at'
        >,
        'id' | 'widget_type_id'
      > {}
  }
}
