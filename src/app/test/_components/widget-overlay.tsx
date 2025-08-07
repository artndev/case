'use client'

import React from 'react'

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

/**
 * WidgetOverlay is used to render the dragging widget overlay with partial opacity.
 */
const WidgetOverlay: React.FC<{
  widget: I_Widget
  gridSize: number
}> = ({ widget, gridSize }) => {
  const size = sizeMap[widget.size]

  return (
    <div
      style={{
        width: size.w * gridSize,
        height: size.h * gridSize,
      }}
      className="
        bg-blue-600 text-white font-bold rounded-md 
        p-2 shadow-lg opacity-80 pointer-events-none select-none
        transition-opacity duration-250 ease-in-out
        box-border
      "
    >
      Widget {widget.id} ({widget.size})
    </div>
  )
}

export default WidgetOverlay
