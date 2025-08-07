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
import { Button } from '@/components/ui/button'

// Widget data model
type WidgetSize = 'sm' | 'md' | 'bg'
interface I_Widget {
  id: number
  size: WidgetSize
  x: number
  y: number
}

// Grid constants
const GRID_SIZE = 50
const MAX_COLS = 12
const MAX_ROWS = 6

// Map each widget size to its grid dimensions
const sizeMap: Record<WidgetSize, { w: number; h: number }> = {
  sm: { w: 3, h: 1 },
  md: { w: 6, h: 2 },
  bg: { w: 9, h: 2 },
}

/**
 * Determine if two widgets overlap on the grid
 */
function isOverlapping(a: I_Widget, b: I_Widget): boolean {
  const { w: aw, h: ah } = sizeMap[a.size]
  const { w: bw, h: bh } = sizeMap[b.size]
  return !(
    a.x + aw <= b.x ||
    b.x + bw <= a.x ||
    a.y + ah <= b.y ||
    b.y + bh <= a.y
  )
}

/**
 * Clamp a value within a [min, max] range
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max))
}

/**
 * Ensure widget stays fully inside grid boundaries
 */
function clampPosition(
  x: number,
  y: number,
  size: WidgetSize
): { x: number; y: number } {
  const { w, h } = sizeMap[size]
  return {
    x: clamp(x, 0, MAX_COLS - w),
    y: clamp(y, 0, MAX_ROWS - h),
  }
}

/**
 * Find first free grid spot where widget fits without overlapping
 */
function findNextEmptySpot(
  widgets: I_Widget[],
  widget: I_Widget
): { x: number; y: number } | null {
  const { w: width, h: height } = sizeMap[widget.size]
  for (let row = 0; row <= MAX_ROWS - height; row++) {
    for (let col = 0; col <= MAX_COLS - width; col++) {
      const candidate = { ...widget, x: col, y: row }
      const conflict = widgets.some(
        w => w.id !== widget.id && isOverlapping(candidate, w)
      )
      if (!conflict) return { x: col, y: row }
    }
  }
  return null
}

/**
 * Recursively push widgets to avoid overlap when moving one
 */
function pushWidgets(widgets: I_Widget[], moving: I_Widget): I_Widget[] | null {
  const updated = widgets.map(w => ({ ...w }))
  const idx = updated.findIndex(w => w.id === moving.id)
  if (idx >= 0) updated[idx] = { ...moving }
  else updated.push({ ...moving })

  const moved = new Set<number>()
  const queue: I_Widget[] = [moving]

  while (queue.length) {
    const current = queue.shift()!
    const collisions = updated.filter(
      w => w.id !== current.id && isOverlapping(current, w)
    )
    for (const w of collisions) {
      if (moved.has(w.id)) continue
      const spot = findNextEmptySpot(updated, w)
      if (!spot) return null
      w.x = spot.x
      w.y = spot.y
      moved.add(w.id)
      queue.push(w)
    }
  }
  return updated
}

// Initial board state
const initialWidgets: I_Widget[] = [
  { id: 1, size: 'sm', x: 0, y: 0 },
  { id: 2, size: 'md', x: 3, y: 0 },
  { id: 3, size: 'bg', x: 0, y: 2 },
]

export default function Board() {
  // Main and dragging state
  const [widgets, setWidgets] = useState<I_Widget[]>(initialWidgets)
  const [draggingWidgets, setDraggingWidgets] =
    useState<I_Widget[]>(initialWidgets)
  const [activeId, setActiveId] = useState<number | null>(null)

  // Remember starting grid coords of dragged widget
  const startPos = useRef<{ x: number; y: number } | null>(null)
  // New widget ID counter
  const nextId = useRef(initialWidgets.length + 1)

  const activeWidget =
    activeId !== null
      ? draggingWidgets.find(w => w.id === activeId) || null
      : null

  // On drag start, record initial position
  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id as number
    setActiveId(id)
    setDraggingWidgets(widgets)
    const widget = widgets.find(w => w.id === id)
    startPos.current = widget ? { x: widget.x, y: widget.y } : null
  }

  // On drag move, update position, clamp, and push overlaps
  const handleDragMove = (event: DragMoveEvent) => {
    if (activeId === null || !startPos.current) return
    const original = widgets.find(w => w.id === activeId)
    if (!original) return

    // Convert pixel drag to grid delta
    const dx = Math.round(event.delta.x / GRID_SIZE)
    const dy = Math.round(event.delta.y / GRID_SIZE)

    const { x, y } = clampPosition(
      startPos.current.x + dx,
      startPos.current.y + dy,
      original.size
    )

    const moved: I_Widget = { ...original, x, y }
    const updated = widgets.map(w => (w.id === activeId ? moved : w))

    const pushed = pushWidgets(updated, moved)
    setDraggingWidgets(pushed ?? widgets)
  }

  // On drag end, commit positions
  const handleDragEnd = (_: DragEndEvent) => {
    if (activeId === null) return
    setWidgets(draggingWidgets)
    setActiveId(null)
  }

  // On cancel, reset drag state
  const handleDragCancel = () => {
    setActiveId(null)
    setDraggingWidgets(widgets)
  }

  // Add new widget of given size at first free spot
  const addWidget = (size: 'sm' | 'md' | 'bg') => {
    const newW: I_Widget = { id: nextId.current++, size, x: 0, y: 0 }
    const spot = findNextEmptySpot(widgets, newW)
    if (!spot) {
      alert('No space available')
      return
    }
    newW.x = spot.x
    newW.y = spot.y
    setWidgets(prev => [...prev, newW])
    setDraggingWidgets(prev => [...prev, newW])
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Add widget controls */}
      <div className="flex gap-3">
        <Button onClick={() => addWidget('sm')}>Add Small</Button>
        <Button onClick={() => addWidget('md')}>Add Medium</Button>
        <Button onClick={() => addWidget('bg')}>Add Large</Button>
      </div>

      {/* Grid container */}
      <DndContext
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div
          className="relative border rounded-md bg-white"
          style={{
            width: GRID_SIZE * MAX_COLS,
            height: GRID_SIZE * MAX_ROWS,
            backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
            backgroundImage:
              'linear-gradient(to right, #eee 1px, transparent 1px), linear-gradient(to bottom, #eee 1px, transparent 1px)',
          }}
        >
          {draggingWidgets.map(w => (
            <Widget
              key={w.id}
              widget={w}
              gridSize={GRID_SIZE}
              isDragging={w.id === activeId}
              style={{ visibility: w.id === activeId ? 'hidden' : 'visible' }}
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
