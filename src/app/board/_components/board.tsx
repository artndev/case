'use client'

import { useBoardContext } from '@/app/_contexts/board-context'
import { Button } from '@/components/ui/button'
import {
  BREAKPOINT_MAP,
  COL_MAP,
  WIDGET_SIZE_MAP,
  WIDGET_TYPE_MAP,
} from '@/lib/config'
import { cn } from '@/lib/utils'
import { Smartphone } from 'lucide-react'
import { useState } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
// Editable styles for RGL
// ? All changes can be inspected in global.css
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { I_BoardProps } from '../_types'

const ResponsiveGridLayout = WidthProvider(Responsive)

const BoardRGL: React.FC<I_BoardProps> = ({ initialWidgetTypes }) => {
  const {
    layouts,
    breakpoint,
    setBreakpoint,
    isDraggable,
    layoutWidgets,
    addWidget,
    resizeWidget,
    handleDragStart,
    handleDragStop,
    handleLayoutChange,
  } = useBoardContext()

  const [previewMode, setPreviewMode] = useState<boolean>(false)
  const [rowHeight, setRowHeight] = useState<number>(15)

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
        <div className="grid grid-cols-2 gap-6">
          {initialWidgetTypes.map(type => {
            const widgetSizes = WIDGET_SIZE_MAP[type.widget_type]

            return (
              <div key={type.id} className="flex flex-col gap-3">
                {type.alias}

                <Button onClick={() => addWidget(widgetSizes[0], type)}>
                  Add widget
                </Button>
              </div>
            )
          })}
        </div>

        {/* Preview toggle */}
        <Button
          size={'icon'}
          variant={previewMode ? 'default' : 'outline'}
          onClick={() => setPreviewMode(prev => !prev)}
          className="hidden lg:flex lg:justify-center lg:items-center"
        >
          <Smartphone />
        </Button>
      </div>

      {/* RGL container */}
      <div className="flex justify-center items-center w-full">
        <div
          className={cn(
            'layout w-full border rounded-md bg-white lg:w-full w-[350px] min-h-[700px]',
            previewMode && 'w-[350px]! lg:border-10'
          )}
        >
          <ResponsiveGridLayout
            key={breakpoint + '-' + rowHeight.toString()} // Important part in adjusting size of widget notes
            layouts={layouts!}
            breakpoints={BREAKPOINT_MAP}
            cols={COL_MAP}
            rowHeight={rowHeight}
            onLayoutChange={handleLayoutChange}
            onWidthChange={(containerWidth, margin, cols, containerPadding) => {
              const [marginX] = margin
              const [containerPaddingX] = containerPadding

              const totalMarginX = marginX * (cols - 1)
              const totalPaddingX = containerPaddingX * 2

              const colWidth =
                (containerWidth - totalMarginX - totalPaddingX) / cols

              setRowHeight(Math.round(colWidth))
            }}
            onBreakpointChange={newBreakpoint =>
              setBreakpoint(newBreakpoint as N_Board.T_Breakpoint)
            }
            isResizable={false}
            isDraggable={isDraggable}
            isBounded={true}
            draggableCancel=".no-drag"
            onDragStop={handleDragStop}
            onDragStart={handleDragStart}
            margin={{
              md: [30, 30],
              sm: [15, 15],
            }}
            containerPadding={[10, 10]}
          >
            {layoutWidgets.map(wgt => {
              // console.log(layoutWidgets)
              const widgetType = wgt.widget_type_details.widget_type
              const widgetSizes = WIDGET_SIZE_MAP[widgetType]
              const Widget = WIDGET_TYPE_MAP[widgetType]

              return (
                <Widget key={wgt.id} rowHeight={rowHeight} widget={wgt}>
                  {widgetSizes.length > 1 &&
                    widgetSizes.map(key => (
                      <Button
                        key={key}
                        variant="ghost"
                        className="justify-start"
                        onClick={() => resizeWidget(wgt.id, key)}
                      >
                        {key === 'sm' && 'Small size'}
                        {key === 'md' && 'Medium size'}
                        {key === 'lg' && 'Large size'}
                      </Button>
                    ))}
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
