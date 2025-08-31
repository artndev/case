'use client'

import { Button } from '@/components/ui/button'
import { BREAKPOINT_MAP, BREAKPOINTS, COL_MAP, SIZE_MAP } from '@/lib/config'
import { cn } from '@/lib/utils'
import { Smartphone, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Layout, Responsive, WidthProvider } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { I_BoardProps } from '../_types'
import { saveWidgets } from '../actions'
import { v4 as uuidv4 } from 'uuid'

const ResponsiveGridLayout = WidthProvider(Responsive)

const BoardRGL: React.FC<I_BoardProps> = ({
  userId,
  initialWidgets,
  initialWidgetTypes,
  initialLayouts,
}) => {
  const saveTimeout = useRef<NodeJS.Timeout | null>(null)
  const dirtyWidgets = useRef<Set<string>>(new Set())
  const prevPositions = useRef<Record<string, { x: number; y: number }>>({})

  const [widgets, setWidgets] =
    useState<N_Board.T_WidgetMixed[]>(initialWidgets)
  const [layouts, setLayouts] = useState<N_Board.T_Layouts>(initialLayouts)
  const [breakpoint, setBreakpoint] = useState<N_Board.T_Breakpoint>('md')
  const [previewMode, setPreviewMode] = useState<boolean>(false)

  // const selectiveSaveWidgets = async (
  //   widgets: N_Widgets_API.I_Widget[],
  //   breakpoint: N_Board.T_Breakpoint
  // ) => {
  //   BREAKPOINTS.forEach(async val => {
  //     if (val === breakpoint) {
  //       await saveWidgets(
  //         {
  //           user_id: userId,
  //           widgets,
  //         },
  //         breakpoint
  //       )
  //       return
  //     }

  //     await saveWidgets(
  //       {
  //         user_id: userId,
  //         widgets: widgets.map(
  //           ({ x, y, widget_type_id, ...payload }) => payload
  //         ),
  //       },
  //       breakpoint
  //     )
  //   })
  // }

  /* Layout to widgets transformation */
  const layoutToWidgets = (
    widgets: N_Board.T_WidgetMixed[],
    layout: Layout[]
  ) => {
    return widgets.map(wgt => {
      const layoutWidget = layout.find(lwgt => lwgt.i === wgt.id)
      if (!layoutWidget) {
        return wgt
      }

      const size = Object.entries(SIZE_MAP).find(
        ([_, val]) => val.w === layoutWidget.w && val.h === layoutWidget.h
      )?.[0] as N_WidgetSettings.T_WidgetSize

      return {
        ...wgt,
        size: size ?? 'md',
        x: layoutWidget.x,
        y: layoutWidget.y,
      }
    })
  }

  const layoutWidgets = useMemo(
    () => layoutToWidgets(widgets, layouts[breakpoint]),
    [layouts, widgets, breakpoint]
  )

  /* Just take layoutWidgets and save to db. THEY HAVE ALREADY BEEN FORMATTED! */
  /* Perform deletion of widgets and save it to db. DELETE IN ALL 'breakpoint' TABLES! */

  // useEffect(() => {
  //   if (saveTimeout.current) {
  //     clearTimeout(saveTimeout.current)
  //   }

  //   saveTimeout.current = setTimeout(() => {
  //     // selectiveSaveWidgets(
  //     //   layoutWidgets.filter(wgt => !wgt.isSaved),
  //     //   breakpoint
  //     // )

  //     dirtyWidgets.current.clear()
  //   }, 500)
  // }, [layouts, widgets, breakpoint])

  const handleDragStart = (layout: Layout[]) => {
    prevPositions.current = layout.reduce(
      (acc, lwgt) => {
        acc[lwgt.i] = {
          x: lwgt.x,
          y: lwgt.y,
        }

        return acc
      },
      {} as Record<string, { x: number; y: number }>
    )
  }

  const handleDragStop = (layout: Layout[]) => {
    dirtyWidgets.current = new Set([
      ...dirtyWidgets.current,
      ...layout
        .filter(lwgt => {
          const pos = prevPositions.current[lwgt.i]

          return pos && (pos.x !== lwgt.x || pos.y !== lwgt.y)
        })
        .map(lwgt => lwgt.i),
    ])

    setLayouts({
      ...layouts,
      [breakpoint]: layout,
    })
  }

  /* Handle layout change (drag or resize) */
  const handleLayoutChange = (_: any, allLayouts: ReactGridLayout.Layouts) =>
    setLayouts(allLayouts)

  /* Add a new widget */
  const addWidget = (
    size: N_WidgetSettings.T_WidgetSize,
    type: N_Widgets.I_WidgetType
  ) => {
    const { id, created_at, ...payload } = type
    const widget = {
      id: uuidv4(),
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
        {} as { [key: string]: Layout[] }
      ),
    }))

    dirtyWidgets.current.add(widget.id)
  }

  /* Delete a widget */
  const handleWidgetDelete = async (id: string) => {
    setWidgets(prev => prev.filter(wgt => wgt.id !== id))

    setLayouts(prev => ({
      ...Object.entries(prev).reduce(
        (acc, [key, val]) => {
          acc[key] = val.filter(lwgt => lwgt.i !== id)

          return acc
        },
        {} as { [key: string]: Layout[] }
      ),
    }))
  }

  /* Resize a widget */
  const resizeWidget = (id: string, size: N_WidgetSettings.T_WidgetSize) => {
    setWidgets(prev =>
      prev.map(wgt =>
        wgt.id === id
          ? {
              ...wgt,
              size,
              isSaved: false,
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
        {} as { [key: string]: Layout[] }
      ),
    }))

    dirtyWidgets.current.add(id)
  }

  useEffect(() => {
    document.cookie = `layouts=${JSON.stringify(layouts)}; path=/`
  }, [layouts])

  useEffect(() => {
    document.cookie = `widgets=${JSON.stringify(widgets)}; path=/`
  }, [widgets])

  /* Testing purposes */

  // useEffect(() => {
  //   console.log('Preview mode: ', previewMode)
  // }, [previewMode])

  return (
    <div className="flex flex-col gap-6 max-w-[900px] w-full">
      {/* Controls */}
      <div className="flex flex-col gap-6 self-start">
        {initialWidgetTypes.map(type => {
          // console.log(type)

          return (
            <div key={type.id} className="flex flex-col gap-3">
              {type.alias}
              <div className="flex gap-3">
                <Button onClick={() => addWidget('sm', type)}>Add Small</Button>
                <Button onClick={() => addWidget('md', type)}>
                  Add Medium
                </Button>
                <Button onClick={() => addWidget('lg', type)}>Add Large</Button>
              </div>
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
            layouts={layouts!}
            breakpoints={BREAKPOINT_MAP}
            cols={COL_MAP}
            rowHeight={10}
            onLayoutChange={handleLayoutChange}
            onBreakpointChange={newBreakpoint =>
              setBreakpoint(newBreakpoint as 'md' | 'sm')
            }
            isResizable={false}
            isBounded={true}
            draggableCancel=".no-drag"
            onDragStop={handleDragStop}
            onDragStart={handleDragStart}
          >
            {layoutWidgets.map(wgt => {
              console.log(layoutWidgets)

              return (
                <div
                  key={wgt.id}
                  className="border rounded-sm bg-gray-50 p-2 relative"
                >
                  <div className="drag-handle cursor-move font-bold mb-1">
                    {wgt.widget_type_details.alias}
                  </div>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {(
                      ['sm', 'md', 'lg'] as N_WidgetSettings.T_WidgetSize[]
                    ).map(key => (
                      <Button
                        key={key}
                        variant="ghost"
                        size="icon"
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
                </div>
              )
            })}
          </ResponsiveGridLayout>
        </div>
      </div>
    </div>
  )
}

export default BoardRGL
