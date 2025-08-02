import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get('next') ?? '/'

  // if "next" is not a relative URL, use the default
  if (!next.startsWith('/')) next = '/'

  if (!code) return NextResponse.redirect(`${origin}/error`)

  const supabase = await createClient()
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.exchangeCodeForSession(code)

  if (sessionError || !session) return NextResponse.redirect(`${origin}/error`)

  /* logic of "casename" field updates */
  const caseName = searchParams.get('casename')
  if (caseName) {
    const { data, error: selectError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', session.user.id)
      .maybeSingle()

    if (selectError) return NextResponse.redirect(`${origin}/error`)

    if (!data) {
      const { error: insertError } = await supabase.from('profiles').insert({
        id: session.user.id,
        casename: caseName,
        email: session.user.email,
      })

      if (insertError) return NextResponse.redirect(`${origin}/error`)
    }
  }

  const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
  const isLocalEnv = process.env.NODE_ENV === 'development'

  // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
  if (isLocalEnv) return NextResponse.redirect(`${origin}${next}`)
  else if (forwardedHost)
    return NextResponse.redirect(`https://${forwardedHost}${next}`)
  else return NextResponse.redirect(`${origin}${next}`)
}
