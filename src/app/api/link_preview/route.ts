import { beautifyUrl } from '@/lib/utils'
import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer-extra'

// TODO: Add US proxy to handle localization properly

// =========== For testing purposes ============

// console.log(`Fetching link preview of '${url}'`)
// const startTime = new Date().getTime()

// const endTime = new Date().getTime()
// console.log(
//   `Link preview of '${url}' fetched in ${(endTime - startTime) / 1000}s`
// )

// =============================================

/* Works but not with every type of form */
// const hideCookieBanners = async (page: Page) => {
//   const selectors = [
//     "[id*='cookie']",
//     "[class*='cookie']",
//     "[id*='consent']",
//     "[class*='consent']",
//     "[id*='gdpr']",
//     "[class*='gdpr']",
//     '.modal__overlay',
//     '.cookie-banner',
//     '.consent-banner',
//   ]

//   const acceptTexts = [
//     'accept',
//     'acceptall',
//     'acceptcookies',
//     'allowall',
//     'iagree',
//     'gotit',
//     'continue',
//   ]

//   await page.evaluate(texts => {
//     const btns = Array.from(
//       document.querySelectorAll<HTMLElement>('button, a, [role="button"]')
//     )

//     const acceptBtn = btns.find(btn =>
//       texts.includes(btn.innerText.trim().toLowerCase())
//     )

//     if (!acceptBtn) {
//       return
//     }

//     acceptBtn.click()
//   }, acceptTexts)

//   await page.evaluate(selectors => {
//     document
//       .querySelectorAll<HTMLElement>(selectors.join(', '))
//       .forEach(el => (el.style.display = 'none'))
//   }, selectors)
// }

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
    // Inject US proxy here
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

    const parsedUrl = new URL(url)
    parsedUrl.searchParams.append('hl', 'en-US') // For Google services

    await page.goto(parsedUrl.toString(), { waitUntil: 'domcontentloaded' })
    // await hideCookieBanners(page)

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

    return NextResponse.json(
      {
        message: 'Link preview was got successfully',
        answer: {
          url: { ...beautifyUrl(url) },
          title,
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
