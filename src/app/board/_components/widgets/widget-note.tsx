'use client'

import { I_WidgetProps } from '@/app/board/_types'
import { ROW_HEIGHT } from '@/lib/config'
import React, { useEffect, useRef } from 'react'
import Widget from '../widget'

const WidgetNote: React.FC<I_WidgetProps> = ({
  widget,
  breakpoint,
  layouts,
  setLayouts,
  metadata,
  children,
  ...props
}) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const resizeTimeout = useRef<NodeJS.Timeout | null>(null)

  const autoResize = () => {
    if (!contentRef.current) {
      return
    }

    // The element whose height is controlled by RGL is the parent's parent.
    const gridItemElement = contentRef.current.parentElement?.parentElement
    if (!gridItemElement) return

    // Dynamically get the computed vertical padding (e.g., from the 'p-2' class).
    const computedStyle = getComputedStyle(gridItemElement)
    const paddingTop = parseFloat(computedStyle.paddingTop)
    const paddingBottom = parseFloat(computedStyle.paddingBottom)
    const verticalPadding = paddingTop + paddingBottom

    // Get the height of the actual content.
    const contentHeight = contentRef.current.scrollHeight

    // The total required height is the content + the container's padding.
    const totalRequiredHeight = contentHeight + verticalPadding
    const minHeight = 4

    // Calculate the new height based on the total required height.
    const newHeight = Math.max(
      minHeight,
      Math.ceil(totalRequiredHeight / ROW_HEIGHT / 2) + 1 // For mb-1
    )

    const currentLayouts = layouts[breakpoint] || []
    const widgetLayout = currentLayouts.find(l => l.i === widget.id)

    if (widgetLayout && widgetLayout.h === newHeight) {
      return
    }

    const updatedLayouts = {
      ...layouts,
      [breakpoint]: currentLayouts.map(lwgt =>
        lwgt.i === widget.id ? { ...lwgt, h: newHeight } : lwgt
      ),
    }

    setLayouts(updatedLayouts)
  }

  useEffect(() => {
    if (resizeTimeout.current) {
      clearTimeout(resizeTimeout.current)
    }

    resizeTimeout.current = setTimeout(autoResize, 100)

    return () => {
      if (resizeTimeout.current) {
        clearTimeout(resizeTimeout.current)
      }
    }
  }, [props])

  useEffect(() => {
    const mountTimeout = setTimeout(autoResize, 50)

    return () => clearTimeout(mountTimeout)
  }, [])

  return (
    <Widget
      widget={widget}
      breakpoint={breakpoint}
      layouts={layouts}
      setLayouts={setLayouts}
      {...props}
    >
      <div
        className="w-full h-full whitespace-pre-wrap break-words overflow-hidden"
        ref={contentRef}
      >
        <div className="drag-handle cursor-move font-bold mb-1">
          {widget.widget_type_details.alias}
        </div>

        {children}

        <span>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit.
          Necessitatibus dignissimos enim nam tempora repudiandae assumenda
          laboriosam officia natus repellendus. Inventore nisi eaque unde,
          aliquam quos asperiores vero. Facere, laudantium ex!
        </span>
      </div>
    </Widget>
  )
}

export default WidgetNote
