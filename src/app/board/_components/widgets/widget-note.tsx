'use client'

import { I_WidgetProps } from '@/app/board/_types'
import { ROW_HEIGHT } from '@/lib/config'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import Widget from '../widget'
import validations from '@/lib/validations'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Check, Edit } from 'lucide-react'

const WidgetNote: React.FC<I_WidgetProps> = ({
  widget,
  breakpoint,
  layouts,
  setLayouts,
  metadata,
  children,
  ...props
}) => {
  const dragContentRef = useRef<HTMLDivElement>(null)
  const prevRows = useRef<number>(0)

  const [isEditable, setIsEditable] = useState<boolean>(false)

  const form = useForm<z.infer<typeof validations.WidgetNoteForm.POST.body>>({
    mode: 'onChange',
    resolver: zodResolver(validations.WidgetNoteForm.POST.body),
    defaultValues: {
      note: metadata?.note ?? '',
    },
  })

  const onSubmit = (
    formData: z.infer<typeof validations.WidgetNoteForm.POST.body>
  ) => {
    console.log('Submitted: ', formData.note)
  }

  const adjustHeight = () => {
    if (!dragContentRef.current) {
      return
    }

    const padding = 16 // Defined by parent p-2 class
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
      widget={widget}
      breakpoint={breakpoint}
      layouts={layouts}
      setLayouts={setLayouts}
      {...props}
    >
      <div className="w-full min-h-full break-words">
        <div className="drag-content flex flex-col gap-2" ref={dragContentRef}>
          <div className="drag-handle cursor-move font-bold">
            {widget.widget_type_details.alias}
          </div>

          <div className="no-drag flex gap-2 flex-wrap">
            {children}

            <Button
              variant={'outline'}
              size={'icon'}
              onClick={() => setIsEditable(prev => !prev)}
            >
              {isEditable ? <Check /> : <Edit />}
            </Button>
          </div>

          <div className="no-drag">
            <Form {...form}>
              <form
                className="flex flex-col gap-2"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          onKeyDown={e => {
                            e.preventDefault()

                            if (e.key !== 'Enter') {
                              return
                            }

                            // Maybe submitting here?
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="mr-auto" type="submit">
                  Submit
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </Widget>
  )
}

export default WidgetNote
