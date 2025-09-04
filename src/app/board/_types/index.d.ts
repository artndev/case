import { Layout } from 'react-grid-layout'

declare global {
  namespace N_Board {
    // All keys can be omitted but Ill make them optional
    interface I_Widget
      extends PartialKeys<N_Widgets.I_Widget, 'user_id' | 'created_at'> {}

    type T_Breakpoint = 'md' | 'sm'
  }
}

export interface I_BoardProps extends React.ComponentProps<'div'> {
  userId: string
  initialWidgets: N_Board.I_Widget[]
  initialWidgetTypes: N_Widgets.I_WidgetType[]
  initialLayouts: N_Board.T_Layouts
}

export interface I_WidgetProps extends React.ComponentProps<'div'> {}

export interface I_WidgetOverlayProps extends React.ComponentProps<'div'> {
  widget: N_Board.T_WidgetMixed
  gridSize: number
}
