import { checkUser, verifyState } from '@/app/actions'
import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

// The client you created from the Server-Side Auth instructions
export async function GET(request: Request) {
  let { searchParams, origin } = new URL(request.url)
  origin = 'https://nongraven-stedfastly-galilea.ngrok-free.dev'

  // If "next" is in param, use it as the redirect URL
  let next = searchParams.get('next') ?? '/'

  // If "next" is not a relative URL, use the default
  if (!next.startsWith('/')) next = '/'

  const code = searchParams.get('code')
  if (!code) return NextResponse.redirect(`${origin}/error`)

  const state = searchParams.get('state')
  // console.log('STATE: ', state)
  if (!state) return NextResponse.redirect(`${origin}/error`)

  const statePayload = verifyState(state)
  // console.log('STATE_PAYLOAD: ', statePayload)
  if (!statePayload) return NextResponse.redirect(`${origin}/error`)

  const supabase = await createClient()
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.exchangeCodeForSession(code)

  if (sessionError || !session) return NextResponse.redirect(`${origin}/error`)

  await supabase.auth.setSession(session)

  // Check for user in profiles table
  const user = await checkUser(session.user.id)

  // Wait for any errors
  if (user === null) return NextResponse.redirect(`${origin}/error`)

  const supabaseAdmin = await createAdminClient()

  // Handle sign in to non-existing profile
  if (statePayload.type === 'sign-in' && user === false) {
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
      session.user.id
    )

    if (deleteError) return NextResponse.redirect(`${origin}/error`)

    return NextResponse.redirect(`${origin}/sign-up`)
  }

  if (statePayload.type === 'sign-up' && user === false) {
    const { error: insertError } = await supabase.from('profiles').insert({
      id: session.user.id,
      email: session.user.email,
      casename: statePayload.casename,
    })

    if (insertError) return NextResponse.redirect(`${origin}/sign-out`)
  }

  // Original origin before load balancer
  const forwardedHost = request.headers.get('X-Forwarded-Host')

  const isLocalEnv = process.env.NODE_ENV === 'development'

  /* We can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host */

  if (isLocalEnv) return NextResponse.redirect(`${origin}${next}`)

  if (forwardedHost)
    return NextResponse.redirect(`https://${forwardedHost}${next}`)

  return NextResponse.redirect(`${origin}${next}`)
}
