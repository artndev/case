import { redis } from '@/lib/redis'
import { NextResponse } from 'next/server'
import { I_LinkPreview } from './_types'
import { beautifyUrl } from '@/lib/utils'

export const GET = async (request: Request) => {
  const apiKey = request.headers.get('X-Api-Key')
  if (apiKey !== process.env.X_API_KEY) {
    return NextResponse.json(
      { message: 'Access is forbidden', answer: null },
      { status: 403 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)

    const url = searchParams.get('url')
    if (!url) {
      return NextResponse.json(
        { message: 'URL was not provided', answer: null },
        { status: 400 }
      )
    }

    const cachedLinkPreview = await redis.get<I_LinkPreview>(`preview:${url}`)
    if (!cachedLinkPreview) {
      return NextResponse.json(
        { message: 'Link preview was not found', answer: null },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        message: 'Link preview was got successfully',
        answer: cachedLinkPreview,
      },
      { status: 200 }
    )
  } catch (err) {
    console.log(err)

    return NextResponse.json(
      { message: 'Server is not responding', answer: null },
      { status: 500 }
    )
  }
}
