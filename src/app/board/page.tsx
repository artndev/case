import axios from '@/lib/axios-server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Board from './_components/board'

const BoardPage = async () => {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) redirect('/sign-in')

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
    <div className="flex justify-center items-center w-screen min-h-screen p-[10px]">
      <Board
        initialWidgets={widgets}
        initialWidgetTypes={widgetTypes}
        userId={user.id}
      />
    </div>
  )
}

export default BoardPage
