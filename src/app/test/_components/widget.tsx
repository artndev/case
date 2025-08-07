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

const Widget: React.FC<{
  widget: I_Widget
  gridSize: number
  style?: React.CSSProperties
  isDragging: boolean
}> = ({ widget, gridSize, style = {}, isDragging }) => {
  const size = sizeMap[widget.size]

  const { attributes, listeners, setNodeRef } = useDraggable({
    id: widget.id,
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        position: 'absolute',
        left: widget.x * gridSize,
        top: widget.y * gridSize,
        width: size.w * gridSize,
        height: size.h * gridSize,
        backgroundColor: 'royalblue',
        color: 'white',
        fontWeight: 'bold',
        borderRadius: 6,
        padding: 10,
        boxSizing: 'border-box',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        userSelect: 'none',
        touchAction: 'none',
        cursor: isDragging ? 'grabbing' : 'grab',
        transition: isDragging ? 'none' : 'left 250ms ease, top 250ms ease',
        willChange: 'left, top',
        ...style,
      }}
      data-id={widget.id}
      draggable={false}
    >
      Widget {widget.id} ({widget.size})
    </div>
  )
}

export default Widget
