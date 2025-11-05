'use client'

import { saveWidgets } from '@/app/_contexts/actions'
import { useBoardContext } from '@/app/_contexts/board-context'
import { I_WidgetProps } from '@/app/board/_components/_types'
import LinkPreview from '@/components/custom/(link-preview)/link-preview'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import validations from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { Edit2, Loader2, Settings, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import Widget from '../widget'

const MemoLinkPreview = React.memo(LinkPreview)

const WidgetLink: React.FC<I_WidgetProps> = ({
  widget,
  children,
  ...props
}) => {
  const { handleWidgetDelete, setIsDraggable } = useBoardContext()

  // Props
  const metadata = widget?.metadata ? JSON.parse(widget.metadata) : {}

  // States
  const [url, setUrl] = useState<string>(metadata?.url ?? 'https://google.com')
  const [open, setOpen] = useState<boolean>(false)

  const form = useForm<z.infer<typeof validations.WidgetLinkForm.POST.body>>({
    mode: 'onChange',
    resolver: zodResolver(validations.WidgetLinkForm.POST.body),
    defaultValues: {
      url: metadata?.url ?? 'https://google.com',
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
            url: formData.url,
          }),
        },
      ],
    }).then(() => {
      setUrl(formData.url)

      setOpen(false)
    })
  }

  useEffect(() => setIsDraggable(!open), [open])

  return (
    <Widget widget={widget} {...props}>
      <div className="flex flex-col h-full">
        <div className="flex justify-end px-3 cursor-move">
          <div className="no-drag">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="justify-end">
                  <Settings />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="no-drag flex flex-col w-[200px] p-0"
                align="start"
                side="left"
                sideOffset={-10}
              >
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
                  <DialogContent className="gap-4">
                    <DialogHeader className="gap-2">
                      <DialogTitle>Make changes</DialogTitle>

                      <DialogDescription>
                        Edit the selected widget-link
                      </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-4"
                      >
                        <FormField
                          control={form.control}
                          name="url"
                          rules={{
                            required: true,
                          }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>URL</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Today is a url..."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="mr-auto" />
                            </FormItem>
                          )}
                        />

                        <Button
                          className="min-w-[100px] ml-auto"
                          type="submit"
                          disabled={form.formState.isSubmitting}
                        >
                          {form.formState.isSubmitting && (
                            <Loader2 className="animate-spin text-muted-foreground" />
                          )}{' '}
                          Submit
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <MemoLinkPreview
          className="no-drag flex-1 max-h-full p-2 pt-0"
          url={url}
          size={widget.size}
        />
      </div>
    </Widget>
  )
}

export default WidgetLink
