import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Board from '../_components/boards/preview/board'

const CasenamePage = async ({ params }: { params: { casename: string } }) => {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    redirect('/error')
  }

  if (user && user.id === params.casename) {
    redirect('/board')
  }

  return <Board params={params} />
}

export default CasenamePage
