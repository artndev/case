import { WidgetTypes } from '@/app/api/_validations/config'

declare global {
  namespace WidgetSettings {
    type T_WidgetType = (typeof WidgetTypes)[number]
  }

  namespace Widgets {
    export interface I_WidgetType {
      id: string
      widget_type: WidgetSettings.T_WidgetType
      alias: string
      created_at: string
    }
  }

  namespace WidgetTypes_API {
    export interface I_WidgetType
      extends PartialKeys<Omit<Widgets.I_WidgetType, 'created_at'>, 'id'> {}
  }
}
