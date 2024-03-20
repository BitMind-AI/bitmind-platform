import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const {
  VITE_CODER_SERVER_API: CODER_SERVER_API
  // VITE_CORS_PROXY_URL: CORS_PROXY_URL
} = import.meta.env

export default function Editor() {
  const [vsCodeUrl, setVsCodeUrl] = useState('')

  const [searchParams] = useSearchParams()

  useEffect(() => {
    // Get editor subdomain from params
    const subdomain = searchParams.get('subdomain')
    if (subdomain) {
      const rootDomain = CODER_SERVER_API.replace(/https:\/\//, '').replace(
        /\/.*/,
        ''
      )
      const appUrl = `https://${subdomain}--${rootDomain}`
      setVsCodeUrl(appUrl)
    }
  }, [searchParams])

  // We want to embed the VS Code editor in an iframe, however the Coder backend had a CSP policy that prevents this.
  // Attempting to embed the editor in an iframe will result in the following error:
  // Refused to frame 'https://<root-domain>' because an ancestor violates the following Content Security Policy directive: "frame-ancestors 'none'".
  // This policy is set in the Coder backend here:
  // https://github.com/coder/coder/blob/9028717c9ba09ef91ff19551b5953ded829150c0/coderd/httpmw/csp.go#L39

  // To open an IDE app, we need to be authenticated. The following endpoint might be useful for this?
  // Redirect to URI with enrypted API key
  // https://coder.com/docs/v2/latest/api/applications#redirect-to-uri-with-encrypted-api-key
  // This endpoint requires the redirect_uri query parameter, and a Coder-Session-Token header with an API key.
  // Response contains a cookie with the encrypted API key, and redirects to the provided URI.

  const handleOpenVsCode = async () => {
    try {
      window.open(
        // `${CODER_SERVER_API}/applications/auth-redirect?redirect_uri=${vsCodeUrl}`,
        vsCodeUrl,
        '_blank',
        'width=800,height=600'
      )
    } catch (error) {
      console.error('Error getting auth redirect:', error)
    }
  }

  return (
    <div className="flex h-full flex-1 flex-col justify-center bg-white dark:bg-neutral-800">
      {/* Not working, due to CSP issue */}
      <span className="text-center text-black dark:text-white">
        VS Code URL: <code>{vsCodeUrl}</code>
      </span>
      <iframe
        title="VS Code"
        src={vsCodeUrl}
        className="mt-4 h-full min-h-[32rem] w-full"
      />

      {/* Works, but only if previously authenticated from the Coder root domain */}
      <button
        className="mx-auto mt-8 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        onClick={handleOpenVsCode}
      >
        Open VS Code
      </button>
    </div>
  )
}
