import { getLinkPreview } from 'link-preview-js'
import { NextResponse } from 'next/server'

export const GET = async (request: Request) => {
  //   const apiKey = request.headers.get('X-Api-Key')
  //   if (apiKey !== process.env.X_API_KEY) {
  //     return NextResponse.json(
  //       { message: 'Access is forbidden', answer: null },
  //       { status: 403 }
  //     )
  //   }

  const { searchParams } = new URL(request.url)

  const url = searchParams.get('url')
  if (!url) {
    return NextResponse.json(
      { message: 'URL was not provided', answer: null },
      { status: 400 }
    )
  }

  try {
    const res = await getLinkPreview(url, {
      timeout: 5000,
      followRedirects: 'follow',
    })

    return NextResponse.json(
      {
        message: 'Link preview was got successfully',
        answer: res,
      },
      { status: 200 }
    )
  } catch (err) {
    return NextResponse.json(
      { error: 'Server is not responding' },
      { status: 500 }
    )
  }
}
