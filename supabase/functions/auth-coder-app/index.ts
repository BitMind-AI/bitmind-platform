import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { redirectUri } = await req.json()

    if (!redirectUri) throw new Error('No redirect uri!')

    const apiUrl = `${Deno.env.get('CODER_SERVER_API')}/applications/auth-redirect?redirect_uri=${encodeURIComponent(redirectUri)}`

    // Get the user token from the request headers
    const userToken = req.headers.get('Coder-Session-Token')

    // Forward the request to the API endpoint
    const res = await fetch(apiUrl, {
      headers: {
        'Coder-Session-Token': userToken
      }
    })

    // Extract the encrypted API key from the response headers
    const setCookieHeader = res.headers.get('Set-Cookie')
    if (!setCookieHeader) throw new Error('No Set-Cookie header!')

    const cookiePairs = setCookieHeader.split(';').map((cookie) => {
      const [key, value] = cookie.split('=')
      return { key, value }
    })

    const data = { cookiePairs }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: res.status
    })
  } catch (error) {
    console.error(error)

    return new Response(JSON.stringify({ message: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})
