'use client'

// ============= RGL STYLES =============
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
// ======================================

import { BoardProvider, useBoardContext } from '@/app/_contexts/board-context'
import { I_BoardContextProps } from '@/app/_types'
import { I_BoardProps } from '@/app/board/_components/_types'
import RGL from '@/app/board/_components/boards/rgl'
import { WIDGET_TYPE_MAP } from '@/lib/config'

const BoardPreviewRGL = () => {
  const {
    layouts,
    layoutWidgets,
    rowHeight,
    setBreakpoint,
    handleLayoutChange,
    handleWidthChange,
  } = useBoardContext()

  return (
    <RGL
      layouts={layouts}
      rowHeight={rowHeight}
      onLayoutChange={handleLayoutChange}
      onWidthChange={handleWidthChange}
      onBreakpointChange={newBreakpoint =>
        setBreakpoint(newBreakpoint as N_Board.T_Breakpoint)
      }
      isResizable={false}
      isDraggable={false}
      isBounded={true}
    >
      {layoutWidgets.map(wgt => {
        const widgetType = wgt.widget_type_details.widget_type
        const Widget = WIDGET_TYPE_MAP[widgetType]

        return <Widget key={wgt.id} widget={wgt} isInspected />
      })}
    </RGL>
  )
}

const BoardPreview: React.FC<
  PartialKeys<I_BoardProps, 'initialWidgetTypes'> &
    Omit<I_BoardContextProps, 'userId' | 'children'>
> = ({ ...props }) => {
  return (
    // userId = "guest" because it can be omitted in the preview mode
    <BoardProvider userId="guest" {...props}>
      <BoardPreviewRGL />
    </BoardProvider>
  )
}

export default BoardPreview
