/**
 * @fileoverview 2D Occupancy Grid for efficient widget placement and collision detection
 *
 * This implementation uses 2D prefix sums to achieve O(1) collision detection
 * while maintaining O(w*h) placement/clear operations.
 *
 * Time Complexities:
 * - Placement/Clear: O(w*h) where w,h are widget dimensions
 * - Collision Detection: O(1) amortized
 * - Empty Spot Search: O(n*m) worst case where n,m are grid dimensions
 */

import { I_Widget } from '../_types'
import { sizeMap } from './board'

class OccupancyGrid {
  private readonly grid: Int32Array[]
  private readonly prefixSums: Uint32Array[]
  private readonly widgetRegistry: Map<number, I_Widget>
  private isDirty: boolean = true
  private readonly rows: number
  private readonly cols: number

  constructor(rows: number = 100, cols: number = 100) {
    this.rows = rows
    this.cols = cols

    // Initialize grid with 0 (unoccupied) - using 0 instead of -1 for better performance
    this.grid = new Array(rows)
    for (let i = 0; i < rows; i++) {
      this.grid[i] = new Int32Array(cols)
    }

    // Prefix sum array for O(1) range queries
    this.prefixSums = new Array(rows)
    for (let i = 0; i < rows; i++) {
      this.prefixSums[i] = new Uint32Array(cols)
    }

    this.widgetRegistry = new Map<number, I_Widget>()
  }

  /** Checks if widget can be placed at specified position without collisions */
  canPlace(widget: I_Widget): boolean {
    const { x, y, size } = widget
    const { w, h } = sizeMap[size]

    // Early bounds check
    if (x + w > this.cols || y + h > this.rows) {
      return false
    }

    return this.countOccupied(x, y, w, h) === 0
  }

  /** Occupies grid cells with widget ID */
  occupy(widget: I_Widget): void {
    const { id, x, y } = widget
    const { w, h } = sizeMap[widget.size]

    // Mark cells as occupied (store widget ID)
    for (let row = y; row < y + h; row++) {
      for (let col = x; col < x + w; col++) {
        this.grid[row][col] = id
      }
    }

    this.widgetRegistry.set(id, widget)
    this.isDirty = true // Mark for prefix sum update
  }

  /** Clears cells occupied by widget */
  clear(widget: I_Widget): void {
    const { id, x, y, size } = widget
    const { w, h } = sizeMap[size]

    // Clear cells only if they belong to this widget
    for (let row = y; row < y + h; row++) {
      for (let col = x; col < x + w; col++) {
        if (this.grid[row][col] === id) {
          this.grid[row][col] = 0 // 0 means unoccupied
        }
      }
    }

    this.widgetRegistry.delete(id)
    this.isDirty = true // Mark for prefix sum update
  }

  /** Updates prefix sums when needed for range queries */
  private updatePrefixSums(): void {
    if (!this.isDirty) return

    // Build 2D prefix sum array
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const isOccupied = this.grid[row][col] !== 0 ? 1 : 0
        const top = row > 0 ? this.prefixSums[row - 1][col] : 0
        const left = col > 0 ? this.prefixSums[row][col - 1] : 0
        const topLeft =
          row > 0 && col > 0 ? this.prefixSums[row - 1][col - 1] : 0

        this.prefixSums[row][col] = isOccupied + top + left - topLeft
      }
    }

    this.isDirty = false
  }

  /** Counts occupied cells in rectangular region using 2D prefix sums */
  private countOccupied(
    x: number,
    y: number,
    width: number,
    height: number
  ): number {
    // Clamp to grid bounds
    const x1 = Math.max(0, x)
    const y1 = Math.max(0, y)
    const x2 = Math.min(x + width - 1, this.cols - 1)
    const y2 = Math.min(y + height - 1, this.rows - 1)

    // Check if region is valid
    if (x1 > x2 || y1 > y2) return 0

    this.updatePrefixSums()

    const totalOccupied = this.prefixSums[y2][x2]
    const top = y1 > 0 ? this.prefixSums[y1 - 1][x2] : 0
    const left = x1 > 0 ? this.prefixSums[y2][x1 - 1] : 0
    const topLeft = y1 > 0 && x1 > 0 ? this.prefixSums[y1 - 1][x1 - 1] : 0

    return totalOccupied - top - left + topLeft
  }

  /** Finds first available position for widget of given dimensions */
  findEmptySpot(
    width: number,
    height: number
  ): { x: number; y: number } | null {
    this.updatePrefixSums()

    // Scan grid for empty spot
    for (let y = 0; y <= this.rows - height; y++) {
      for (let x = 0; x <= this.cols - width; x++) {
        if (this.countOccupied(x, y, width, height) === 0) {
          return { x, y }
        }
      }
    }

    return null
  }

  /** Safely moves a widget to a new position if possible */
  moveWidget(widget: I_Widget, x: number, y: number): boolean {
    const oldX = widget.x
    const oldY = widget.y

    // Temporarily update position for validation
    widget.x = x
    widget.y = y

    // Check if new position is available - O(1) amortized
    if (this.canPlace(widget)) {
      // Clear old position - O(w*h)
      const tempWidget = { ...widget, x: oldX, y: oldY }
      this.clear(tempWidget)

      // Occupy new position - O(w*h)
      this.occupy(widget)
      return true
    } else {
      // Revert position
      widget.x = oldX
      widget.y = oldY
      return false
    }
  }

  /** Attempts to place all widgets, repositioning those that don't fit */
  pushWidgets(widgets: I_Widget[]): I_Widget[] {
    const unplacedWidgets: I_Widget[] = []
    this.resetGrid()

    for (const widget of widgets) {
      if (this.canPlace(widget)) {
        this.occupy(widget)
      } else {
        const { w, h } = sizeMap[widget.size]
        const spot = this.findEmptySpot(w, h)
        if (spot) {
          // Update widget position and place it
          widget.x = spot.x
          widget.y = spot.y
          this.occupy(widget)
        } else {
          unplacedWidgets.push(widget)
        }
      }
    }

    return unplacedWidgets
  }

  /** Resets grid to empty state */
  private resetGrid(): void {
    for (let row = 0; row < this.rows; row++) {
      this.grid[row].fill(0) // 0 means unoccupied
    }

    this.widgetRegistry.clear()
    this.isDirty = true
  }

  /** Clears all widgets from grid */
  clearAll(): void {
    for (let row = 0; row < this.rows; row++) {
      this.grid[row].fill(0)
    }
    this.widgetRegistry.clear()
    this.isDirty = true
  }
}

export default OccupancyGrid
