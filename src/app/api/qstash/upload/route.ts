import { Client } from '@upstash/qstash'
import { NextResponse } from 'next/server'

const client = new Client({ token: process.env.QSTASH_TOKEN! })

export const POST = async (req: Request) => {
  try {
    const { url } = await req.json()

    if (!url) {
      return NextResponse.json(
        { message: 'Validation was not passed', answer: null },
        { status: 400 }
      )
    }

    const result = await client.publishJSON({
      url: process.env.QSTASH_PROCESS_URL!,
      body: { url },
      headers: {
        'X-Api-Key': process.env.X_API_KEY!,
      },
    })

    return NextResponse.json(
      {
        message: 'Link preview queued for processing',
        answer: {
          qstashMessageId: result.messageId,
        },
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
