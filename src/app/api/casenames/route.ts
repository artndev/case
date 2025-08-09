import { createAdminClient } from '@/utils/supabase/admin'
import { NextResponse } from 'next/server'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL!,
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'X-Api-Key, Content-Type',
  'Access-Control-Allow-Credentials': 'false',
}

export const OPTIONS = async () => {
  return new NextResponse(null, {
    headers: CORS_HEADERS,
    status: 204,
  })
}

export const GET = async (request: Request) => {
  const apiKey = request.headers.get('X-Api-Key')
  if (apiKey !== process.env.X_API_KEY) {
    return NextResponse.json(
      { message: 'Access is forbidden', answer: null },
      {
        headers: CORS_HEADERS,
        status: 401,
      }
    )
  }

  const { searchParams } = new URL(request.url)

  const value = searchParams.get('value')
  if (!value) {
    return NextResponse.json(
      { message: 'Value is not provided', answer: null },
      {
        headers: CORS_HEADERS,
        status: 400,
      }
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
      {
        headers: CORS_HEADERS,
        status: 500,
      }
    )
  }

  return NextResponse.json(
    {
      message: 'Casename was got successfully',
      answer: data?.casename ? true : false,
    },
    {
      headers: CORS_HEADERS,
      status: 200,
    }
  )
}
