'use client'

import { useDraggable } from '@dnd-kit/core'
import React from 'react'
import { I_WidgetProps } from '../_types'
import { sizeMap } from './board'

const Widget: React.FC<I_WidgetProps> = ({
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
        position: 'absolute',
        left: widget.x * gridSize,
        top: widget.y * gridSize,
        width: size.w * gridSize,
        height: size.h * gridSize,
        cursor: isDragging ? 'grabbing' : 'grab',
        transition: isDragging
          ? 'none'
          : 'left 250ms ease-in-out, top 250ms ease-in-out',
        willChange: 'left, top',
        ...style,
      }}
      className={`
        bg-blue-600 text-white font-semibold rounded-sm 
        p-3 shadow-sm select-none touch-none
      `}
    >
      Widget {widget.id} ({widget.size})
    </div>
  )
}

export default Widget
