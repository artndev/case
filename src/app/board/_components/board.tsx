'use client'

import { Button } from '@/components/ui/button'
import { BREAKPOINTS, COLS, SIZE_MAP } from '@/lib/config'
import { cn } from '@/lib/utils'
import { Smartphone, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Layout, Responsive, WidthProvider } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { v4 as uuidv4 } from 'uuid'
import { I_BoardProps } from '../_types'

const ResponsiveGridLayout = WidthProvider(Responsive)

const BoardRGL: React.FC<I_BoardProps> = ({
  initialWidgets,
  initialWidgetTypes,
  initialLayouts,
}) => {
  const [widgets, setWidgets] =
    useState<N_Board.T_WidgetMixed[]>(initialWidgets)
  const [layouts, setLayouts] = useState<N_Board.T_Layouts>(initialLayouts)
  const [breakpoint, setBreakpoint] = useState<N_Board.T_Breakpoint>('md')
  const [previewMode, setPreviewMode] = useState<boolean>(false)

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
      )![0] as N_WidgetSettings.T_WidgetSize

      return {
        ...wgt,
        size,
        x: layoutWidget.x,
        y: layoutWidget.y,
      }
    })
  }

  const layoutWidgets = useMemo(
    () => layoutToWidgets(widgets, layouts[breakpoint]),
    [layouts, widgets, breakpoint]
  )

  /* Handle layout change (drag or resize) */
  const handleLayoutChange = (
    _: Layout[],
    allLayouts: ReactGridLayout.Layouts
  ) => setLayouts(allLayouts)

  /* Add a new widget */
  const addWidget = (size: N_WidgetSettings.T_WidgetSize, type: any) => {
    const widget = {
      id: uuidv4(),
      size,
      widget_type_id: type.id,
      widget_type_details: type,
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
  }

  /* Delete a widget */
  const deleteWidgetHandler = async (id: string) => {
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
      prev.map(wgt => (wgt.id === id ? { ...wgt, size } : wgt))
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
            breakpoints={BREAKPOINTS}
            cols={COLS}
            rowHeight={10}
            onLayoutChange={handleLayoutChange}
            onBreakpointChange={newBreakpoint =>
              setBreakpoint(newBreakpoint as 'md' | 'sm')
            }
            isResizable={false}
            isBounded={true}
            draggableCancel=".no-drag"
          >
            {layoutWidgets.map(wgt => (
              <div
                key={wgt.id}
                className="border rounded-sm bg-gray-50 p-2 relative"
              >
                <div className="drag-handle cursor-move font-bold mb-1">
                  {wgt.widget_type_details.alias}
                </div>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {(['sm', 'md', 'lg'] as N_WidgetSettings.T_WidgetSize[]).map(
                    key => (
                      <Button
                        key={key}
                        variant="ghost"
                        size="icon"
                        className="no-drag"
                        onClick={() => resizeWidget(wgt.id, key)}
                      >
                        {key.toUpperCase()}
                      </Button>
                    )
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="no-drag"
                    onClick={() => deleteWidgetHandler(wgt.id)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            ))}
          </ResponsiveGridLayout>
        </div>
      </div>
    </div>
  )
}

export default BoardRGL
