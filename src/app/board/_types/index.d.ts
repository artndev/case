declare global {
  namespace Widgets {
    interface I_Widget_Board
      extends PartialKeys<I_Widget, 'user_id' | 'created_at'> {}
  }
}

export interface I_BoardProps extends React.ComponentProps<'div'> {
  initialWidgets: Widgets.I_Widget_Board[]
  initialWidgetTypes: Widgets.I_WidgetType[]
  // saveWidgets: (
  //   data: T_saveWidgets_body
  // ) => Promise<I_AxiosResponse<boolean | null>>
  // deleteWidget: (
  //   id: T_deleteWidget_id
  // ) => Promise<I_AxiosResponse<boolean | null>>
}

export interface I_WidgetProps extends React.ComponentProps<'div'> {
  widget: Widgets.I_Widget_Board
  gridSize: number
  style?: React.CSSProperties
  isDragging: boolean
}

export interface I_WidgetOverlayProps extends React.ComponentProps<'div'> {
  widget: Widgets.I_Widget_Board
  gridSize: number
}
