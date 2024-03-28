import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

// import Cookies from 'js-cookie'

import { authenticateApplication } from '../api/applications'

import { ExclamationTriangleIcon, FolderIcon } from '@heroicons/react/20/solid'

// const CODER_COOKIE_KEY = 'coder_signed_app_token'

export default function Workspace({ theme }: { theme: string }) {
  const [loading, setLoading] = useState(false)
  const [workspaceUrl, setWorkspaceUrl] = useState<string>('')

  const [searchParams] = useSearchParams()

  useEffect(() => {
    const init = async () => {
      if (!workspaceUrl) return
      try {
        setLoading(true)
        // // check if we have a coder_signed_app_token cookie set
        // // if not, authenticate the application
        // const coderToken = Cookies.get(CODER_COOKIE_KEY)

        // DEBUG: Just authenticate the application every time for now
        // We don't know how long the session token is valid for
        console.debug('Authenticating application:', workspaceUrl)
        await authenticateApplication(workspaceUrl)
      } catch (error) {
        console.error('Error initializing workspace', error)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [workspaceUrl])

  useEffect(() => {
    const workspace = searchParams.get('workspace')
    if (workspace) {
      setWorkspaceUrl(workspace)
    }
  }, [searchParams])

  if (loading) {
    return (
      <div className="h-full flex-1">
        <div className="flex h-full items-center justify-center py-16 sm:py-32">
          <div className="rounded-md bg-blue-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FolderIcon
                  className="h-5 w-5 text-blue-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Loading workspace...
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!workspaceUrl) {
    return (
      <div className="h-full flex-1">
        <div className="flex h-full items-center justify-center py-16 sm:py-32">
          <div className="rounded-md bg-yellow-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon
                  className="h-5 w-5 text-yellow-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Workspace not found
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    This workspace may have been deleted or you may not have
                    access to it.
                  </p>
                </div>
                <div className="mt-2">
                  <code className="truncate rounded-md bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-900 dark:bg-gray-800 dark:text-white">
                    {JSON.stringify(searchParams)}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <iframe
      className="h-full flex-1"
      src={workspaceUrl}
      width="100%"
      height="100%"
    />
  )
}
