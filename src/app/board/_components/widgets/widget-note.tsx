'use client'

import { saveWidgets } from '@/app/_contexts/actions'
import { useBoardContext } from '@/app/_contexts/board-context'
import { I_WidgetProps } from '@/app/board/_types'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { cn, countNodes } from '@/lib/utils'
import validations from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import Widget from '../widget'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Settings, Trash2 } from 'lucide-react'

const WidgetNote: React.FC<I_WidgetProps> = ({
  widget,
  rowHeight,
  className,
  ...props
}) => {
  const { setLayouts, breakpoint, handleWidgetDelete } = useBoardContext()

  // Props
  const metadata = widget?.metadata ? JSON.parse(widget.metadata) : {}

  // Refs
  const dragContentRef = useRef<HTMLDivElement>(null)
  const prevRows = useRef<number>(0)

  // States
  const [readOnly, setReadOnly] = useState<boolean>(false)

  const form = useForm<z.infer<typeof validations.WidgetNoteForm.POST.body>>({
    mode: 'onChange',
    resolver: zodResolver(validations.WidgetNoteForm.POST.body),
    defaultValues: {
      note: metadata?.note ?? 'Today is a note...',
    },
  })

  const onSubmit = async (
    formData: z.infer<typeof validations.WidgetNoteForm.POST.body>
  ) => {
    const { widget_type_details, metadata: prevMetadata, ...payload } = widget

    await saveWidgets({
      widgets: [
        {
          ...payload,
          metadata: JSON.stringify({
            ...metadata,
            note: formData.note,
          }),
        },
      ],
    })
  }

  const adjustHeight = () => {
    if (!dragContentRef.current) {
      return
    }

    const padding = 0 // 16 // Defined by parent p-2 class
    const marginY = breakpoint === 'sm' ? 15 : 30 // Set in board properties

    const minHeight = 4
    const contentHeight = dragContentRef.current.scrollHeight + padding

    const newRows = Math.max(
      minHeight,
      Math.ceil((contentHeight + marginY) / (rowHeight + marginY))
    )

    if (prevRows.current === newRows) {
      return
    }

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

  useEffect(() => {
    if (!dragContentRef.current) {
      return
    }

    const observer = new ResizeObserver(() => adjustHeight())

    observer.observe(dragContentRef.current, {
      box: 'border-box',
    })

    return () => observer.disconnect()
  }, [])

  return (
    <Widget
      widget={widget}
      rowHeight={rowHeight}
      className={cn(!form.formState.isValid && 'border-destructive', className)}
      {...props}
    >
      <div className="flex flex-col" ref={dragContentRef}>
        <div className="flex justify-between items-center p-2">
          <div className="drag-handle cursor-move font-bold">⠿</div>
          <div className="no-drag">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="no-drag flex flex-col w-[200px] p-0">
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => handleWidgetDelete(widget.id)}
                >
                  <Trash2 /> Delete
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <hr className="m-2 mt-0" />

        <div className="no-drag">
          <Form {...form}>
            <form className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="note"
                rules={{
                  required: true,
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        className={cn(
                          `
                            resize-none text-base! border-0 outline-none shadow-none overflow-hidden p-2 pt-0
                            focus:ring-0 focus-visible:ring-0 focus-visible:outline-none aria-invalid:ring-0
                          `,
                          readOnly && 'cursor-pointer'
                        )}
                        onKeyDown={e => {
                          if (e.key !== 'Enter' || !form.formState.isValid) {
                            return
                          }

                          setReadOnly(true)

                          form.handleSubmit(onSubmit)()
                        }}
                        onClick={() => {
                          if (!readOnly || form.formState.isSubmitting) {
                            return
                          }

                          setReadOnly(false)
                        }}
                        onInput={e => {
                          e.currentTarget.style.height = 'auto'
                          e.currentTarget.style.height =
                            e.currentTarget.scrollHeight + 'px'
                        }}
                        readOnly={readOnly}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>
    </Widget>
  )
}

export default WidgetNote
