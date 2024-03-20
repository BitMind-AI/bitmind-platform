import { corsHeaders } from '../_shared/cors.ts'

import { createClient } from '@supabase/supabase-js'

import { decode } from 'https://deno.land/x/djwt@v2.8/mod.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      // {
      //   global: {
      //     headers: { Authorization: req.headers.get("authorization")! },
      //   },
      // }
    )

    const token = req.headers.get('authorization')!.replace('Bearer ', '')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_header, payload, _signature] =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      decode(token) as any
    const { sub: userId, email } = payload

    if (!userId) throw new Error('No user id!')

    const ownerToken = Deno.env.get('CODER_OWNER_TOKEN')
    if (!ownerToken) throw new Error('No owner token!')

    // Create a new user in Coder
    const response = await fetch(`${Deno.env.get('CODER_SERVER_API')}/users`, {
      method: 'POST',
      headers: {
        'Coder-Session-Token': ownerToken
      },
      body: JSON.stringify({
        disable_login: true,
        login_type: 'none',
        username: userId.split('-')[0],
        email
      })
    })
    if (!response.ok) throw new Error('Failed to create user')
    const user = await response.json()

    // Create an API key for the user
    const apiKeyResponse = await fetch(
      `${Deno.env.get('CODER_SERVER_API')}/users/${user.id}/keys/tokens`,
      {
        method: 'POST',
        headers: {
          'Coder-Session-Token': ownerToken
        },
        body: JSON.stringify({
          lifetime: 0,
          scope: 'all',
          token_name: 'string'
        })
      }
    )
    if (!apiKeyResponse.ok) throw new Error('Failed to create API key')
    const { key } = await apiKeyResponse.json()

    // Update the user's profile with the API key
    // @ts-expect-error deno-ts(1320)
    const { error } = await supabase
      .from('profiles')
      .update({
        coder_api_key: key
      })
      .eq('id', userId)
      .single()
    if (error) throw error

    return new Response(
      JSON.stringify({
        message: `User created`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    console.error(error)

    return new Response(JSON.stringify({ message: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})
