import Widget1 from '@/app/board/_components/widgets/widget-1'
import Widget2 from '@/app/board/_components/widgets/widget-2'
import { I_WidgetProps } from '@/app/board/_types'

export const WidgetTypes = ['widget-1', 'widget-2'] as const

export const WidgetSizes = ['sm', 'md', 'bg'] as const

export const GRID_SIZE = 25
export const MAX_COLS = 30
export const MAX_ROWS = 20

// Map each widget size to its grid dimensions
export const sizeMap: Record<
  WidgetSettings.T_WidgetSize,
  { w: number; h: number }
> = {
  sm: { w: 8, h: 8 },
  md: { w: 8, h: 10 },
  bg: { w: 8, h: 12 },
}

// Map each widget to its widget type settings
export const widgetTypeMap: Record<
  WidgetSettings.T_WidgetType,
  React.FC<I_WidgetProps>
> = {
  'widget-1': Widget1,
  'widget-2': Widget2,
}
