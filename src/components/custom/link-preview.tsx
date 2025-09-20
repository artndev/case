'use client'

import axios from '@/lib/axios-client'
import React, { useEffect, useState } from 'react'
import { I_LinkPreviewProps } from '../types'
import { cn } from '@/lib/utils'
import { AxiosResponse } from 'axios'
// ? Added I_LinkPreviewResponseFull in order to work with axios
import { I_LinkPreviewResponseFull } from 'link-preview-js'
import { Loader2 } from 'lucide-react'

const LinkPreview: React.FC<I_LinkPreviewProps> = ({
  caption,
  url,
  subClassName,
  className,
  ...props
}) => {
  const [data, setData] = useState<I_LinkPreviewResponseFull | null>(null)
  const [debounce, setDebounce] = useState<boolean>(false)

  const getData = () => {
    return axios
      .get('/api/link_preview', {
        params: {
          url: url,
        },
      })
      .then((res: AxiosResponse<I_AxiosResponse<I_LinkPreviewResponseFull>>) =>
        setData(res.data.answer)
      )
      .catch(err => console.log(err))
  }

  useEffect(() => {
    const debounce = setTimeout(() => getData(), 500)

    return () => clearTimeout(debounce)
  }, [url])

  return (
    <>
      {data ? (
        <div className={cn('flex flex-col gap-2 w-full', className)} {...props}>
          <a href={data.url}>
            <div
              className={cn(
                'flex justify-center items-center w-[50px] h-[50px] border rounded-md',
                subClassName
              )}
            >
              <img src={data?.favicons[0]} alt="favicon" />
            </div>
          </a>

          <span className="text-sm text-muted-foreground">
            {caption || data.title}
          </span>
        </div>
      ) : (
        <div className={cn('flex flex-col gap-2 w-full', className)} {...props}>
          <div
            className={cn(
              'flex justify-center items-center w-[50px] h-[50px] border rounded-md',
              subClassName
            )}
          >
            <Loader2 className="animate-spin text-muted-foreground" />
          </div>

          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      )}
    </>
  )
}

export default LinkPreview
