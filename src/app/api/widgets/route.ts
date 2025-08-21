import { getWidgets } from '@/app/api/widgets/actions'
import { NextResponse } from 'next/server'

export const GET = async (request: Request) => {
  const apiKey = request.headers.get('X-Api-Key')
  if (apiKey !== process.env.X_API_KEY) {
    return NextResponse.json(
      { message: 'Access is forbidden', answer: null },
      { status: 403 }
    )
  }

  const data = await getWidgets()
  if (!data) {
    return NextResponse.json(
      { message: 'Server is not responding', answer: null },
      { status: 500 }
    )
  }

  return NextResponse.json(
    {
      message: 'Widgets have been got successfully',
      answer: data,
    },
    { status: 200 }
  )
}
