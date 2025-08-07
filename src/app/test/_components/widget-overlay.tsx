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
        backgroundColor: 'royalblue',
        color: 'white',
        fontWeight: 'bold',
        borderRadius: 6,
        padding: 10,
        boxSizing: 'border-box',
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        opacity: 0.8,
        transition: 'opacity 250ms ease-in-out',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      Widget {widget.id} ({widget.size})
    </div>
  )
}

export default WidgetOverlay
