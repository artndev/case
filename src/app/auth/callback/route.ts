import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'
import { PostgrestError } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { PostgresError } from 'postgres'
// The client you created from the Server-Side Auth instructions

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

  const supabaseAdmin = await createAdminClient()
  const caseName = searchParams.get('casename')

  // logic of "casename" field updates
  if (caseName) {
    const { data, error: selectError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', session.user.id)
      .maybeSingle()

    // console.log('SELECT ERROR: ', selectError)
    if (selectError) return NextResponse.redirect(`${origin}/sign-out`)

    if (!data) {
      const { error: insertError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: session.user.id,
          casename: caseName,
          email: session.user.email,
        })

      // console.log('INSERT ERROR: ', insertError)
      if (insertError) {
        await supabaseAdmin.auth.admin.deleteUser(session.user.id)
        return NextResponse.redirect(`${origin}/error`)
      }
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
