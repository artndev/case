'use client'

import { SIZE_MAP } from '@/lib/config'
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Layout } from 'react-grid-layout'
import { v4 as uuidv4 } from 'uuid'
import { I_BoardContext, I_BoardContextProps } from '../_types'
import { saveWidgets, deleteWidget } from './actions'

const BoardContext = createContext<I_BoardContext>({} as I_BoardContext)
export const BoardProvider: React.FC<I_BoardContextProps> = ({
  userId,
  initialWidgets,
  initialLayouts,
  children,
}) => {
  // Timeouts
  const saveTimeout = useRef<NodeJS.Timeout | null>(null)
  // Timeout for adding widget, update optionally in future
  // const addTimeout = useRef<NodeJS.Timeout | null>(null)
  const deleteTimeout = useRef<NodeJS.Timeout | null>(null)

  // Refs
  const dirtyWidgets = useRef<Set<string>>(new Set())
  const prevLayoutMeta = useRef<
    Record<
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
  >({})

  // States
  const [widgets, setWidgets] = useState<N_Board.I_Widget[]>(initialWidgets)
  const [layouts, setLayouts] =
    useState<Record<string, Layout[]>>(initialLayouts)
  const [breakpoint, setBreakpoint] = useState<N_Board.T_Breakpoint>('md')
  const [isDraggable, setIsDraggable] = useState<boolean>(true)

  /**
   * Get updated size and cords from layout widgets comparing to original ones
   */
  const getLayoutsMeta = () => {
    return Object.entries(layouts).reduce(
      (acc, [key, val]) => {
        val.forEach(lwgt => {
          const widget = widgets.find(w => w.id === lwgt.i)

          acc[lwgt.i] = {
            ...acc[lwgt.i],
            [key]: {
              x: lwgt.x,
              y: lwgt.y,
              size: widget
                ? widget.size // WIDGET_SIZE_MAP[widget.widget_type_details.widget_type][0]
                : 'sm',
            },
          }
        })

        return acc
      },
      {} as Record<
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
    )
  }

  /**
   * Layout to widgets transformation with updated size from layouts meta
   */
  const layoutToWidgets = () => {
    return widgets.map(wgt => {
      const layoutWidgetMeta = layoutsMeta[wgt.id][breakpoint]

      return {
        ...wgt,
        size: layoutWidgetMeta.size,
      }
    })
  }

  /**
   * Layout widgets to widgets API transformation with updated cords from layouts meta according to format: \
   * x_[breakpoint] = x \
   * y_[breakpoint] = y
   */
  const layoutsToWidgetsAPI = () => {
    /* Same size for each breakpoint but different alignment */
    return widgets
      .filter(({ id }) => dirtyWidgets.current.has(id))
      .map(({ widget_type_details, ...payload }) => ({
        ...payload,
        ...Object.entries(layoutsMeta[payload.id]).reduce(
          (acc, [key, val]) => {
            acc[`x_${key}`] = val.x
            acc[`y_${key}`] = val.y

            return acc
          },
          {} as Record<string, number>
        ),
      }))
  }

  /* Memorized values to prevent from unnecessary calls */

  const layoutsMeta = useMemo(() => getLayoutsMeta(), [layouts])

  const layoutWidgets = useMemo(
    () => layoutToWidgets(),
    [layouts, widgets, breakpoint]
  )

  const layoutWidgetsAPI = useMemo(
    () => layoutsToWidgetsAPI(),
    [layouts, widgets]
  )

  /**
   * Write 'previous' layouts meta for handleDragStop
   */
  const handleDragStart = (_: any) => (prevLayoutMeta.current = layoutsMeta)

  /**
   * Update repositioned widgets depending on previous layouts meta
   */
  const handleDragStop = (layout: Layout[]) => {
    dirtyWidgets.current = new Set([
      ...dirtyWidgets.current,
      ...layout
        .filter(lwgt => {
          const prevLayoutWidgetMeta =
            prevLayoutMeta.current[lwgt.i]?.[breakpoint]

          return (
            prevLayoutWidgetMeta &&
            (prevLayoutWidgetMeta.x !== lwgt.x ||
              prevLayoutWidgetMeta.y !== lwgt.y)
          )
        })
        .map(lwgt => lwgt.i),
    ])

    setLayouts({
      ...layouts,
      [breakpoint]: layout,
    })
  }

  /**
   * Handle layout change (drag or resize)
   */
  const handleLayoutChange = (_: any, allLayouts: ReactGridLayout.Layouts) =>
    setLayouts(allLayouts)

  const addWidget = (
    size: N_WidgetSettings.T_WidgetSize,
    type: N_Widgets.I_WidgetType
  ) => {
    const { id, ...payload } = type

    const widget = {
      id: uuidv4(),
      user_id: userId,
      x_sm: 0,
      y_sm: Infinity,
      x_md: 0,
      y_md: Infinity,
      size,
      widget_type_id: type.id,
      widget_type_details: payload,
      metadata: null,
    }

    setWidgets(prev => [...prev, widget])

    setLayouts(prev => ({
      ...Object.entries(prev).reduce(
        (acc, [key, val]) => {
          acc[key] = [
            ...val,
            {
              i: widget.id,
              x: 0,
              y: Infinity,
              w: SIZE_MAP[size][breakpoint].w,
              h: SIZE_MAP[size][breakpoint].h,
              static: false,
            },
          ]

          return acc
        },
        {} as Record<string, Layout[]>
      ),
    }))

    dirtyWidgets.current.add(widget.id)
  }

  const resizeWidget = (id: string, size: N_WidgetSettings.T_WidgetSize) => {
    setWidgets(prev =>
      prev.map(wgt =>
        wgt.id === id
          ? {
              ...wgt,
              size,
            }
          : wgt
      )
    )

    setLayouts(prev => ({
      ...Object.entries(prev).reduce(
        (acc, [key, val]) => {
          acc[key] = val.map(lwgt =>
            lwgt.i === id
              ? {
                  ...lwgt,
                  w: SIZE_MAP[size][breakpoint].w,
                  h: SIZE_MAP[size][breakpoint].h,
                }
              : lwgt
          )

          return acc
        },
        {} as Record<string, Layout[]>
      ),
    }))

    dirtyWidgets.current.add(id)
  }

  /* DB integration */

  const handleWidgetDelete = async (id: string) => {
    if (deleteTimeout.current) {
      clearTimeout(deleteTimeout.current)
    }

    const start = () => {
      setWidgets(prev => prev.filter(wgt => wgt.id !== id))

      setLayouts(prev => ({
        ...Object.entries(prev).reduce(
          (acc, [key, val]) => {
            acc[key] = val.filter(lwgt => lwgt.i !== id)

            return acc
          },
          {} as Record<string, Layout[]>
        ),
      }))

      // Consider to add only widget with provided id
      widgets.map(({ id }) => id).forEach(id => dirtyWidgets.current.add(id))
    }

    deleteTimeout.current = setTimeout(() => {
      deleteWidget(id)
        .then(() => start())
        .catch(err => console.log(err))
    }, 50)
  }

  useEffect(() => {
    if (dirtyWidgets.current.size === 0) {
      return
    }

    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current)
    }

    saveTimeout.current = setTimeout(() => {
      const dirtyPayload = layoutWidgetsAPI.filter(w =>
        dirtyWidgets.current.has(w.id)
      )

      if (dirtyPayload.length === 0) {
        return
      }

      saveWidgets({
        widgets: dirtyPayload,
      })
        .then(() => {
          // console.log('Saved: ', dirtyPayload)

          dirtyWidgets.current.clear()
        })
        .catch(err => console.log(err))

      dirtyWidgets.current.clear()
    }, 50)
  }, [layouts, widgets, breakpoint])

  return (
    <BoardContext.Provider
      value={{
        /* Props */
        userId,
        /* States */
        widgets,
        setWidgets,
        layouts,
        setLayouts,
        breakpoint,
        setBreakpoint,
        isDraggable,
        setIsDraggable,
        /* Refs & Memos */
        dirtyWidgets,
        layoutWidgets,
        layoutWidgetsAPI,
        /* RGL Methods */
        addWidget,
        handleWidgetDelete,
        resizeWidget,
        /* RGL Handlers  */
        handleDragStart,
        handleDragStop,
        handleLayoutChange,
      }}
    >
      {children}
    </BoardContext.Provider>
  )
}

export const useBoardContext = () => useContext(BoardContext)

export default BoardContext
