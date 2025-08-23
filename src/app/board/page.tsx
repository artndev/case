import {
  T_deleteWidget_id,
  T_saveWidgets_body,
} from '@/app/api/widgets/_validations'
import axios from '@/lib/axios-server'
import { cookies } from 'next/headers'
import { AuthProvider } from '../_contexts/auth-context'
import Board from './_components/board'

const BoardPage = async () => {
  const cookieStore = await cookies()

  const widgets = await axios
    .get('/api/widgets', {
      headers: {
        Cookie: cookieStore.toString(),
      },
    })
    .then(res => res.data)
    .catch(err => console.log(err))

  const widgetTypes = await axios
    .get('/api/widget_types', {
      headers: {
        Cookie: cookieStore.toString(),
      },
    })
    .then(res => res.data)
    .catch(err => console.log(err))

  const saveWidgets = async (data: T_saveWidgets_body) => {
    await axios
      .post('/api/widgets', data, {
        headers: {
          Cookie: cookieStore.toString(),
        },
      })
      .then(res => res.data)
      .catch(err => console.log(err))
  }

  const deleteWidget = async (id: T_deleteWidget_id) => {
    const url = new URL('/api/widgets')
    url.searchParams.append('id', id)

    await axios
      .post(url.toString(), {
        headers: {
          Cookie: cookieStore.toString(),
        },
      })
      .then(res => res.data)
      .catch(err => console.log(err))
  }

  return (
    <AuthProvider>
      <div className="flex justify-center items-center w-screen min-h-screen">
        <Board />
      </div>
    </AuthProvider>
  )
}

export default BoardPage
