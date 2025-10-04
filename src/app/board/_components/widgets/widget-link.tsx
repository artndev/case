'use client'

import { saveWidgets } from '@/app/_contexts/actions'
import { useBoardContext } from '@/app/_contexts/board-context'
import { I_WidgetProps } from '@/app/board/_types'
import LinkPreview from '@/components/custom/link-preview'
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
import { cn } from '@/lib/utils'
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
  const { handleWidgetDelete, setIsDraggable, rowHeight } = useBoardContext()

  // Props
  const metadata = widget?.metadata ? JSON.parse(widget.metadata) : {}

  // States
  const [url, setUrl] = useState<string>(metadata?.url ?? 'https://google.com/')
  const [caption, setCaption] = useState<string | undefined>(metadata?.caption)
  const [open, setOpen] = useState<boolean>(false)

  const form = useForm<z.infer<typeof validations.WidgetLinkForm.POST.body>>({
    mode: 'onChange',
    resolver: zodResolver(validations.WidgetLinkForm.POST.body),
    defaultValues: {
      url: metadata?.url ?? 'https://google.com/',
      caption: metadata?.caption,
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
            caption:
              !formData.caption || formData.caption.trim().length === 0
                ? undefined
                : formData.caption,
          }),
        },
      ],
    }).then(() => {
      setUrl(formData.url)
      setCaption(formData.caption)

      setOpen(false)
    })
  }

  useEffect(() => setIsDraggable(!open), [open])

  return (
    <Widget widget={widget} {...props}>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center p-2 ">
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
                        <FormField
                          control={form.control}
                          name="caption"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Caption</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Today is a caption..."
                                  {...field}
                                />
                              </FormControl>
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

        <hr className="mb-4 mx-2" />

        <MemoLinkPreview
          className="no-drag flex-1 max-h-full p-2 pt-0"
          url={url}
          caption={caption}
          size={widget.size}
        />
      </div>
    </Widget>
  )
}

export default WidgetLink
