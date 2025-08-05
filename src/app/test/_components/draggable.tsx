'use client'

import { cn } from '@/lib/utils'
import { useDraggable } from '@dnd-kit/core'
import React, { ReactNode } from 'react'

const Draggable: React.FC<
  { id: number } & Omit<React.ComponentProps<'button'>, 'id'>
> = ({ id, className, children, ...props }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  })

  return (
    <button
      className={cn(
        'flex justify-center break-inside-avoid items-center h-[100px] p-6 rounded-md bg-muted-foreground text-background',
        className
      )}
      ref={setNodeRef}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      }}
      {...listeners}
      {...attributes}
      {...props}
    >
      {children}
    </button>
  )
}

export default Draggable
