declare global {
  namespace N_Board {
    interface I_Widget
      extends Omit<N_Widgets.I_Widget, 'user_id' | 'created_at'> {}

    type T_WidgetMixed = N_Board.I_Widget | N_Widgets.I_Widget
  }
}

export interface I_BoardProps extends React.ComponentProps<'div'> {
  initialWidgets: N_Widgets.I_Widget[]
  initialWidgetTypes: N_Widgets.I_WidgetType[]
  userId: string
}

export interface I_WidgetProps extends React.ComponentProps<'div'> {
  widget: N_Board.T_WidgetMixed
  gridSize: number
  isDragging: boolean
  style?: React.CSSProperties
}

export interface I_WidgetOverlayProps extends React.ComponentProps<'div'> {
  widget: N_Board.T_WidgetMixed
  gridSize: number
}
