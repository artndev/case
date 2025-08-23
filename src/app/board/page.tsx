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
    .then(res => res.data.answer)
    .catch(err => console.log(err))

  const widgetTypes = await axios
    .get('/api/widget_types', {
      headers: {
        Cookie: cookieStore.toString(),
      },
    })
    .then(res => res.data.answer)
    .catch(err => console.log(err))

  return (
    <AuthProvider>
      <div className="flex justify-center items-center w-screen min-h-screen">
        <Board initialWidgets={widgets} initialWidgetTypes={widgetTypes} />
      </div>
    </AuthProvider>
  )
}

export default BoardPage
