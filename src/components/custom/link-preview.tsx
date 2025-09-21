'use client'

import { useBoardContext } from '@/app/_contexts/board-context'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import axios from '@/lib/axios-client'
import { beautifyUrl, cn } from '@/lib/utils'
import { AxiosResponse } from 'axios'
import { I_LinkPreview } from '@/app/api/link_preview/_types'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { I_LinkPreviewProps } from '../types'
import { Button } from '../ui/button'

const LinkPreview: React.FC<I_LinkPreviewProps> = ({
  url,
  caption,
  size,
  className,
  ...props
}) => {
  const { setIsDraggable } = useBoardContext()

  // States
  const [data, setData] = useState<I_LinkPreview | null>(null)
  const [open, setOpen] = useState<boolean>(false)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  const getData = () => {
    setIsLoaded(false)

    return axios
      .get('/api/link_preview', {
        params: {
          url: url,
        },
      })
      .then((res: AxiosResponse<I_AxiosResponse<I_LinkPreview>>) => {
        setData(res.data.answer)
        setIsLoaded(true)
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    const debounce = setTimeout(() => getData(), 500)

    return () => clearTimeout(debounce)
  }, [url])

  useEffect(() => setIsDraggable(!open), [open])

  useEffect(() => console.log(data), [data])

  return (
    <>
      {data ? (
        <div
          className={cn(
            'flex flex-col gap-2 w-full transition-all duration-250',
            className
          )}
          {...props}
        >
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              {data || !isLoaded ? (
                <Button
                  className="flex justify-center items-center w-[50px] h-[50px] rounded-lg p-0"
                  variant={'outline'}
                >
                  <img src={data.favicon} alt="favicon" />
                </Button>
              ) : (
                <Loader2 className="animate-spin text-muted-foreground" />
              )}
            </DialogTrigger>

            <DialogContent className="gap-4">
              <DialogHeader className="gap-2">
                <DialogTitle>Are you sure?</DialogTitle>

                <DialogDescription>
                  You are going to visit the <u>{data.url}</u> website
                </DialogDescription>
              </DialogHeader>

              {caption && <span>{caption}</span>}

              <div className="flex gap-4 ml-auto">
                <a href={data.url} target="_blank">
                  <Button className="min-w-[100px]">Go</Button>
                </a>

                <DialogClose asChild>
                  <Button className="min-w-[100px]" variant={'outline'}>
                    Cancel
                  </Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>

          <div className="flex flex-col text-sm">
            {data.url.noTLD}

            <a href={data.url} className="text-muted-foreground">
              {data.url.noHttps}
            </a>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            'flex flex-col gap-2 w-full transition-all duration-250',
            className
          )}
          {...props}
        >
          <Button
            className={cn(
              'flex justify-center items-center w-[50px] h-[50px] p-0',
              size === 'md' && 'w-full'
            )}
            variant={'outline'}
          >
            <Loader2 className="animate-spin text-muted-foreground" />
          </Button>

          <span
            className={cn(
              'text-sm text-muted-foreground',
              size === 'md' && 'text-md'
            )}
          >
            Loading...
          </span>
        </div>
      )}
    </>
  )
}

export default LinkPreview
