export type T_WidgetSize = 'sm' | 'md' | 'bg'

export type T_ComponentType = 'widget-1' | 'widget-2'

export interface I_Widget {
  id: number
  size: T_WidgetSize
  x: number
  y: number
}

export interface I_WidgetType {
  id: number
  componentType: T_ComponentType
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
