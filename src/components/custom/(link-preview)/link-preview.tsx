'use client'

import { useBoardContext } from '@/app/_contexts/board-context'
import { I_LinkPreview } from '@/app/api/link_preview/_types'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import React, { useEffect } from 'react'
import useSWR from 'swr'
import { I_LinkPreviewProps } from '../../types'
import { Button } from '../../ui/button'
import { getLinkPreview, uploadLinkPreview } from './actions'

const LinkPreview: React.FC<I_LinkPreviewProps> = ({
  url,
  size,
  className,
  ...props
}) => {
  const { data } = useSWR<I_LinkPreview | null>(
    url,
    async (url: string) => {
      let cached = await getLinkPreview(url)

      if (!cached) {
        await uploadLinkPreview(url)
      }

      return cached
    },
    {
      revalidateOnFocus: false,
      refreshInterval: data => (data ? 0 : 2500),
    }
  )

  return (
    <>
      {data ? (
        <div
          className={cn('flex gap-8 w-full overflow-hidden', className)}
          {...props}
        >
          <div className="flex flex-col gap-2">
            <Button
              className="flex justify-center items-center w-[50px] h-[50px] rounded-lg p-2"
              variant={'outline'}
            >
              <img src={data!.favicon} alt="favicon" />
            </Button>

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
                transition-transform translate-x-[calc(100%_+_var(--spacing)_*_2)] duration-400  
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
            'flex flex-col gap-2 w-full transition-all duration-100',
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
