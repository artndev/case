import { NextResponse } from 'next/server'
import { getCasename } from './actions'

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url)

  const name = searchParams.get('name')
  if (!name) {
    return NextResponse.json(
      { message: 'Name was not provided', answer: null },
      { status: 400 }
    )
  }

  const res = await getCasename(name)
  if (res === null) {
    return NextResponse.json(
      { message: 'Server is not responding', answer: null },
      { status: 500 }
    )
  }

  return NextResponse.json(
    {
      message: 'Casename was got successfully',
      answer: res,
    },
    { status: 200 }
  )
}
