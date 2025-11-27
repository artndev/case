'use client'

import { DELETE_TIMEOUT, SAVE_TIMEOUT, SIZE_MAP } from '@/lib/config'
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
import { deleteWidget, saveWidgets } from './actions'

const BoardContext = createContext<I_BoardContext>({} as I_BoardContext)
export const BoardProvider: React.FC<I_BoardContextProps> = ({
  userId,
  initialWidgets,
  initialLayouts,
  children,
}) => {
  // Timeouts
  // Timeout of adding widget (will be updated optionally in future)
  // const addTimeout = useRef<NodeJS.Timeout | null>(null)
  const saveTimeout = useRef<NodeJS.Timeout | null>(null)
  const deleteTimeout = useRef<NodeJS.Timeout | null>(null)

  // Refs
  const dirtyWidgets = useRef<Set<string>>(new Set())
  const prevLayoutMeta = useRef<N_Board.I_LayoutsMeta>({})

  // States
  // Initial values are taken from DB
  const [widgets, setWidgets] = useState<N_Board.I_Widget[]>(initialWidgets)
  const [layouts, setLayouts] =
    useState<Record<string, Layout[]>>(initialLayouts)
  const [breakpoint, setBreakpoint] = useState<N_Board.T_Breakpoint>('md')

  const [rowHeight, setRowHeight] = useState<number>(15)
  const [isDraggable, setIsDraggable] = useState<boolean>(true)

  // ============ Layouts meta logic ============

  /**
   * Get updated size and coords from layout widgets comparing to original ones
   */
  const getLayoutsMeta = () => {
    return Object.entries(layouts).reduce((acc, [key, val]) => {
      val.forEach(lwgt => {
        const widget = widgets.find(w => w.id === lwgt.i)

        acc[lwgt.i] = {
          ...acc[lwgt.i],
          [key]: {
            ...lwgt,
            size: widget ? widget.size : 'sm',
          },
        }
      })

      return acc
    }, {} as N_Board.I_LayoutsMeta)
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
    // Same size for each breakpoint but different alignment
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

  // Memorized values to prevent from unnecessary calls
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

  // ============ Main logic ============

  ///// TODO: Reduce y-variables from 'Infinity' to zero ones
  /**
   * Add widget to board
   */
  const addWidget = (
    size: N_WidgetSettings.T_WidgetSize,
    type: N_Widgets.I_WidgetType
  ) => {
    const { id: widget_type_id, ...widget_type_details } = type

    const widget = {
      /* IDs */
      id: uuidv4(),
      user_id: userId,
      /* Size */
      size,
      /* Coords */
      x_sm: 0,
      y_sm: 0,
      x_md: 0,
      y_md: 0,
      /* Widget type */
      widget_type_id,
      widget_type_details,
      /* Other */
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
              y: 0,
              w: SIZE_MAP[size][breakpoint].w,
              h: SIZE_MAP[size][breakpoint].h,
              static: false,
            },
          ]

          return acc
        },
        {} as typeof prev
      ),
    }))

    dirtyWidgets.current.add(widget.id)
  }

  ///// TODO: Dive into case when size is same
  /**
   * Resize widget on board
   * @param id Actually, it's layout widget's 'i' property
   */
  const resizeWidget = (id: string, size: N_WidgetSettings.T_WidgetSize) => {
    const widget = widgets.find(w => w.id === id)

    if (!widget || widget.size === size) {
      return
    }

    setWidgets(prev =>
      prev.map(wgt => (wgt.id === id ? { ...wgt, size } : wgt))
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
        {} as typeof prev
      ),
    }))

    dirtyWidgets.current.add(id)
  }

  /**
   * Calculate row height using formula taken from RGL docs
   */
  const handleWidthChange = (
    containerWidth: number,
    margin: [number, number],
    cols: number,
    containerPadding: [number, number]
  ) => {
    const [marginX] = margin
    const [containerPaddingX] = containerPadding

    const totalMarginX = marginX * (cols - 1)
    const totalPaddingX = containerPaddingX * 2

    const colWidth = (containerWidth - totalMarginX - totalPaddingX) / cols
    setRowHeight(Math.round(colWidth))
  }

  /**
   * Wrapper for handling layout changes (e.g. drag or resize)
   */
  const handleLayoutChange = (_: any, allLayouts: ReactGridLayout.Layouts) =>
    setLayouts(allLayouts)

  // ============ Serverless logic ============

  /**
   * Wrapper for deleting widget from board
   */
  const handleWidgetDelete = async (id: string) => {
    if (deleteTimeout.current) {
      clearTimeout(deleteTimeout.current)
    }

    const invoke = () => {
      setWidgets(prev => prev.filter(wgt => wgt.id !== id))

      setLayouts(prev => ({
        ...Object.entries(prev).reduce(
          (acc, [key, val]) => {
            acc[key] = val.filter(lwgt => lwgt.i !== id)

            return acc
          },
          {} as typeof prev
        ),
      }))

      // Consider to add only widget with provided id for recalculation
      // to optimize amount of calls to backend
      widgets.map(({ id }) => id).forEach(id => dirtyWidgets.current.add(id))
    }

    deleteTimeout.current = setTimeout(() => {
      deleteWidget(id)
        .then(() => invoke())
        .catch(err => console.log(err))
    }, DELETE_TIMEOUT)
  }

  // 'Moderating dirtyWidgets changes' is meant to be seeking for any changes of
  // widgets themselves (e.g. size, position, type)
  useEffect(() => {
    if (dirtyWidgets.current.size === 0) {
      return
    }

    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current)
    }

    saveTimeout.current = setTimeout(() => {
      // Preparing payload from STABLE bench of widgets in API format
      const dirtyPayload = layoutWidgetsAPI.filter(w =>
        dirtyWidgets.current.has(w.id)
      )

      if (dirtyPayload.length === 0) {
        return
      }

      // Also clearing happens when error occurs to prevent from infinite loops
      saveWidgets({
        widgets: dirtyPayload,
      })
        .finally(() => dirtyWidgets.current.clear()) // <-- Here!
        .catch(err => console.log(err))
    }, SAVE_TIMEOUT)
  }, [layouts, widgets, breakpoint])

  // ============ Other ============

  // Handle cases of different sizes ('w' and 'h' properties) depending on active breakpoint
  useEffect(() => {
    setLayouts(prev => ({
      ...prev,
      [breakpoint]: prev[breakpoint].map(lwgt => {
        const widget = widgets.find(wgt => wgt.id === lwgt.i)

        if (!widget) {
          return lwgt
        }

        return { ...lwgt, ...SIZE_MAP[widget.size][breakpoint] }
      }),
    }))
  }, [breakpoint])

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
        rowHeight,
        /* Refs & Memos */
        dirtyWidgets,
        layoutWidgets,
        layoutWidgetsAPI,
        /* RGL Methods */
        addWidget,
        resizeWidget,
        handleWidgetDelete,
        /* RGL Handlers  */
        handleDragStart,
        handleDragStop,
        handleWidthChange,
        handleLayoutChange,
      }}
    >
      {children}
    </BoardContext.Provider>
  )
}

export const useBoardContext = () => useContext(BoardContext)

export default BoardContext
