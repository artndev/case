'use client'

import { useDraggable } from '@dnd-kit/core'

const sizeMap = {
  sm: { w: 3, h: 1 },
  md: { w: 6, h: 2 },
  bg: { w: 9, h: 2 },
}

const WidgetOverlay: React.FC<{ widget: I_Widget; gridSize: number }> = ({
  widget,
  gridSize,
}) => {
  const { setNodeRef, transform } = useDraggable({
    id: widget.id,
    data: widget,
  })

  const size = sizeMap[widget.size]

  const style: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: size.w * gridSize,
    height: size.h * gridSize,
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    pointerEvents: 'none',
    zIndex: 999,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-blue-500 text-white font-bold p-2 rounded shadow-md select-none user-select-none cursor-grabbing"
    >
      Widget {widget.id} ({widget.size})
    </div>
  )
}

export default WidgetOverlay
