import { redis } from '@/lib/redis'
import { beautifyUrl } from '@/lib/utils'
import { verifySignatureAppRouter } from '@upstash/qstash/nextjs'
import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer-extra'
import { I_LinkPreview } from '../../link_preview/_types'

const fetchLinkPreview = async (url: string): Promise<I_LinkPreview> => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const page = await browser.newPage()
  await page.setViewport({
    width: 1920,
    height: 1080,
  })
  await page.setExtraHTTPHeaders({
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US',
  })
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'language', { get: () => 'en-US' })
    Object.defineProperty(navigator, 'languages', { get: () => ['en-US'] })
  })

  const parsedUrl = new URL(decodeURIComponent(url))

  // For Google services
  parsedUrl.searchParams.append('hl', 'en-US')

  await page.goto(parsedUrl.toString(), { waitUntil: 'domcontentloaded' })

  const title = await page.title()
  const thumbnail = await page.screenshot({
    encoding: 'base64',
    type: 'jpeg',
    quality: 50,
    clip: {
      x: 0,
      y: 0,
      width: 1920,
      height: 1080,
    },
  })

  await browser.close()

  return {
    url: { ...beautifyUrl(url) },
    title,
    thumbnail: `data:image/jpeg;base64,${thumbnail}`,
    favicon: `https://www.google.com/s2/favicons?domain=${url}&sz=64`,
  }
}

export const POST = verifySignatureAppRouter(async (req: Request) => {
  try {
    const { url } = await req.json()

    // TODO: Add additional key to handle user-specific cases e.g. userId
    const cachedLinkPreview = await redis.get<I_LinkPreview>(`preview:${url}`)

    if (cachedLinkPreview) {
      return NextResponse.json(
        {
          message: 'This link preview has already been cached',
          answer: true,
        },
        { status: 200 }
      )
    }

    const linkPreview = await fetchLinkPreview(url)
    await redis.set(`preview:${url}`, linkPreview, {
      ex: 60 * 60 * 24 * 7,
    })

    // For broadcast updates
    // await redis.publish(`preview_channel:${url}`, linkPreview)

    return NextResponse.json(
      {
        message: 'Link preview was processed successfully',
        answer: true,
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
})
