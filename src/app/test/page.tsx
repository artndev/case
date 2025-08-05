'use client'

import { cn } from '@/lib/utils'
import { closestCenter, DndContext, DragOverlay } from '@dnd-kit/core'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import Draggable from './_components/draggable'
import Droppable from './_components/droppable'
import { Button } from '@/components/ui/button'

const initialItems = [
  {
    id: 1,
    content: 'Drag me 1',
    className: 'col-span-2 row-span-2',
    parent: null,
  },
  {
    id: 2,
    content: 'Drag me 2',
    className: 'col-span-2 row-span-2',
    parent: null,
  },
  {
    id: 3,
    content: 'Drag me 3',
    className: 'col-span-2 row-span-2',
    parent: null,
  },
  {
    id: 4,
    content: 'Drag me 4',
    className: 'col-span-2 row-span-2',
    parent: null,
  },
  {
    id: 5,
    content: 'Drag me 5',
    className: 'col-span-1 row-span-1',
    parent: null,
  },
]

const Test = () => {
  const [items, setItems] = useState<typeof initialItems>(initialItems)
  const [activeId, setActiveId] = useState<number | null>(null)

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
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="flex flex-col gap-12 p-6 relative">
        <div className="flex gap-6">
          <Button>Add small</Button>
          <Button>Add medium</Button>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,_minmax(100px,_1fr))] auto-rows-[100px] gap-[10px] grid-flow-dense w-full max-w-[930px] h-[540px]">
          {Array.from({ length: 10 }).map((_, i) => {
            const id = i + 1
            const item = items.find(item => item.parent === id)

            return (
              <Droppable
                className={cn(
                  'flex justify-start items-start min-w-[100px] min-h-[100px]',
                  item?.className
                )}
                key={id}
                id={id}
              >
                {items.filter(item => item.parent === id).length > 0 ? (
                  items
                    .filter(item => item.parent === id)
                    .map(({ id: itemId, content }) => (
                      <Draggable className="size-full" key={itemId} id={itemId}>
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
            .map(({ id, content }) =>
              activeId === id ? null : (
                <Draggable className="w-[100px] h-[100px]" key={id} id={id}>
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
                .map(({ id, content }) => (
                  <Draggable className="size-full" key={id} id={id}>
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
