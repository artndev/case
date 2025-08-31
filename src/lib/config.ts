import Widget1 from '@/app/board/_components/widgets/widget-1'
import Widget2 from '@/app/board/_components/widgets/widget-2'
import { I_WidgetProps } from '@/app/board/_types'

export const WIDGET_TYPES = ['widget-1', 'widget-2'] as const

export const WIDGET_SIZES = ['sm', 'md', 'lg'] as const

export const BREAKPOINTS = ['sm', 'md'] as const

export const BREAKPOINT_MAP = { sm: 768, md: 769 } as const

export const COL_MAP = { sm: 6, md: 12 } as const

// Map each widget size to its grid dimensions
export const SIZE_MAP: Record<
  N_WidgetSettings.T_WidgetSize,
  { w: number; h: number }
> = {
  sm: { w: 3, h: 10 },
  md: { w: 6, h: 10 },
  lg: { w: 6, h: 14 },
} as const

// Map each widget to its widget type settings
export const WIDGET_TYPE_MAP: Record<
  N_WidgetSettings.T_WidgetType,
  React.FC<I_WidgetProps>
> = {
  'widget-1': Widget1,
  'widget-2': Widget2,
} as const
