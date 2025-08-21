'use client'

import { useAuthContext } from '@/app/_contexts/auth-context'
import { Button } from '@/components/ui/button'
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core'
import { useEffect, useRef, useState } from 'react'
import {
  I_ComponentSettings,
  I_Widget,
  I_WidgetType,
  T_WidgetSize,
  T_WidgetType,
} from '../_types'
import WidgetOverlay from './widget-overlay'
import Widget1 from './widgets/widget-1'
import Widget2 from './widgets/widget-2'
import { Loader2 } from 'lucide-react'
import { getWidgets } from '../../api/widgets/actions'

const GRID_SIZE = 25
const MAX_COLS = 30
const MAX_ROWS = 20

// Map each widget size to its grid dimensions
export const sizeMap: Record<T_WidgetSize, { w: number; h: number }> = {
  sm: { w: 8, h: 8 },
  md: { w: 8, h: 10 },
  bg: { w: 8, h: 12 },
}

// Map each widget to its widget type settings
export const widgetTypeMap: Record<T_WidgetType, I_ComponentSettings> = {
  'widget-1': {
    displayName: 'Widget #1',
    component: Widget1,
  },
  'widget-2': {
    displayName: 'Widget #2',
    component: Widget2,
  },
}

export const initialWidgetTypes: I_WidgetType[] = [
  {
    id: 1,
    widgetType: 'widget-1',
  },
  {
    id: 2,
    widgetType: 'widget-2',
  },
  {
    id: 3,
    widgetType: 'widget-2',
  },
]

const initialWidgets: I_Widget[] = [
  {
    id: 1,
    size: 'sm',
    x: 0,
    y: 0,
  },
  {
    id: 2,
    size: 'sm',
    x: 8,
    y: 0,
  },
  {
    id: 3,
    size: 'sm',
    x: 16,
    y: 0,
  },
]

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
  size: T_WidgetSize
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
  const occupied: boolean[][] = Array.from({ length: MAX_ROWS }, () =>
    Array(MAX_COLS).fill(false)
  )

  widgets.forEach(wgt => {
    if (wgt.id === widget.id) {
      return
    }

    const { w, h } = sizeMap[wgt.size]
    for (let y = wgt.y; y < wgt.y + h; y++) {
      for (let x = wgt.x; x < wgt.x + w; x++) {
        if (y < MAX_ROWS && x < MAX_COLS) occupied[y][x] = true
      }
    }
  })

  const { w, h } = sizeMap[widget.size]
  for (let row = 0; row <= MAX_ROWS - h; row++) {
    for (let col = 0; col <= MAX_COLS - w; col++) {
      let isFree = true

      innerLoop: for (let y = row; y < row + h; y++) {
        for (let x = col; x < col + w; x++) {
          if (occupied[y][x]) {
            isFree = false
            break innerLoop
          }
        }
      }

      if (isFree) {
        return { x: col, y: row }
      }
    }
  }

  return null
}

/**
 * Recursively update widgets to avoid overlap when moving one
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
      if (!spot) {
        return null
      }

      wgt.x = spot.x
      wgt.y = spot.y

      queue.push({ ...wgt })
    }
  }

  return updated
}

const getInitialWidgets = () => {
  if (typeof window === 'undefined') return initialWidgets

  const data = localStorage.getItem('widgets')
  if (data) return JSON.parse(data) as I_Widget[]

  return initialWidgets
}

const getInitialWidgetTypes = () => {
  if (typeof window === 'undefined') return initialWidgetTypes

  const data = localStorage.getItem('widgetTypes')
  if (data) return JSON.parse(data) as I_WidgetType[]

  return initialWidgetTypes
}

const Board = () => {
  const { user, loading } = useAuthContext()

  const [widgets, setWidgets] = useState<I_Widget[]>([])

  // useEffect(() => {
  //   if (!user?.id) {
  //     return
  //   }

  //   const _getWidgets = async () => {
  //     const data = await getWidgets(user.id)

  //     setWidgets(data as I_Widget[])
  //   }

  //   _getWidgets()
  // }, [user])

  const [draggingWidgets, setDraggingWidgets] =
    useState<I_Widget[]>(getInitialWidgets)
  const [widgetTypes, setWidgetTypes] = useState<I_WidgetType[]>(
    getInitialWidgetTypes
  )
  const [activeId, setActiveId] = useState<number | null>(null)

  // Remember starting grid coords of dragged widget
  const startPos = useRef<{ x: number; y: number } | null>(null)

  // addWidget's current id
  const currentId = useRef(initialWidgets.length + 1)

  const activeWidget = activeId
    ? (draggingWidgets.find(wgt => wgt.id === activeId) ?? null)
    : null

  /* DRAG CONTEXT EVENTS */

  const handleDragStart = (event: DragStartEvent) => {
    // Set active widget
    const id = event.active.id as number
    setActiveId(id)

    // Load saved layout
    setDraggingWidgets(widgets)

    // Initiate startPos depending on active widget
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

    // Prevent widget from going outta grid borders
    const { x, y } = clampPosition(
      startPos.current.x + dx,
      startPos.current.y + dy,
      original.size
    )

    const start: I_Widget = { ...original, x, y }
    const updated = widgets.map(wgt => (wgt.id === activeId ? start : wgt))
    const pushed = pushWidgets(updated, start)

    // Update dragging layout
    setDraggingWidgets(pushed ?? widgets)
  }

  const handleDragEnd = (_: DragEndEvent) => {
    if (activeId === null) return

    setWidgets(draggingWidgets) // Update saved layout
    setActiveId(null)
  }

  const handleDragCancel = () => {
    setDraggingWidgets(widgets) // Return to recent saved layout
    setActiveId(null)
  }

  /* WIDGET MANIPULATIONS */

  const addWidget = (size: T_WidgetSize, widgetType: T_WidgetType) => {
    const widget: I_Widget = {
      id: currentId.current++,
      size,
      x: 0,
      y: 0,
    }
    const spot = findEmptySpot(widgets, widget)

    if (!spot) {
      alert('No space available')
      return
    }

    widget.x = spot.x
    widget.y = spot.y

    /* Update both layouts to avoid conflicts */

    setWidgetTypes(prev => [
      ...prev,
      {
        id: widget.id,
        widgetType,
      },
    ])
    setWidgets(prev => [...prev, widget])
    setDraggingWidgets(prev => [...prev, widget])
  }

  const resizeWidget = (id: number, size: T_WidgetSize) => {
    /* Update both layouts to avoid conflicts */

    setWidgets(prev => {
      const original = prev.find(wgt => wgt.id === id)
      if (!original) return prev

      // Prevent widget from going outta grid borders
      const { x, y } = clampPosition(original.x, original.y, size)

      const start: I_Widget = { ...original, size, x, y }
      const updated = prev.map(wgt => (wgt.id === id ? start : wgt))
      const pushed = pushWidgets(updated, start)

      // if (!pushed) alert('No space available')

      return pushed ?? prev
    })

    setDraggingWidgets(prev => {
      const original = prev.find(wgt => wgt.id === id)
      if (!original) return prev

      // Prevent widget from going outta grid borders
      const { x, y } = clampPosition(original.x, original.y, size)

      const start: I_Widget = { ...original, size, x, y }
      const updated = prev.map(wgt => (wgt.id === id ? start : wgt))
      const pushed = pushWidgets(updated, start)

      // if (!pushed) alert('No space available')

      return pushed ?? prev
    })
  }

  return (
    <>
      {!loading ? (
        <div className="flex flex-col gap-6">
          {(Object.keys(widgetTypeMap) as T_WidgetType[]).map(key => {
            return (
              <div className="flex flex-col gap-3">
                {widgetTypeMap[key].displayName}
                <div className="flex gap-3">
                  <Button onClick={() => addWidget('sm', key)}>
                    Add Small
                  </Button>
                  <Button onClick={() => addWidget('md', key)}>
                    Add Medium
                  </Button>
                  <Button onClick={() => addWidget('bg', key)}>
                    Add Large
                  </Button>
                </div>
              </div>
            )
          })}

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
              {draggingWidgets.map(wgt => {
                const widgetType = widgetTypes.find(swgt => swgt.id === wgt.id)!
                const Widget = widgetTypeMap[widgetType.widgetType].component

                return (
                  <Widget
                    key={wgt.id}
                    widget={wgt}
                    gridSize={GRID_SIZE}
                    isDragging={wgt.id === activeId}
                    style={{
                      visibility: wgt.id === activeId ? 'hidden' : 'visible',
                    }}
                  >
                    <div className="flex flex-wrap gap-3">
                      {(Object.keys(sizeMap) as T_WidgetSize[]).map(key => {
                        return (
                          <Button
                            variant={'ghost'}
                            size={'icon'}
                            onClick={() => resizeWidget(wgt.id, key)}
                          >
                            {key.toUpperCase()}
                          </Button>
                        )
                      })}
                    </div>
                  </Widget>
                )
              })}

              <DragOverlay>
                {activeWidget && (
                  <WidgetOverlay widget={activeWidget} gridSize={GRID_SIZE} />
                )}
              </DragOverlay>
            </div>
          </DndContext>

          <Button
            className="w-[max-content]"
            onClick={() => {
              localStorage.setItem('widgets', JSON.stringify(widgets))
              localStorage.setItem('widgetTypes', JSON.stringify(widgetTypes))
            }}
          >
            Save Changes
          </Button>
        </div>
      ) : (
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      )}
    </>
  )
}

export default Board
