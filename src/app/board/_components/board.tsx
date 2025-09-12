'use client'

import { Button } from '@/components/ui/button'
import {
  BREAKPOINT_MAP,
  COL_MAP,
  ROW_HEIGHT,
  SIZE_MAP,
  WIDGET_SIZE_MAP,
  WIDGET_TYPE_MAP,
} from '@/lib/config'
import { cn } from '@/lib/utils'
import { Smartphone, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Layout, Responsive, WidthProvider } from 'react-grid-layout'
// Editable styles for RGL
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { v4 as uuidv4 } from 'uuid'
import { I_BoardProps } from '../_types'
import { deleteWidget, saveWidgets } from '../actions'

const ResponsiveGridLayout = WidthProvider(Responsive)

const BoardRGL: React.FC<I_BoardProps> = ({
  userId,
  initialWidgets,
  initialWidgetTypes,
  initialLayouts,
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
  const [previewMode, setPreviewMode] = useState<boolean>(false)

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
                ? WIDGET_SIZE_MAP[widget.widget_type_details.widget_type][0]
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
    /* The same size for each breakpoint but different alignment */
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

  /**
   * Add new widget
   */
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
              w: SIZE_MAP[size].w,
              h: SIZE_MAP[size].h,
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

  /**
   * Delete widget
   */
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

  /**
   * Resize widget
   */
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
              ? { ...lwgt, w: SIZE_MAP[size].w, h: SIZE_MAP[size].h }
              : lwgt
          )

          return acc
        },
        {} as Record<string, Layout[]>
      ),
    }))

    dirtyWidgets.current.add(id)
  }

  // useEffect(() => {
  //   document.cookie = `layouts=${JSON.stringify(layouts)}; path=/`
  // }, [layouts])

  // useEffect(() => {
  //   document.cookie = `widgets=${JSON.stringify(widgets)}; path=/`
  // }, [widgets])

  // Only for testing purposes

  // useEffect(() => {
  //   console.log('Preview mode: ', previewMode)
  // }, [previewMode])

  return (
    <div className="flex flex-col gap-6 max-w-[900px] w-full">
      {/* Controls */}
      <div className="flex flex-col gap-6 self-start">
        {initialWidgetTypes.map(type => {
          const widgetSizes = WIDGET_SIZE_MAP[type.widget_type]

          return (
            <div key={type.id} className="flex flex-col gap-3">
              {type.alias}

              {widgetSizes.length > 1 ? (
                <div className="flex gap-3">
                  {widgetSizes.map(wgts => {
                    return (
                      <Button onClick={() => addWidget(wgts, type)}>
                        Add '{wgts}'
                      </Button>
                    )
                  })}
                </div>
              ) : (
                <Button onClick={() => addWidget(widgetSizes[0], type)}>
                  Add widget
                </Button>
              )}
            </div>
          )
        })}

        {/* Preview toggle */}
        <Button
          size={'icon'}
          variant={previewMode ? 'default' : 'outline'}
          onClick={() => setPreviewMode(prev => !prev)}
          className="hidden sm:flex sm:justify-center sm:items-center"
        >
          <Smartphone />
        </Button>
      </div>

      {/* RGL container */}

      <div className="flex justify-center items-center w-full">
        <div
          className={cn(
            'layout w-full border rounded-sm bg-white',
            previewMode && 'sm:w-[350px] sm:border-10'
          )}
        >
          <ResponsiveGridLayout
            key={breakpoint} // Important part of adjusting size of widget notes
            layouts={layouts!}
            breakpoints={BREAKPOINT_MAP}
            cols={COL_MAP}
            rowHeight={ROW_HEIGHT}
            onLayoutChange={handleLayoutChange}
            onBreakpointChange={newBreakpoint =>
              setBreakpoint(newBreakpoint as N_Board.T_Breakpoint)
            }
            isResizable={false}
            isBounded={true}
            draggableCancel=".no-drag"
            onDragStop={handleDragStop}
            onDragStart={handleDragStart}
            margin={[10, 10]}
          >
            {layoutWidgets.map(wgt => {
              // console.log(layoutWidgets)
              const widgetType = wgt.widget_type_details.widget_type
              const widgetSizes = WIDGET_SIZE_MAP[widgetType]
              const Widget = WIDGET_TYPE_MAP[widgetType]

              return (
                <Widget
                  key={wgt.id}
                  userId={userId}
                  widget={wgt}
                  breakpoint={breakpoint}
                  layouts={layouts}
                  setLayouts={setLayouts}
                  metadata={wgt?.metadata && JSON.parse(wgt.metadata)}
                >
                  <div className="flex gap-1 flex-wrap">
                    {widgetSizes.length > 1 &&
                      widgetSizes.map(key => (
                        <Button
                          key={key}
                          variant="outline"
                          size="default"
                          className="no-drag"
                          onClick={() => resizeWidget(wgt.id, key)}
                        >
                          {key.toUpperCase()}
                        </Button>
                      ))}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="no-drag"
                      onClick={() => handleWidgetDelete(wgt.id)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </Widget>
              )
            })}
          </ResponsiveGridLayout>
        </div>
      </div>
    </div>
  )
}

export default BoardRGL
