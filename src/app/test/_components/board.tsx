'use client'

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core'
import { useState } from 'react'
import Widget from './widget'
import WidgetOverlay from './widget-overlay'

declare global {
  interface I_Widget {
    id: number
    size: 'sm' | 'md' | 'bg'
    x: number
    y: number
  }
}

const GRID_SIZE = 50
const MAX_COLS = 12
const MAX_ROWS = 6

const initialWidgets = [
  { id: 1, size: 'sm', x: 0, y: 0 },
  { id: 2, size: 'md', x: 3, y: 0 },
  { id: 3, size: 'bg', x: 0, y: 2 },
] as I_Widget[]

const sizeMap = {
  sm: { w: 3, h: 1 },
  md: { w: 6, h: 2 },
  bg: { w: 9, h: 2 },
}

const Board = () => {
  const [widgets, setWidgets] = useState<I_Widget[]>(initialWidgets)
  const [activeId, setActiveId] = useState<number | null>(null)

  const handleDragEnd = (event: DragEndEvent) => {
    const { delta, active } = event

    const draggedWidget = widgets.find(w => w.id === active.id)
    if (!draggedWidget || !active.data.current) return

    const { x: originalX, y: originalY, size } = active.data.current as I_Widget
    const sizeInfo = sizeMap[size]

    // Calculate the new snapped position based on original + delta
    const dx = Math.round(delta.x / GRID_SIZE)
    const dy = Math.round(delta.y / GRID_SIZE)

    let newX = originalX + dx
    let newY = originalY + dy

    // Clamp to grid
    newX = Math.max(0, Math.min(MAX_COLS - sizeInfo.w, newX))
    newY = Math.max(0, Math.min(MAX_ROWS - sizeInfo.h, newY))

    // Check for collisions
    const isOverlapping = widgets.some(other => {
      if (other.id === draggedWidget.id) return false

      const otherSize = sizeMap[other.size]

      return (
        newX < other.x + otherSize.w &&
        newX + sizeInfo.w > other.x &&
        newY < other.y + otherSize.h &&
        newY + sizeInfo.h > other.y
      )
    })

    // Update position if valid
    if (!isOverlapping) {
      setWidgets(prev =>
        prev.map(widget =>
          widget.id === draggedWidget.id
            ? { ...widget, x: newX, y: newY }
            : widget
        )
      )
    }

    setActiveId(null)
  }

  const handleDragStart = (event: DragStartEvent) =>
    setActiveId(event.active.id as number)

  const handleDragCancel = () => setActiveId(null)

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div
        className="relative max-w-full mx-auto bg-white border rounded-md overflow-hidden"
        style={{
          width: `${GRID_SIZE * MAX_COLS}px`,
          height: `${GRID_SIZE * MAX_ROWS}px`,
          backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
          backgroundImage:
            'linear-gradient(to right, #eee 1px, transparent 1px), linear-gradient(to bottom, #eee 1px, transparent 1px)',
        }}
      >
        {widgets.map(widget => (
          <Widget
            key={widget.id}
            widget={widget}
            gridSize={GRID_SIZE}
            isDragging={activeId === widget.id}
          />
        ))}

        <DragOverlay
          dropAnimation={{
            duration: 300,
            easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
          }}
        >
          {activeId &&
            (() => {
              const activeWidget = widgets.find(
                widget => widget.id === activeId
              )

              return activeWidget ? (
                <WidgetOverlay widget={activeWidget} gridSize={GRID_SIZE} />
              ) : null
            })()}
        </DragOverlay>
      </div>
    </DndContext>
  )
}

export default Board
