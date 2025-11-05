import axios from '@/lib/axios-server'
import { SIZE_MAP } from '@/lib/config'
import { BREAKPOINTS } from '@/lib/constants'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Layout } from 'react-grid-layout'
import BoardPreview from './board-preview'

const Board = async ({ params }: { params: { casename: string } }) => {
  const { casename } = params

  const cookieStore = await cookies()

  const widgets: N_Widgets.I_Widget[] | null = await axios
    .get('/api/widgets', {
      headers: {
        Cookie: cookieStore.toString(),
      },
      params: {
        id: casename,
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
    ...BREAKPOINTS.reduce(
      (acc, breakpoint) => {
        acc[breakpoint] = widgets.map(wgt => ({
          i: wgt.id,
          x: wgt[breakpoint === 'md' ? 'x_md' : 'x_sm'],
          y: wgt[breakpoint === 'md' ? 'y_md' : 'y_sm'] ?? Infinity,
          w: SIZE_MAP[wgt.size][breakpoint].w,
          h: SIZE_MAP[wgt.size][breakpoint].h,
          static: true, // Only in sight of the preview mode
          isResizable: false,
        }))

        return acc
      },
      {} as Record<N_Board.T_Breakpoint, Layout[]>
    ),
  }

  return (
    <div
      className={`
        flex justify-center items-center w-screen min-h-screen p-[10px]
        [&_button]:pointer-events-none [&_input]:pointer-events-none [&_textarea]:pointer-events-none
      `}
    >
      <BoardPreview initialLayouts={layouts} initialWidgets={widgets} />
    </div>
  )
}

export default Board
