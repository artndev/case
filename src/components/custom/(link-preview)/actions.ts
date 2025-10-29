'use server'

import { I_LinkPreview } from '@/app/api/link_preview/_types'
import axios from '@/lib/axios-server'

export const uploadLinkPreview = async (
  url: string
): Promise<boolean | null> => {
  return axios
    .post('/api/qstash/upload', {
      url,
    })
    .then(res => res.data.answer)
    .catch(err => {
      console.log(err)

      return null
    })
}

export const getLinkPreview = async (
  url: string
): Promise<I_LinkPreview | null> => {
  return axios
    .get('/api/link_preview', {
      params: {
        url,
      },
    })
    .then(res => res.data.answer)
    .catch(err => {
      console.log(err)

      return null
    })
}
