'use server'

import {
  T_deleteWidget_id,
  T_saveWidgets_body,
} from '@/app/api/widgets/_validations'
import axios from '@/lib/axios-server'
import { cookies } from 'next/headers'

export const saveWidgets = async (data: T_saveWidgets_body) => {
  const cookieStore = await cookies()

  return axios
    .post('/api/widgets', data, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    })
    .then(res => res.data.answer)
    .catch(err => console.log(err))
}

export const deleteWidget = async (id: T_deleteWidget_id) => {
  const cookieStore = await cookies()

  return axios
    .delete('/api/widgets', {
      headers: {
        Cookie: cookieStore.toString(),
      },
      params: {
        id: id,
      },
    })
    .then(res => res.data.answer)
    .catch(err => console.log(err))
}
