'use client'

import { sizeMap } from '@/lib/config'
import React from 'react'
import { I_WidgetOverlayProps } from '../_types'

const WidgetOverlay: React.FC<I_WidgetOverlayProps> = ({
  widget,
  gridSize,
}) => {
  const size = sizeMap[widget.size]

  return (
    <div
      style={{
        width: size.w * gridSize,
        height: size.h * gridSize,
      }}
      className="p-1"
    >
      <div
        className={`
          w-full h-full bg-blue-600 text-white font-semibold rounded-sm 
          p-3 shadow-md select-none pointer-events-none
          opacity-80 transition-opacity duration-250 ease-in-out
        `}
      >
        ⠿
      </div>
    </div>
  )
}

export default WidgetOverlay
