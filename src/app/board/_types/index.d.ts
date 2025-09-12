import { Layout } from 'react-grid-layout'

declare global {
  namespace N_Board {
    // All keys can be omitted but Ill make them optional
    interface I_Widget
      extends PartialKeys<N_Widgets.I_Widget, 'metadata' | 'created_at'> {}

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
