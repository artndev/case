'use client'

import {
  DndContext,
  DragStartEvent,
  DragMoveEvent,
  DragEndEvent,
  DragOverlay,
} from '@dnd-kit/core'
import { useState, useRef } from 'react'
import Widget from './widget'
import WidgetOverlay from './widget-overlay'

interface I_Widget {
  id: number
  size: 'sm' | 'md' | 'bg'
  x: number
  y: number
}

const GRID_SIZE = 50
const MAX_COLS = 12
const MAX_ROWS = 6

const sizeMap = {
  sm: { w: 3, h: 1 },
  md: { w: 6, h: 2 },
  bg: { w: 9, h: 2 },
}

// Check if two widgets overlap on the grid
function isOverlapping(a: I_Widget, b: I_Widget): boolean {
  const sizeA = sizeMap[a.size]
  const sizeB = sizeMap[b.size]
  return !(
    a.x + sizeA.w <= b.x ||
    b.x + sizeB.w <= a.x ||
    a.y + sizeA.h <= b.y ||
    b.y + sizeB.h <= a.y
  )
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max))
}

function clampPosition(x: number, y: number, size: keyof typeof sizeMap) {
  const s = sizeMap[size]
  return {
    x: clamp(x, 0, MAX_COLS - s.w),
    y: clamp(y, 0, MAX_ROWS - s.h),
  }
}

function pushWidgets(
  widgets: I_Widget[],
  moving: I_Widget,
  excludeId?: number
): I_Widget[] {
  const newWidgets = widgets.map(w => ({ ...w }))
  const grid = Array.from(
    { length: MAX_ROWS },
    () => Array(MAX_COLS).fill(null) as (number | null)[]
  )

  // Mark occupied cells
  for (const w of newWidgets) {
    if (w.id === moving.id) continue // Skip moving widget for now
    const { w: width, h: height } = sizeMap[w.size]
    for (let dy = 0; dy < height; dy++) {
      for (let dx = 0; dx < width; dx++) {
        const gx = w.x + dx
        const gy = w.y + dy
        if (gx < MAX_COLS && gy < MAX_ROWS) {
          grid[gy][gx] = w.id
        }
      }
    }
  }

  const resultWidgets = newWidgets.filter(w => w.id !== moving.id)
  resultWidgets.push(moving)

  const movedWidgets = new Set<number>()
  const queue = [moving]

  while (queue.length > 0) {
    const current = queue.shift()!
    const { w: width, h: height } = sizeMap[current.size]

    // Check for overlaps
    const overlapping = resultWidgets.filter(
      w => w.id !== current.id && isOverlapping(current, w)
    )

    for (const overlap of overlapping) {
      if (movedWidgets.has(overlap.id)) continue

      // Find next empty spot
      const spot = findNextEmptySpot(resultWidgets, overlap)
      if (spot) {
        overlap.x = spot.x
        overlap.y = spot.y
        queue.push(overlap)
        movedWidgets.add(overlap.id)
      }
    }
  }

  return resultWidgets
}

function findNextEmptySpot(widgets: I_Widget[], widget: I_Widget) {
  const { w: width, h: height } = sizeMap[widget.size]

  for (let y = 0; y <= MAX_ROWS - height; y++) {
    for (let x = 0; x <= MAX_COLS - width; x++) {
      const candidate = { ...widget, x, y }
      const overlap = widgets.some(
        w => w.id !== widget.id && isOverlapping(candidate, w)
      )
      if (!overlap) return { x, y }
    }
  }
  return null
}

const initialWidgets: I_Widget[] = [
  { id: 1, size: 'sm', x: 0, y: 0 },
  { id: 2, size: 'md', x: 3, y: 0 },
  { id: 3, size: 'bg', x: 0, y: 2 },
]

const Board = () => {
  const [widgets, setWidgets] = useState<I_Widget[]>(initialWidgets)
  const [activeId, setActiveId] = useState<number | null>(null)
  const [draggingWidgets, setDraggingWidgets] = useState<I_Widget[]>(widgets)
  const initialPos = useRef<{ x: number; y: number } | null>(null)

  const activeWidget = activeId
    ? (draggingWidgets.find(w => w.id === activeId) ?? null)
    : null

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number)
    setDraggingWidgets(widgets)

    const widget = widgets.find(w => w.id === event.active.id)
    initialPos.current = widget ? { x: widget.x, y: widget.y } : null
  }

  const handleDragMove = (event: DragMoveEvent) => {
    if (activeId === null || !initialPos.current) return

    const original = widgets.find(w => w.id === activeId)
    if (!original) return

    const deltaX = Math.round(event.delta.x / GRID_SIZE)
    const deltaY = Math.round(event.delta.y / GRID_SIZE)

    const newPos = clampPosition(
      initialPos.current.x + deltaX,
      initialPos.current.y + deltaY,
      original.size
    )

    const movedWidget: I_Widget = {
      ...original,
      x: newPos.x,
      y: newPos.y,
    }

    const updatedWidgets = widgets.map(w =>
      w.id === activeId ? movedWidget : w
    )

    const pushed = pushWidgets(updatedWidgets, movedWidget, activeId)

    setDraggingWidgets(pushed)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    if (!activeId) return
    setWidgets(draggingWidgets)
    setActiveId(null)
  }

  const handleDragCancel = () => {
    setActiveId(null)
    setDraggingWidgets(widgets)
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div
        style={{
          position: 'relative',
          width: GRID_SIZE * MAX_COLS,
          height: GRID_SIZE * MAX_ROWS,
          backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
          backgroundImage:
            'linear-gradient(to right, #eee 1px, transparent 1px), linear-gradient(to bottom, #eee 1px, transparent 1px)',
        }}
      >
        {draggingWidgets.map(widget => (
          <Widget
            key={widget.id}
            widget={widget}
            gridSize={GRID_SIZE}
            isDragging={widget.id === activeId}
            style={{
              visibility: widget.id === activeId ? 'hidden' : 'visible',
            }}
          />
        ))}

        <DragOverlay>
          {activeWidget && (
            <WidgetOverlay widget={activeWidget} gridSize={GRID_SIZE} />
          )}
        </DragOverlay>
      </div>
    </DndContext>
  )
}

export default Board
