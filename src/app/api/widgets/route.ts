import validations from '@/app/api/_validations'
import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { deleteWidget, getWidgets, saveWidgets } from './actions'

export const GET = async (request: Request) => {
  const apiKey = request.headers.get('X-Api-Key')
  if (apiKey !== process.env.X_API_KEY) {
    return NextResponse.json(
      { message: 'Access is forbidden', answer: null },
      { status: 403 }
    )
  }

  const res = await getWidgets()
  if (!res) {
    return NextResponse.json(
      { message: 'Server is not responding', answer: null },
      { status: 500 }
    )
  }

  return NextResponse.json(
    {
      message: 'Widgets have been got successfully',
      answer: res,
    },
    { status: 200 }
  )
}

export const POST = async (request: Request) => {
  const apiKey = request.headers.get('X-Api-Key')
  if (apiKey !== process.env.X_API_KEY) {
    return NextResponse.json(
      { message: 'Access is forbidden', answer: null },
      { status: 403 }
    )
  }

  const { searchParams } = new URL(request.url)

  const breakpoint = searchParams.get('breakpoint')
  if (!breakpoint) {
    return NextResponse.json(
      { message: 'Breakpoint is not provided', answer: null },
      { status: 400 }
    )
  }

  let validBody: N_Widgets_API.POST
  let validBreakpoint: N_Board.T_Breakpoint
  try {
    const body = await request.json()

    validBody = validations.Widgets_API.POST.body.parse(body)
    validBreakpoint =
      validations.Widgets_API.POST.params.breakpoint.parse(breakpoint)
  } catch (err) {
    console.log(err)

    if (!(err instanceof ZodError)) {
      return NextResponse.json(
        { message: 'Server is not responding', answer: null },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Validation has not been passed', answer: err.errors },
      { status: 400 }
    )
  }

  const res = await saveWidgets(
    validBody.user_id,
    validBreakpoint,
    validBody.widgets
  )
  if (!res) {
    return NextResponse.json(
      { message: 'Server is not responding', answer: null },
      { status: 500 }
    )
  }

  return NextResponse.json(
    {
      message: 'Widgets have been saved successfully',
      answer: res,
    },
    { status: 200 }
  )
}

export const DELETE = async (request: Request) => {
  const apiKey = request.headers.get('X-Api-Key')
  if (apiKey !== process.env.X_API_KEY) {
    return NextResponse.json(
      { message: 'Access is forbidden', answer: null },
      { status: 403 }
    )
  }

  const { searchParams } = new URL(request.url)

  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json(
      { message: 'ID is not provided', answer: null },
      { status: 400 }
    )
  }

  let validID: string
  try {
    validID = validations.Widgets_API.DELETE.params.id.parse(id)
  } catch (err) {
    console.log(err)

    if (!(err instanceof ZodError)) {
      return NextResponse.json(
        { message: 'Server is not responding', answer: null },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Validation has not been passed', answer: err.errors },
      { status: 400 }
    )
  }

  const res = await deleteWidget(validID)
  if (!res) {
    return NextResponse.json(
      { message: 'Server is not responding', answer: null },
      { status: 500 }
    )
  }

  return NextResponse.json(
    {
      message: 'Widget has been deleted successfully',
      answer: res,
    },
    { status: 200 }
  )
}
