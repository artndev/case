import Widget1 from '@/app/board/_components/widgets/widget-link'
import WidgetNote from '@/app/board/_components/widgets/widget-note'
import { I_WidgetProps } from '@/app/board/_types'

export const BREAKPOINT_MAP = { sm: 768, md: 769 }

export const COL_MAP = { sm: 6, md: 12 }

/**
 * Map each widget size to its grid dimensions
 */
export const SIZE_MAP: Record<
  N_WidgetSettings.T_WidgetSize,
  Record<N_Board.T_Breakpoint, { w: number; h: number }>
> = {
  sm: {
    sm: { w: 3, h: 3 },
    md: { w: 3, h: 3 },
  },
  md: {
    sm: { w: 6, h: 4 },
    md: { w: 4, h: 4 },
  },
  lg: {
    sm: { w: 6, h: 5 },
    md: { w: 6, h: 4 },
  },
  'lg-full': {
    sm: { w: 12, h: 4 },
    md: { w: 12, h: 4 },
  },
}

/**
 * Map each widget type to its component
 */
export const WIDGET_TYPE_MAP: Record<
  N_WidgetSettings.T_WidgetType,
  React.FC<I_WidgetProps>
> = {
  'widget-note': WidgetNote,
  'widget-link': Widget1,
}

export const WIDGET_SIZE_MAP: Record<
  N_WidgetSettings.T_WidgetType,
  N_WidgetSettings.T_WidgetSize[]
> = {
  'widget-note': ['lg-full'],
  'widget-link': ['sm', 'md'],
}

export const WIDGET_TYPES: string[] = Object.keys(WIDGET_TYPE_MAP)
