'use client'

import { Button } from '@/components/ui/button'
import { sizeMap } from '@/lib/config'
import { cn } from '@/lib/utils'
import { Smartphone, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Layout, Responsive, WidthProvider } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { v4 as uuidv4 } from 'uuid'
import { I_BoardProps } from '../_types'

const BREAKPOINTS = { lg: 769, md: 768 }

const COLS = { lg: 12, md: 6 }

const ResponsiveGridLayout = WidthProvider(Responsive)

const BoardRGL: React.FC<I_BoardProps> = ({
  initialWidgets,
  initialWidgetTypes,
}) => {
  const initialLayouts: { [key: string]: Layout[] } = {
    lg: initialWidgets.map(wgt => ({
      i: wgt.id,
      x: 0,
      y: Infinity,
      w: sizeMap[wgt.size].w,
      h: sizeMap[wgt.size].h,
      static: false,
    })),
    md: initialWidgets.map(wgt => ({
      i: wgt.id,
      x: 0,
      y: Infinity,
      w: sizeMap[wgt.size].w,
      h: sizeMap[wgt.size].h,
      static: false,
    })),
  }

  const [widgets, setWidgets] = useState<N_Board.T_WidgetMixed[] | null>(null)
  const [layouts, setLayouts] = useState<{ [key: string]: Layout[] } | null>(
    null
  )
  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const [breakpoint, setBreakpoint] = useState<'lg' | 'md'>('lg')
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

      const size = Object.entries(sizeMap).find(
        ([, val]) => val.w === layoutWidget.w && val.h === layoutWidget.h
      )?.[0] as N_WidgetSettings.T_WidgetSize

      return {
        ...wgt,
        size: size ?? 'md',
        x: layoutWidget.x,
        y: layoutWidget.y,
      }
    })
  }

  /* Handle layout change (drag or resize) */
  const handleLayoutChange = (layout: Layout[]) => {
    if (!isInitialized) {
      return
    }

    setWidgets(layoutToWidgets(widgets!, layout))
  }

  /* Add a new widget */
  const addWidget = (size: N_WidgetSettings.T_WidgetSize, type: any) => {
    if (!isInitialized) {
      return
    }

    setWidgets(prev => [
      ...prev!,
      {
        id: uuidv4(),
        size,
        x: 0,
        y: Infinity, // Let RGL place it automatically at first free spot
        widget_type_id: type.id,
        widget_type_details: type,
      },
    ])
  }

  /* Delete a widget */
  const deleteWidgetHandler = async (id: string) => {
    if (!isInitialized) {
      return
    }

    setWidgets(prev => prev!.filter(wgt => wgt.id !== id))
  }

  /* Resize a widget */
  const resizeWidget = (id: string, size: N_WidgetSettings.T_WidgetSize) => {
    if (!isInitialized) {
      return
    }

    setWidgets(prev =>
      prev!.map(wgt =>
        wgt.id === id
          ? {
              ...wgt,
              size,
            }
          : wgt
      )
    )
  }

  useEffect(() => {
    if (!isInitialized) {
      return
    }

    setLayouts(prev => ({
      ...Object.entries(prev!).reduce(
        (acc, [key, val]) => {
          acc[key] = val.map(lwgt => {
            const widget = widgets!.find(wgt => wgt.id === lwgt.i)
            if (!widget) {
              return lwgt
            }

            return {
              ...lwgt,
              w: sizeMap[widget.size].w,
              h: sizeMap[widget.size].h,
            }
          })

          return acc
        },
        {} as { [key: string]: Layout[] }
      ),
    }))
  }, [widgets, breakpoint])

  useEffect(() => {
    if (!isInitialized) {
      return
    }

    localStorage.setItem('layouts', JSON.stringify(layouts))
  }, [layouts])

  useEffect(() => {
    if (!isInitialized) {
      return
    }

    localStorage.setItem('widgets', JSON.stringify(widgets))
  }, [widgets])

  useEffect(() => {
    const savedLayouts = localStorage.getItem('layouts')
    const savedWidgets = localStorage.getItem('widgets')

    setLayouts(savedLayouts ? JSON.parse(savedLayouts) : initialLayouts)
    setWidgets(savedWidgets ? JSON.parse(savedWidgets) : initialWidgets)
    setIsInitialized(true)
  }, [])

  return (
    <div className="flex flex-col gap-6 max-w-[900px] w-full">
      <div className="flex flex-col gap-6 self-start">
        {initialWidgetTypes.map(type => (
          <div key={type.id} className="flex flex-col gap-3">
            {type.alias}
            <div className="flex gap-3">
              <Button onClick={() => addWidget('sm', type)}>Add Small</Button>
              <Button onClick={() => addWidget('md', type)}>Add Medium</Button>
              <Button onClick={() => addWidget('lg', type)}>Add Large</Button>
            </div>
          </div>
        ))}

        <Button
          size={'icon'}
          variant={breakpoint === 'lg' ? 'outline' : 'default'}
          onClick={() => setPreviewMode(prev => !prev)}
          className="hidden md:flex md:justify-center md:items-center"
        >
          <Smartphone />
        </Button>
      </div>

      {layouts && widgets ? (
        <ResponsiveGridLayout
          className={cn(
            'layout border rounded-sm bg-white',
            previewMode && 'w-[min(768px,_100%)]'
          )}
          layouts={layouts}
          breakpoints={BREAKPOINTS}
          cols={COLS}
          rowHeight={10}
          onLayoutChange={handleLayoutChange}
          onBreakpointChange={newBreakpoint =>
            setBreakpoint(newBreakpoint as 'lg' | 'md')
          }
          isResizable={false}
          isBounded={true}
          draggableCancel=".no-drag"
        >
          {widgets.map(wgt => {
            return (
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
            )
          })}
        </ResponsiveGridLayout>
      ) : (
        'Loading...'
      )}
    </div>
  )
}

export default BoardRGL
