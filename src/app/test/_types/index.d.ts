export type WidgetSize = 'sm' | 'md' | 'bg'

export interface I_Widget {
  id: number
  size: WidgetSize
  x: number
  y: number
}
