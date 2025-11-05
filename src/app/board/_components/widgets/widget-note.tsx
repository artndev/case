'use client'

import { saveWidgets } from '@/app/_contexts/actions'
import { useBoardContext } from '@/app/_contexts/board-context'
import { I_WidgetProps } from '@/app/board/_components/_types'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import validations from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { Settings, Trash, Trash2 } from 'lucide-react'
import React, { useLayoutEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import Widget from '../widget'

const WidgetNote: React.FC<I_WidgetProps> = ({
  widget,
  className,
  ...props
}) => {
  const { setLayouts, breakpoint, rowHeight, handleWidgetDelete } =
    useBoardContext()

  // Props
  const metadata = widget?.metadata ? JSON.parse(widget.metadata) : {}

  // Refs
  const dragContentRef = useRef<HTMLDivElement>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
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

    const padding = 0
    const marginY = breakpoint === 'sm' ? 15 : 30 // Got value from board properties

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
      const currentLayout = prev[breakpoint]

      return {
        ...prev,
        [breakpoint]: currentLayout.map(lwgt =>
          lwgt.i === widget.id ? { ...lwgt, h: newRows } : lwgt
        ),
      }
    })
  }

  useLayoutEffect(() => {
    if (!dragContentRef.current || !textAreaRef.current) {
      return
    }

    const observer = new ResizeObserver(() => {
      textAreaRef.current!.style.height = 'auto'
      textAreaRef.current!.style.height =
        textAreaRef.current!.scrollHeight + 'px'

      adjustHeight()
    })

    observer.observe(dragContentRef.current, {
      box: 'border-box',
    })

    return () => observer.disconnect()
  }, [rowHeight, breakpoint])

  return (
    <Widget
      widget={widget}
      className={cn(!form.formState.isValid && 'border-destructive', className)}
      {...props}
    >
      <div className="flex flex-col h-full" ref={dragContentRef}>
        <div className="flex justify-end px-3 cursor-move">
          <Button
            variant="ghost"
            size="icon"
            className="justify-end"
            onClick={() => handleWidgetDelete(widget.id)}
          >
            <Trash />
          </Button>
        </div>

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
                        ref={textAreaRef}
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
