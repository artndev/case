import { WidgetTypes } from '@/app/api/_validations/config'

declare global {
  namespace N_WidgetSettings {
    type T_WidgetType = (typeof WidgetTypes)[number]
  }

  namespace N_Widgets {
    export interface I_WidgetType {
      id: string
      widget_type: N_WidgetSettings.T_WidgetType
      alias: string
      created_at: string
    }
  }

  namespace N_WidgetTypes_API {
    export interface I_WidgetType
      extends PartialKeys<Omit<N_Widgets.I_WidgetType, 'created_at'>, 'id'> {}
  }
}
