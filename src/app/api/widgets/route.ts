import validations from '@/lib/validations'
import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { deleteWidget, getWidgets, saveWidgets } from './actions'

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  const res = await getWidgets(id)
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
  let validBody: N_Widgets_API.POST
  try {
    const body = await request.json()

    console.log('BODY: ', body)

    validBody = validations.Widgets_API.POST.body.parse(body)
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

  const res = await saveWidgets(validBody.widgets)
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
