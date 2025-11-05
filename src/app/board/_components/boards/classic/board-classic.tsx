'use client'

// ============= RGL STYLES =============
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
// ======================================

import { BoardProvider, useBoardContext } from '@/app/_contexts/board-context'
import { I_BoardContextProps } from '@/app/_types'
import { I_BoardProps } from '@/app/board/_components/_types'
import RGL from '@/app/board/_components/boards/rgl'
import { Button } from '@/components/ui/button'
import { WIDGET_SIZE_MAP, WIDGET_TYPE_MAP } from '@/lib/config'
import { useState } from 'react'

const BoardClassicRGL: React.FC<I_BoardProps> = ({ initialWidgetTypes }) => {
  const {
    layouts,
    isDraggable,
    layoutWidgets,
    rowHeight,
    setBreakpoint,
    addWidget,
    resizeWidget,
    handleDragStart,
    handleDragStop,
    handleLayoutChange,
    handleWidthChange,
  } = useBoardContext()
  const [previewMode, setPreviewMode] = useState<boolean>(false)

  return (
    <RGL
      // RGL props
      layouts={layouts}
      rowHeight={rowHeight}
      onLayoutChange={handleLayoutChange}
      onWidthChange={handleWidthChange}
      onBreakpointChange={newBreakpoint =>
        setBreakpoint(newBreakpoint as N_Board.T_Breakpoint)
      }
      isResizable={false}
      isDraggable={isDraggable}
      isBounded={true}
      onDragStop={handleDragStop}
      onDragStart={handleDragStart}
      // Custom props
      widgetTypesController={{
        widgetTypes: initialWidgetTypes!,
        onClick: addWidget,
      }}
      previewController={{
        isEnabled: previewMode,
        onClick: () => setPreviewMode(prev => !prev),
      }}
    >
      {layoutWidgets.map(wgt => {
        const widgetType = wgt.widget_type_details.widget_type
        const widgetSizes = WIDGET_SIZE_MAP[widgetType]
        const Widget = WIDGET_TYPE_MAP[widgetType]

        return (
          <Widget key={wgt.id} widget={wgt}>
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
    </RGL>
  )
}

const BoardClassic: React.FC<
  I_BoardProps & Omit<I_BoardContextProps, 'children'>
> = ({ initialWidgetTypes, ...props }) => {
  return (
    <BoardProvider {...props}>
      <BoardClassicRGL initialWidgetTypes={initialWidgetTypes} />
    </BoardProvider>
  )
}

export default BoardClassic
