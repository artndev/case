'use server'

import axios from '@/lib/axios-server'
import { cookies } from 'next/headers'

export const getWidgets = async (
  id: string
): Promise<N_Widgets.I_Widget[] | null> => {
  const cookieStore = await cookies()

  return axios
    .get('/api/widgets', {
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
