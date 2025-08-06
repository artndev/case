'use client'

import { useDraggable } from '@dnd-kit/core'

const sizeMap = {
  sm: { w: 3, h: 1 },
  md: { w: 6, h: 2 },
  bg: { w: 9, h: 2 },
}

const Widget: React.FC<{
  widget: I_Widget
  gridSize: number
  isDragging: boolean
}> = ({ widget, gridSize }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: widget.id,
    data: widget,
  })

  const size = sizeMap[widget.size]

  const style: React.CSSProperties = {
    position: 'absolute',
    left: widget.x * gridSize,
    top: widget.y * gridSize,
    width: size.w * gridSize,
    height: size.h * gridSize,
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="bg-blue-500 text-white font-bold p-2 rounded shadow-md select-none user-select-none cursor-grab"
    >
      Widget {widget.id} ({widget.size})
    </div>
  )
}

export default Widget
