import { createAdminClient } from '@/utils/supabase/admin'
import { NextResponse } from 'next/server'

export const GET = async (request: Request) => {
  const apiKey = request.headers.get('X-Api-Key')
  if (apiKey !== process.env.X_API_KEY) {
    return NextResponse.json(
      { message: 'Access is forbidden', answer: null },
      { status: 401 }
    )
  }

  const { searchParams } = new URL(request.url)

  const value = searchParams.get('value')
  if (!value) {
    return NextResponse.json(
      { message: 'Value is not provided', answer: null },
      { status: 400 }
    )
  }

  const supabaseAdmin = await createAdminClient()

  const { data, error: selectError } = await supabaseAdmin
    .from('profiles')
    .select('casename')
    .eq('casename', value)
    .maybeSingle()

  if (selectError) {
    return NextResponse.json(
      { message: 'Server is not responding', answer: null },
      { status: 500 }
    )
  }

  return NextResponse.json(
    {
      message: 'Casename was got successfully',
      answer: data?.casename ? true : false,
    },
    { status: 200 }
  )
}
