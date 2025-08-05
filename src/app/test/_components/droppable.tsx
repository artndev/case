'use client'

import { cn } from '@/lib/utils'
import { useDroppable } from '@dnd-kit/core'
import React, { ReactNode } from 'react'

const Droppable: React.FC<{
  id: number
  className?: string
  children?: ReactNode
}> = ({ id, className, children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  })

  return (
    <div
      className={cn(
        'flex justify-center items-center min-h-[100px] rounded-md border duration-150 shadow-md',
        isOver && 'border-green-500',
        className
      )}
      ref={setNodeRef}
    >
      {children}
    </div>
  )
}

export default Droppable
