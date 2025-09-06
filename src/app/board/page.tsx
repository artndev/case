import axios from '@/lib/axios-server'
import { SIZE_MAP } from '@/lib/config'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Layout } from 'react-grid-layout'
import Board from './_components/board'

const BoardPage = async () => {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) redirect('/sign-in')

  const cookieStore = await cookies()

  const widgets: N_Widgets.I_Widget[] | null = await axios
    .get('/api/widgets', {
      headers: {
        Cookie: cookieStore.toString(),
      },
    })
    .then(res => res.data.answer)
    .catch(err => console.log(err))

  if (!widgets) {
    redirect('/error')
  }

  const widgetTypes: N_Widgets.I_WidgetType[] | null = await axios
    .get('/api/widget_types', {
      headers: {
        Cookie: cookieStore.toString(),
      },
    })
    .then(res => res.data.answer)
    .catch(err => console.log(err))

  if (!widgetTypes) {
    redirect('/error')
  }

  const layouts: Record<string, Layout[]> = {
    md: widgets.map(wgt => ({
      i: wgt.id,
      x: wgt.x_md,
      y: wgt.y_md ?? Infinity,
      w: SIZE_MAP[wgt.size].w,
      h: SIZE_MAP[wgt.size].h,
      static: false,
    })),
    sm: widgets.map(wgt => ({
      i: wgt.id,
      x: wgt.x_sm,
      y: wgt.y_sm ?? Infinity,
      w: SIZE_MAP[wgt.size].w,
      h: SIZE_MAP[wgt.size].h,
      static: false,
    })),
  }

  // const savedLayouts = cookieStore.get('layouts')?.value
  // const savedWidgets = cookieStore.get('widgets')?.value

  return (
    <div className="flex justify-center items-center w-screen min-h-screen p-[10px]">
      <Board
        userId={user.id}
        initialWidgets={widgets}
        initialWidgetTypes={widgetTypes}
        initialLayouts={layouts}
      />
    </div>
  )
}

export default BoardPage
