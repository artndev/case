import { beautifyUrl } from '@/lib/utils'
import { NextResponse } from 'next/server'
// import chromium from '@sparticuz/chromium'
// import puppeteer from 'puppeteer-core'
import puppeteer from 'puppeteer'

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

  console.log(`Fetching link preview of '${url}'`)
  const startTime = new Date().getTime()

  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 720 })
    await page.setExtraHTTPHeaders({
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    })

    await page.goto(url, {
      waitUntil: 'domcontentloaded',
    })
    await page.waitForSelector('body', {
      timeout: 30000,
    })

    const beautifiedUrl = beautifyUrl(url)
    const title = await page.title()
    const thumbnail = await page.screenshot({
      encoding: 'base64',
      type: 'jpeg',
      quality: 50,
      fullPage: true,
    })

    await browser.close()

    const endTime = new Date().getTime()
    console.log(
      `Link preview of '${url}' fetched in ${(endTime - startTime) / 1000}s`
    )

    return NextResponse.json(
      {
        message: 'Link preview was got successfully',
        answer: {
          url: {
            ...beautifiedUrl,
          },
          title: title,
          thumbnail: `data:image/jpeg;base64,${thumbnail}`,
          favicon: `https://www.google.com/s2/favicons?domain=${url}&sz=64`,
        },
      },
      { status: 200 }
    )
  } catch (err) {
    console.log(err)

    return NextResponse.json(
      { error: 'Server is not responding' },
      { status: 500 }
    )
  }
}
