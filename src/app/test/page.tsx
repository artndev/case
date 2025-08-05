'use client'

import { closestCorners, DndContext, DragOverlay } from '@dnd-kit/core'
import { useState } from 'react'
import Draggable from './_components/draggable'
import Droppable from './_components/droppable'
import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'

const initialItems = [
  {
    id: 1,
    content: 'Drag me 1',
    className: 'w-[100px] h-[100px]',
    parent: null,
  },
  {
    id: 2,
    content: 'Drag me 2',
    className: 'w-[200px] h-[200px]',
    parent: null,
  },
  {
    id: 3,
    content: 'Drag me 3',
    className: 'w-[300px] h-[300px]',
    parent: null,
  },
  {
    id: 4,
    content: 'Drag me 4',
    className: 'w-[300px] h-[300px]',
    parent: null,
  },
  {
    id: 5,
    content: 'Drag me 5',
    className: 'w-[300px] h-[300px]',
    parent: null,
  },
]

const droppableIds = [
  {
    id: 1,
  },
  {
    id: 2,
  },
  {
    id: 3,
  },
  {
    id: 4,
  },
  {
    id: 5,
  },
  {
    id: 6,
  },
]

const Test = () => {
  const [items, setItems] = useState<typeof initialItems>(initialItems)
  const [activeId, setActiveId] = useState<number | null>(null)
  const [overId, setOverId] = useState<number | null>(null)

  const hasChild = (id: number) => {
    return items.some(item => item.parent === id)
  }

  const handleDragStart = (event: any) => {
    const { active } = event

    setActiveId(active.id as number)
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (over) {
      const occupied = items.some(item => item.parent === over.id)

      if (occupied) {
        setActiveId(null)
        return
      }
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.id === active.id
          ? { ...item, parent: over ? over.id : null }
          : item
      )
    )

    setActiveId(null)
  }

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
      onDragOver={({ over }) => setOverId(over ? (over.id as number) : null)}
    >
      <div className="flex flex-col gap-12 p-6 relative">
        <div className="grid grid-cols-[repeat(3,_minmax(0,max-content))] auto-rows-auto gap-[10px] w-[930px]">
          {droppableIds.map(droppable => {
            console.log(hasChild(droppable.id), droppable.id)

            return (
              <Droppable
                className="flex justify-start items-start min-w-[100px] min-h-[100px]"
                key={droppable.id}
                id={droppable.id}
              >
                {items.filter(item => item.parent === droppable.id).length >
                0 ? (
                  items
                    .filter(item => item.parent === droppable.id)
                    .map(({ id: itemId, content, className }) => (
                      <Draggable className={className} key={itemId} id={itemId}>
                        {content}
                      </Draggable>
                    ))
                ) : (
                  <div className="flex size-full justify-center items-center text-muted-foreground">
                    <Plus />
                  </div>
                )}
              </Droppable>
            )
          })}
        </div>

        <div className="flex flex-wrap gap-6">
          {items
            .filter(item => item.parent === null)
            .map(({ id, content, className }) =>
              activeId === id ? null : (
                <Draggable className={className} key={id} id={id}>
                  {content}
                </Draggable>
              )
            )}
        </div>

        <DragOverlay
          dropAnimation={{
            duration: 200,
            easing: 'cubic-bezier(0.2, 0.65, 0.6, 1.05)',
          }}
        >
          {activeId
            ? items
                .filter(item => item.id === activeId)
                .map(({ id, content, className }) => (
                  <Draggable className={className} key={id} id={id}>
                    {content}
                  </Draggable>
                ))
            : null}
        </DragOverlay>
      </div>
    </DndContext>
  )
}

export default Test
