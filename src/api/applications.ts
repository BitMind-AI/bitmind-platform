import { supabase } from '../lib/supabase'

import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'

const { VITE_CODER_SERVER_API: CODER_SERVER_API } = import.meta.env

// Expects primary wildcard app hostname, a workspace proxy access URL or a workspace proxy wildcard app hostname
export const authenticateApplication = async (redirectUri: string) => {
  try {
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession()
    if (sessionError) throw new Error(sessionError.message)
    if (!sessionData || !sessionData.session) {
      throw new Error('No session found')
    }
    const token: { app_metadata?: { api_key?: string } } = jwtDecode(
      sessionData.session.access_token
    )
    const apiKey = token.app_metadata?.api_key
    if (!apiKey) {
      throw new Error('API key not found')
    }

    const { data, error } = await supabase.functions.invoke('auth-coder-app', {
      headers: {
        'Coder-Session-Token': apiKey
      },
      body: {
        redirectUri
      }
    })
    if (error) throw error
    if (!data) {
      throw new Error('No data returned from auth-coder-app edge function')
    }

    const coderHeaders = [
      'coder_signed_app_token',
      'coder_subdomain_app_session_token'
    ]

    const { cookiePairs } = data
    if (!cookiePairs || !cookiePairs.length) {
      throw new Error(
        'No cookie pairs returned from auth-coder-app edge function'
      )
    }

    // Ensure that the cookies are set on the base domain
    // Frontend should be served on a subdomain of the base domain
    const domain = CODER_SERVER_API.split('//')[1].split('/')[0]

    cookiePairs
      .filter((cookiePair: { key: string; value: string }) =>
        coderHeaders.includes(cookiePair.key)
      )
      .forEach((cookiePair: { key: string; value: string }) => {
        const { key: name, value } = cookiePair
        Cookies.set(name, value, {
          domain
        })
      })
  } catch (error) {
    console.error('Error fetching auth redirect', error)
    throw new Error('Failed to fetch auth redirect')
  }
}
