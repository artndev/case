'use client'

import { I_WidgetProps } from '@/app/board/_types'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { ROW_HEIGHT } from '@/lib/config'
import { cn } from '@/lib/utils'
import validations from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { saveWidgets } from '../../actions'
import Widget from '../widget'

const WidgetNote: React.FC<I_WidgetProps> = ({
  userId,
  widget,
  breakpoint,
  layouts,
  setLayouts,
  metadata,
  children,
  className,
  ...props
}) => {
  const dragContentRef = useRef<HTMLDivElement>(null)
  const prevRows = useRef<number>(0)

  const [readOnly, setReadOnly] = useState<boolean>(false)

  const form = useForm<z.infer<typeof validations.WidgetNoteForm.POST.body>>({
    mode: 'onChange',
    resolver: zodResolver(validations.WidgetNoteForm.POST.body),
    defaultValues: {
      note: metadata?.note ?? 'Write something down here...',
    },
  })

  const onSubmit = async (
    formData: z.infer<typeof validations.WidgetNoteForm.POST.body>
  ) => {
    const { widget_type_details, ...payload } = widget

    await saveWidgets({
      widgets: [
        {
          ...payload,
          metadata: JSON.stringify({
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
    const marginY = 10 // Set in board properties

    const minHeight = 4
    const contentHeight = dragContentRef.current.scrollHeight + padding

    const newRows = Math.max(
      minHeight,
      Math.ceil((contentHeight + marginY) / (ROW_HEIGHT + marginY))
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
      userId={userId}
      widget={widget}
      breakpoint={breakpoint}
      layouts={layouts}
      setLayouts={setLayouts}
      className={cn(!form.formState.isValid && 'border-destructive', className)}
      {...props}
    >
      <div className="w-full min-h-full break-words">
        <div className="flex flex-col" ref={dragContentRef}>
          <div className="flex flex-col gap-2 p-2">
            <div className="flex justify-between items-center">
              <div className="drag-handle cursor-move font-bold">⠿</div>
              <div className="no-drag">{children}</div>
            </div>

            <hr />
          </div>

          <div className="no-drag">
            <Form {...form}>
              <form className="flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          className={cn(
                            `
                              resize-none border-none overflow-hidden p-2 pt-0
                              focus-visible:ring-ring/0 aria-invalid:ring-destructive/0
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
      </div>
    </Widget>
  )
}

export default WidgetNote
