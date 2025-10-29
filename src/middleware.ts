import { secureEndpoint } from '@/utils/supabase/middlewares/secure-endpoint'
import { updateSession } from '@/utils/supabase/middlewares/update-session'
import { type NextRequest } from 'next/server'

export const middleware = async (req: NextRequest) => {
  const url = req.nextUrl.pathname

  if (!url.startsWith('/api')) {
    return await updateSession(req)
  }

  return await secureEndpoint(req)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    '/api/:path*',
  ],
}
