'use client'

import React from 'react'
import { useDraggable } from '@dnd-kit/core'

const sizeMap = {
  sm: { w: 3, h: 1 },
  md: { w: 6, h: 2 },
  bg: { w: 9, h: 2 },
}

interface I_Widget {
  id: number
  size: keyof typeof sizeMap
  x: number
  y: number
}

interface WidgetProps {
  widget: I_Widget
  gridSize: number
  style?: React.CSSProperties
  isDragging: boolean
}

/**
 * Widget component is draggable and positioned absolutely within the grid container.
 * It changes cursor and transition styles based on dragging state.
 */
const Widget: React.FC<WidgetProps> = ({
  widget,
  gridSize,
  style = {},
  isDragging,
}) => {
  const size = sizeMap[widget.size]

  const { attributes, listeners, setNodeRef } = useDraggable({
    id: widget.id,
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      data-id={widget.id}
      draggable={false}
      style={{
        left: widget.x * gridSize,
        top: widget.y * gridSize,
        width: size.w * gridSize,
        height: size.h * gridSize,
        cursor: isDragging ? 'grabbing' : 'grab',
        transition: isDragging ? 'none' : 'left 250ms ease, top 250ms ease',
        willChange: 'left, top',
        position: 'absolute',
        ...style,
      }}
      className={`
        bg-blue-600 text-white font-bold rounded-md 
        p-2 shadow-md select-none touch-none
        ${isDragging ? 'opacity-90' : 'opacity-100'}
        box-border
      `}
    >
      Widget {widget.id} ({widget.size})
    </div>
  )
}

export default Widget
