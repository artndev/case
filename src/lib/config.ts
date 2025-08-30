import Widget1 from '@/app/board/_components/widgets/widget-1'
import Widget2 from '@/app/board/_components/widgets/widget-2'
import { I_WidgetProps } from '@/app/board/_types'

export const WidgetTypes = ['widget-1', 'widget-2'] as const

export const WidgetSizes = ['sm', 'md', 'lg'] as const

export const GRID_SIZE = 80
export const MAX_COLS = 25
export const MAX_ROWS = 20

// Map each widget size to its grid dimensions
export const sizeMap: Record<
  N_WidgetSettings.T_WidgetSize,
  { w: number; h: number }
> = {
  sm: { w: 3, h: 10 },
  md: { w: 6, h: 10 },
  lg: { w: 6, h: 14 },
}

// Map each widget to its widget type settings
export const widgetTypeMap: Record<
  N_WidgetSettings.T_WidgetType,
  React.FC<I_WidgetProps>
> = {
  'widget-1': Widget1,
  'widget-2': Widget2,
}
