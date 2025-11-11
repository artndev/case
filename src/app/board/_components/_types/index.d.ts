import { Layout } from 'react-grid-layout'

declare global {
  namespace N_Board {
    interface I_Widget extends Omit<N_Widgets.I_Widget, 'created_at'> {}

    type T_Breakpoint = 'md' | 'sm'
  }
}

export interface I_BoardProps extends React.ComponentProps<'div'> {
  initialWidgetTypes: N_Widgets.I_WidgetType[]
}

export interface I_BoardPropsTest<T = void, U = void>
  extends Omit<
    ReactGridLayout.ResponsiveProps,
    'margin' | 'containerPadding' | 'draggableCancel' | 'breakpoints' | 'cols'
  > {
  widgetTypesController?: {
    widgetTypes: N_Widgets.I_WidgetType[]
    onClick: (
      size: N_WidgetSettings.T_WidgetSize,
      type: N_Widgets.I_WidgetType
    ) => T
  }
  previewController?: {
    isEnabled: boolean
    onClick: (...args) => U
  }
}

export interface I_WidgetProps extends React.ComponentProps<'div'> {
  widget: N_Board.I_Widget
  isInspected?: boolean
}
