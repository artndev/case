'use client'

import { Button } from '@/components/ui/button'
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core'
import { useRef, useState } from 'react'
import { I_Widget, WidgetSize } from '../_types'
import Widget from './widget'
import WidgetOverlay from './widget-overlay'

const GRID_SIZE = 50
const MAX_COLS = 12
const MAX_ROWS = 6

// Map each widget size to its grid dimensions
export const sizeMap: Record<WidgetSize, { w: number; h: number }> = {
  sm: { w: 3, h: 1 },
  md: { w: 6, h: 2 },
  bg: { w: 9, h: 2 },
}

/**
 * Determine if two widgets overlap on the grid
 */
const isOverlapping = (a: I_Widget, b: I_Widget): boolean => {
  const { w: aw, h: ah } = sizeMap[a.size]
  const { w: bw, h: bh } = sizeMap[b.size]

  return a.x + aw > b.x && b.x + bw > a.x && a.y + ah > b.y && b.y + bh > a.y
}

/**
 * Clamp a value within a [min, max] range
 */
const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(value, max))
}

/**
 * Ensure widget stays fully inside grid boundaries
 */
const clampPosition = (
  x: number,
  y: number,
  size: WidgetSize
): { x: number; y: number } => {
  const { w, h } = sizeMap[size]

  return {
    x: clamp(x, 0, MAX_COLS - w),
    y: clamp(y, 0, MAX_ROWS - h),
  }
}

/**
 * Find first free grid spot where widget fits without overlapping
 */
const findEmptySpot = (
  widgets: I_Widget[],
  widget: I_Widget
): { x: number; y: number } | null => {
  const { w, h } = sizeMap[widget.size]

  for (let row = 0; row <= MAX_ROWS - h; row++) {
    for (let col = 0; col <= MAX_COLS - w; col++) {
      const candidate = { ...widget, x: col, y: row }
      const isOverlapped = widgets.some(
        wgt => wgt.id !== widget.id && isOverlapping(candidate, wgt)
      )

      if (!isOverlapped) return { x: col, y: row }
    }
  }

  return null
}

/**
 * Recursively update widgets to avoid overlap when moving one \
 * _Run BFS from start until all widgets are placed without any collisions_
 */
const pushWidgets = (
  widgets: I_Widget[],
  start: I_Widget
): I_Widget[] | null => {
  const updated = widgets.map(wgt => ({ ...wgt }))
  const queue: I_Widget[] = [{ ...start }]

  while (queue.length) {
    const current = queue.shift()!
    const collisions = updated.filter(
      wgt => wgt.id !== current.id && isOverlapping(current, wgt)
    )

    for (const wgt of collisions) {
      const spot = findEmptySpot(updated, wgt)
      if (!spot) return null

      wgt.x = spot.x
      wgt.y = spot.y

      queue.push({ ...wgt })
    }
  }

  return updated
}

const initialWidgets: I_Widget[] = [
  { id: 1, size: 'sm', x: 0, y: 4 },
  { id: 2, size: 'md', x: 0, y: 2 },
  { id: 3, size: 'bg', x: 0, y: 0 },
]

const Board = () => {
  const [widgets, setWidgets] = useState<I_Widget[]>(initialWidgets)
  const [draggingWidgets, setDraggingWidgets] =
    useState<I_Widget[]>(initialWidgets)
  const [activeId, setActiveId] = useState<number | null>(null)

  // Remember starting grid coords of dragged widget
  const startPos = useRef<{ x: number; y: number } | null>(null)

  const currentId = useRef(initialWidgets.length + 1)

  const activeWidget = activeId
    ? (draggingWidgets.find(wgt => wgt.id === activeId) ?? null)
    : null

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id as number
    setActiveId(id)

    setDraggingWidgets(widgets)

    const widget = widgets.find(wgt => wgt.id === id)
    startPos.current = widget ? { x: widget.x, y: widget.y } : null
  }

  const handleDragMove = (event: DragMoveEvent) => {
    if (activeId === null || !startPos.current) return

    const original = widgets.find(wgt => wgt.id === activeId)
    if (!original) return

    // Convert pixel drag to grid delta
    const dx = Math.round(event.delta.x / GRID_SIZE)
    const dy = Math.round(event.delta.y / GRID_SIZE)

    const { x, y } = clampPosition(
      startPos.current.x + dx,
      startPos.current.y + dy,
      original.size
    )

    const start: I_Widget = { ...original, x, y }
    const updated = widgets.map(wgt => (wgt.id === activeId ? start : wgt))
    const pushed = pushWidgets(updated, start)
    setDraggingWidgets(pushed ?? widgets)
  }

  const handleDragEnd = (_: DragEndEvent) => {
    if (activeId === null) return

    // Commit positions
    setWidgets(draggingWidgets)

    setActiveId(null)
  }

  const handleDragCancel = () => {
    setDraggingWidgets(widgets)
    setActiveId(null)
  }

  const addWidget = (size: I_Widget['size']) => {
    const widget: I_Widget = { id: currentId.current++, size, x: 0, y: 0 }
    const spot = findEmptySpot(widgets, widget)

    if (!spot) {
      alert('No space available')
      return
    }

    widget.x = spot.x
    widget.y = spot.y

    setWidgets(prev => [...prev, widget])
    setDraggingWidgets(prev => [...prev, widget])
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-3">
        <Button onClick={() => addWidget('sm')}>Add Small</Button>
        <Button onClick={() => addWidget('md')}>Add Medium</Button>
        <Button onClick={() => addWidget('bg')}>Add Large</Button>
      </div>

      <DndContext
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div
          className="relative border rounded-sm bg-white"
          style={{
            width: GRID_SIZE * MAX_COLS,
            height: GRID_SIZE * MAX_ROWS,
            backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
            backgroundImage:
              'linear-gradient(to right, #eee 1px, transparent 1px), linear-gradient(to bottom, #eee 1px, transparent 1px)',
          }}
        >
          {draggingWidgets.map(wgt => (
            <Widget
              key={wgt.id}
              widget={wgt}
              gridSize={GRID_SIZE}
              isDragging={wgt.id === activeId}
              style={{ visibility: wgt.id === activeId ? 'hidden' : 'visible' }}
            />
          ))}

          <DragOverlay>
            {activeWidget && (
              <WidgetOverlay widget={activeWidget} gridSize={GRID_SIZE} />
            )}
          </DragOverlay>
        </div>
      </DndContext>
    </div>
  )
}

export default Board
