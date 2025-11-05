import { NextResponse, type NextRequest } from 'next/server'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL!,
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'X-Api-Key, Content-Type',
  'Access-Control-Allow-Credentials': 'true',
}

export const secureEndpoint = async (req: NextRequest) => {
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: CORS_HEADERS,
    })
  }

  const apiKey = req.headers.get('X-Api-Key')
  if (!apiKey || apiKey !== process.env.X_API_KEY) {
    return new NextResponse('No access', {
      status: 401,
      headers: CORS_HEADERS,
    })
  }

  const res = NextResponse.next({
    request: req,
  })

  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    res.headers.set(key, value)
  })

  return res
}
