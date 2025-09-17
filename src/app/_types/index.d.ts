import { User } from '@supabase/supabase-js'

declare global {
  export type PartialKeys<T, K extends keyof T> = Omit<T, K> &
    Partial<Pick<T, K>>

  export type RequiredKeys<T, K extends keyof T> = Omit<T, K> &
    Required<Pick<T, K>>

  export interface I_AxiosResponse<T> {
    message: string
    answer: T
  }
}

export interface I_StatePayload {
  type: 'sign-in' | 'sign-up'
  casename?: string
}

export interface I_AuthContext {
  user: User | undefined
  loading: boolean
}

export interface I_BoardContextProps {
  userId: string
  initialWidgets: N_Board.I_Widget[]
  initialLayouts: Record<string, Layout[]>
  children: React.ReactNode
}

export interface I_BoardContext {
  /* Props */
  userId: string
  /* States */
  widgets: N_Board.I_Widget[]
  setWidgets: React.Dispatch<React.SetStateAction<N_Board.I_Widget[]>>
  layouts: Record<string, Layout[]>
  setLayouts: React.Dispatch<React.SetStateAction<Record<string, Layout[]>>>
  breakpoint: N_Board.T_Breakpoint
  setBreakpoint: React.Dispatch<React.SetStateAction<N_Board.T_Breakpoint>>
  isDraggable: boolean
  setIsDraggable: React.Dispatch<React.SetStateAction<boolean>>
  /* Refs & Memos */
  dirtyWidgets: React.RefObject<Set<string>>
  layoutWidgets: N_Board.I_Widget[]
  layoutWidgetsAPI: N_Widgets_API.I_Widget[]
  /* RGL Methods */
  addWidget: (
    size: N_WidgetSettings.T_WidgetSize,
    type: N_Widgets.I_WidgetType
  ) => void
  handleWidgetDelete: (id: string) => Promise<void>
  resizeWidget: (id: string, size: N_WidgetSettings.T_WidgetSize) => void
  /* RGL Handlers  */
  handleDragStart: (_: any) => Record<
    string,
    Record<
      string,
      {
        x: number
        y: number
        size: N_WidgetSettings.T_WidgetSize
      }
    >
  >
  handleDragStop: (layout: Layout[]) => void
  handleLayoutChange: (_: any, allLayouts: ReactGridLayout.Layouts) => void
}

export {}
