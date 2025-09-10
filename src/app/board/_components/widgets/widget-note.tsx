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
  const prevRows = useRef<number>(0)

  useEffect(() => {
    if (!contentRef.current) {
      return
    }

    const resizeObserver = new ResizeObserver(() => {
      const padding = 16 // 1Defined by parents p-2 class
      const contentHeight = contentRef.current!.scrollHeight + padding

      const minHeight = 4
      const marginY = 10 // Set in board properties

      const newRows = Math.max(
        minHeight,
        Math.ceil((contentHeight + marginY) / (ROW_HEIGHT + marginY))
      )

      if (prevRows.current !== newRows) {
        prevRows.current = newRows

        setLayouts(prev => {
          const currentLayout = prev[breakpoint] || []

          return {
            ...prev,
            [breakpoint]: currentLayout.map(lwgt =>
              lwgt.i === widget.id ? { ...lwgt, h: newRows } : lwgt
            ),
          }
        })
      }
    })

    resizeObserver.observe(contentRef.current)

    return () => resizeObserver.disconnect()
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
        className="bg-red-500 w-full min-h-full break-words"
        ref={contentRef}
      >
        <div className="drag-handle cursor-move font-bold mb-1">
          {widget.widget_type_details.alias}
        </div>

        {children}

        <span>
          Lorem ipsum doloddr, sit amet consectetur adipisicing elit.
          Necessitatibus ddignisdsdimods enim nam tempora repudiandae assumenda
          laboriosam officidadsd nddadtus repellendus. Inventore nisi eaque
          unde, aliquam quos aspesrdioddrdes vero. Facere, laudantium ex!dsdsds
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Necessitatibus architecto eum tenetur voluptatem reprehenderit dolores
          distinctio optio eius harum. Assumenda possimus, corrupti saepe quos
          earum voluptatem rerum eveniet nam reiciendis? Lorem ipsum dolor sit
          amet consectetur adipisicing elit. Eos, magni inventore perspiciatis
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta
          delectus vitae veritatis enim nisi, explicabo corrupti animi eius
          commodi facilis mollitia aut temporibus provident molestiae tempora,
          voluptatum error quidem maxime! Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Minima similique, iusto quas exercitationem ut ex
          numquam aliquam aspernatur? Illo possimus magni officiis velit
          provident accusantium modi, consectetur animi ipsa? Id? Lorem ipsum
          dolor, sit amet consectetur adipisicing elit. Non totam voluptas est.
          Veritatis veniam vel cupiditate adipisci libero consectetur mollitia a
        </span>
      </div>
    </Widget>
  )
}

export default WidgetNote
