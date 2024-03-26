import axios, { AxiosInstance } from 'axios'
import { supabase } from '../lib/supabase'
import { jwtDecode } from 'jwt-decode'

const {
  VITE_CODER_SERVER_API: CODER_SERVER_API,
  VITE_CORS_PROXY_URL: CORS_PROXY_URL
} = import.meta.env

const instance: AxiosInstance = axios.create({
  baseURL: CODER_SERVER_API
})

instance.interceptors.request.use(
  async (config) => {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw new Error(error.message)
    if (!data || !data.session) {
      return config
    }
    const token: { app_metadata?: { api_key?: string } } = jwtDecode(
      data.session?.access_token
    )
    const apiKey = token.app_metadata?.api_key
    // For now, assume that the API key is always required
    if (!apiKey) {
      throw new Error('API key not found')
    }
    config.headers['Coder-Session-Token'] = apiKey

    // If dev mode, use CORS proxy
    if (import.meta.env.DEV) {
      config.baseURL = `${CORS_PROXY_URL}/${CODER_SERVER_API}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default instance
