import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export const updateSession = async (req: NextRequest) => {
  let res = NextResponse.next({
    request: req,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            req.cookies.set(name, value)
          )

          res = NextResponse.next({
            request: req,
          })

          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Not authorized
  if (
    !user &&
    !req.nextUrl.pathname.startsWith('/sign-in') &&
    !req.nextUrl.pathname.startsWith('/sign-up') &&
    !req.nextUrl.pathname.startsWith('/auth') &&
    /* !request.nextUrl.pathname.startsWith('/api') && */
    !req.nextUrl.pathname.startsWith('/error')
  ) {
    // No user, potentially respond by redirecting the user to the login page
    const url = req.nextUrl.clone()
    url.pathname = '/sign-in'

    return NextResponse.redirect(url)
  }

  // Authorized
  if (
    user &&
    (req.nextUrl.pathname.startsWith('/sign-in') ||
      req.nextUrl.pathname.startsWith('/sign-up'))
  ) {
    // No user, potentially respond by redirecting the user to the login page
    const url = req.nextUrl.clone()
    url.pathname = '/'

    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the res object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(res.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return res
}
