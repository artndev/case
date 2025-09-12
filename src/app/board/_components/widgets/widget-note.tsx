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
import { cn } from '@/lib/utils'

const WidgetNote: React.FC<I_WidgetProps> = ({
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
      // className={cn('border-destructive', className)}
      widget={widget}
      breakpoint={breakpoint}
      layouts={layouts}
      setLayouts={setLayouts}
      className={cn(className, !form.formState.isValid && 'border-destructive')}
      {...props}
    >
      <div className="w-full min-h-full break-words">
        <div className="drag-content flex flex-col" ref={dragContentRef}>
          <div className="flex justify-between items-center p-2">
            <div className="drag-handle cursor-move font-bold">⠿</div>
            <div className="no-drag">{children}</div>
          </div>

          {/* <div className="no-drag flex gap-2 flex-wrap">
            {children}

            <Button
              variant={'outline'}
              size={'icon'}
              onClick={() => setIsEditable(prev => !prev)}
            >
              {isEditable ? <Check /> : <Edit />}
            </Button>
          </div> */}

          <div className="no-drag">
            <Form {...form}>
              <form
                className="flex flex-col gap-2 border-t"
                onSubmit={form.handleSubmit(onSubmit)}
                onInvalid={e => console.log('INVALID')}
              >
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          className={cn(
                            `
                              overflow-hidden resize-none border-none 
                              focus-visible:ring-ring/0 aria-invalid:ring-destructive/0
                            `,
                            readOnly && 'cursor-pointer'
                          )}
                          onKeyDown={e => {
                            if (e.key !== 'Enter' || !form.formState.isValid) {
                              return
                            }

                            setReadOnly(true)
                          }}
                          onClick={() => {
                            if (!readOnly) {
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
                      {/* <FormMessage /> */}
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
