import { NextResponse } from 'next/server'
import { getWidgetTypes } from './actions'

export const GET = async (request: Request) => {
  const res = await getWidgetTypes()
  if (!res) {
    return NextResponse.json(
      { message: 'Server is not responding', answer: null },
      { status: 500 }
    )
  }

  return NextResponse.json(
    {
      message: 'Widget types have been got successfully',
      answer: res,
    },
    { status: 200 }
  )
}
