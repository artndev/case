'use server'

import axios from '@/lib/axios-server'
import { cookies } from 'next/headers'

export const saveWidgets = async (
  data: N_Widgets_API.POST,
  breakpoint: N_Board.T_Breakpoint
): Promise<boolean | null> => {
  const cookieStore = await cookies()

  return axios
    .post('/api/widgets', data, {
      headers: {
        Cookie: cookieStore.toString(),
      },
      params: {
        breakpoint,
      },
    })
    .then(res => res.data.answer)
    .catch(err => console.log(err))
}

export const deleteWidget = async (id: string): Promise<boolean | null> => {
  const cookieStore = await cookies()

  return axios
    .delete('/api/widgets', {
      headers: {
        Cookie: cookieStore.toString(),
      },
      params: {
        id,
      },
    })
    .then(res => res.data.answer)
    .catch(err => console.log(err))
}
