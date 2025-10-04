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
      {isLoaded ? (
        <div
          className={cn('flex gap-8 w-full overflow-hidden', className)}
          {...props}
        >
          <div className="flex flex-col gap-4">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  className="flex justify-center items-center w-[50px] h-[50px] rounded-lg p-2"
                  variant={'outline'}
                >
                  <img src={data!.favicon} alt="favicon" />
                </Button>
              </DialogTrigger>

              <DialogContent className="gap-4">
                <DialogHeader className="gap-2">
                  <DialogTitle>Are you sure?</DialogTitle>

                  <DialogDescription>
                    You are going to visit the <u>{data!.url}</u> website
                  </DialogDescription>
                </DialogHeader>

                {caption && <span>{caption}</span>}

                <div className="flex gap-4 ml-auto">
                  <a href={data!.url} target="_blank">
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
              {data!.url.noTLD}

              <a href={data!.url} className="text-muted-foreground">
                {data!.url.noHttps}
              </a>
            </div>
          </div>

          {/* Value for 'translate-x' got with padding of 'MemoLinkPreview', set to p-2 */}
          <div
            className={cn(
              `
                flex-1 relative border rounded-md overflow-hidden 
                transition-transform translate-x-[calc(100%_+_var(--spacing)_*_2)] duration-500  
              `,
              size === 'md' && 'translate-x-0'
            )}
          >
            <div className="absolute w-full h-full max-h-full overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={data!.thumbnail}
                alt="thumbnail"
              />
            </div>
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
            className="flex justify-center items-center w-[50px] h-[50px] p-0"
            variant={'outline'}
          >
            <Loader2 className="animate-spin text-muted-foreground" />
          </Button>

          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      )}
    </>
  )
}

export default LinkPreview
