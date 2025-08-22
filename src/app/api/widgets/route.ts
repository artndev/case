import {
  deleteWidget,
  getWidgets,
  saveWidgets,
} from '@/app/api/widgets/actions'
import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import {
  deleteWidget_id,
  saveWidgets_body,
  T_deleteWidget_id,
  T_saveWidgets_body,
} from './_validations'

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

  let data: T_saveWidgets_body
  try {
    const body = await request.json()

    data = saveWidgets_body.parse(body)
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

  const res = await saveWidgets(data.user_id, data.widgets)
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

  let data: T_deleteWidget_id
  try {
    data = deleteWidget_id.parse(id)
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

  const res = await deleteWidget(data)
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
