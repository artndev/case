declare global {
  namespace N_Board {
    // Omit x and y for RGL
    interface I_Widget
      extends Omit<N_Widgets.I_Widget, 'user_id' | 'created_at' | 'x' | 'y'> {}

    type T_WidgetMixed = N_Board.I_Widget | N_Widgets.I_Widget

    type T_Breakpoint = 'md' | 'sm'

    type T_Layouts = { [key: string]: Layout[] }
  }
}

export interface I_BoardProps extends React.ComponentProps<'div'> {
  userId: string
  initialWidgets: N_Widgets.I_Widget[]
  initialWidgetTypes: N_Widgets.I_WidgetType[]
  initialLayouts: N_Board.T_Layouts
}

export interface I_WidgetProps extends React.ComponentProps<'div'> {}

export interface I_WidgetOverlayProps extends React.ComponentProps<'div'> {
  widget: N_Board.T_WidgetMixed
  gridSize: number
}
