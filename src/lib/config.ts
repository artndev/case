import Widget1 from '@/app/board/_components/widgets/widget-1'
import Widget2 from '@/app/board/_components/widgets/widget-2'
import WidgetNote from '@/app/board/_components/widgets/widget-note'
import { I_WidgetProps } from '@/app/board/_types'

export const BREAKPOINT_MAP = { sm: 768, md: 769 }

export const COL_MAP = { sm: 6, md: 12 }

export const ROW_HEIGHT = 10

/**
 * Map each widget size to its grid dimensions
 */
export const SIZE_MAP: Record<
  N_WidgetSettings.T_WidgetSize,
  { w: number; h: number }
> = {
  sm: { w: 3, h: 10 },
  md: { w: 6, h: 10 },
  lg: { w: 6, h: 14 },
  'lg-full': { w: 12, h: 1 },
}

/**
 * Map each widget type to its component
 */
export const WIDGET_TYPE_MAP: Record<
  N_WidgetSettings.T_WidgetType,
  React.FC<I_WidgetProps>
> = {
  'widget-1': Widget1,
  'widget-2': Widget2,
  'widget-note': WidgetNote,
}

export const WIDGET_SIZE_MAP: Record<
  N_WidgetSettings.T_WidgetType,
  N_WidgetSettings.T_WidgetSize[]
> = {
  'widget-1': ['sm', 'md', 'lg'],
  'widget-2': ['sm', 'md', 'lg'],
  'widget-note': ['lg-full'],
}

export const WIDGET_TYPES: string[] = Object.keys(WIDGET_TYPE_MAP)
