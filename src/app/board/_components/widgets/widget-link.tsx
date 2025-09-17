'use client'

import { saveWidgets } from '@/app/_contexts/actions'
import { useBoardContext } from '@/app/_contexts/board-context'
import { I_WidgetProps } from '@/app/board/_types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import validations from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { Edit2, Loader2, Settings, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import Widget from '../widget'

const WidgetLink: React.FC<I_WidgetProps> = ({
  widget,
  rowHeight,
  children,
  className,
  ...props
}) => {
  const { handleWidgetDelete, setIsDraggable } = useBoardContext()

  // Props
  const metadata = widget?.metadata ? JSON.parse(widget.metadata) : {}

  // States
  const [open, setOpen] = useState<boolean>(false)

  const form = useForm<z.infer<typeof validations.WidgetLinkForm.POST.body>>({
    mode: 'onChange',
    resolver: zodResolver(validations.WidgetLinkForm.POST.body),
    defaultValues: {
      link: metadata?.link ?? 'https://google.com/',
    },
  })

  const onSubmit = async (
    formData: z.infer<typeof validations.WidgetLinkForm.POST.body>
  ) => {
    const { widget_type_details, metadata: prevMetadata, ...payload } = widget

    await saveWidgets({
      widgets: [
        {
          ...payload,
          metadata: JSON.stringify({
            ...metadata,
            link: formData.link,
          }),
        },
      ],
    }).then(() => setOpen(false))
  }

  useEffect(() => setIsDraggable(!open), [open])

  return (
    <Widget
      widget={widget}
      rowHeight={rowHeight}
      className={cn(!form.formState.isValid && 'border-destructive', className)}
      {...props}
    >
      <div className="w-full min-h-full break-words">
        <div className="flex flex-col">
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
                  {children}

                  <hr className="m-2" />

                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => handleWidgetDelete(widget.id)}
                  >
                    <Trash2 /> Delete
                  </Button>

                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" className="justify-start">
                        <Edit2 /> Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader className="gap-6">
                        <DialogTitle>Make changes</DialogTitle>

                        <Form {...form}>
                          <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex flex-col gap-3"
                          >
                            <FormField
                              control={form.control}
                              name="link"
                              rules={{
                                required: true,
                              }}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      placeholder="Today is a day..."
                                      {...field}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <Button
                              className="mr-auto"
                              type="submit"
                              disabled={form.formState.isSubmitting}
                            >
                              {form.formState.isSubmitting && (
                                <Loader2 className="animate-spin" />
                              )}{' '}
                              Submit
                            </Button>
                          </form>
                        </Form>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <hr className="m-2 mt-0" />

          <div className="no-drag p-2 pt-0">
            <div className="flex flex-col gap-2">
              <a
                href={form.getValues().link}
                className="text-muted-foreground hover:underline"
              >
                Today is a link...
              </a>
            </div>
          </div>
        </div>
      </div>
    </Widget>
  )
}

export default WidgetLink
