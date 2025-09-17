import { Layout } from 'react-grid-layout'

declare global {
  namespace N_Board {
    interface I_Widget extends Omit<N_Widgets.I_Widget, 'created_at'> {}

    type T_Breakpoint = 'md' | 'sm'
  }
}

export interface I_BoardProps extends React.ComponentProps<'div'> {
  initialWidgetTypes: N_Widgets.I_WidgetType[]
}

export interface I_WidgetProps extends React.ComponentProps<'div'> {
  rowHeight: number
  widget: N_Board.I_Widget
}
