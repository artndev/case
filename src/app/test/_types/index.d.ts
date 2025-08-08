export type WidgetSize = 'sm' | 'md' | 'bg'

export interface I_Widget {
  id: number
  size: WidgetSize
  x: number
  y: number
}

export interface I_WidgetProps {
  widget: I_Widget
  gridSize: number
  style?: React.CSSProperties
  isDragging: boolean
}

export interface I_WidgetOverlayProps {
  widget: I_Widget
  gridSize: number
}
