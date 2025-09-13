import { Layout } from 'react-grid-layout'

declare global {
  namespace N_Board {
    interface I_Widget
      extends PartialKeys<Omit<N_Widgets.I_Widget, 'created_at'>, 'metadata'> {}

    type T_Breakpoint = 'md' | 'sm'
  }
}

export interface I_BoardProps extends React.ComponentProps<'div'> {
  userId: string
  initialWidgets: N_Board.I_Widget[]
  initialWidgetTypes: N_Widgets.I_WidgetType[]
  initialLayouts: Record<string, Layout[]>
}

export interface I_WidgetProps extends React.ComponentProps<'div'> {
  userId: string
  breakpoint: N_Board.T_Breakpoint
  layouts: Record<string, Layout[]>
  setLayouts: React.Dispatch<React.SetStateAction<Record<string, Layout[]>>>
  widget: N_Board.I_Widget
  metadata?: {
    note: string
  }
}
