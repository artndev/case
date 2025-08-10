export type T_WidgetSize = 'sm' | 'md' | 'bg'

export interface I_Widget {
  id: number
  size: T_WidgetSize
  x: number
  y: number
}

export interface I_WidgetProps extends React.ComponentProps<'div'> {
  widget: I_Widget
  gridSize: number
  style?: React.CSSProperties
  isDragging: boolean
}

export interface I_WidgetOverlayProps {
  widget: I_Widget
  gridSize: number
}
