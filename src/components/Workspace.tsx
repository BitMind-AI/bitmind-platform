import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'

export default function Workspace({ theme }: { theme: string }) {
  const [workspaceUrl, setWorkspaceUrl] = useState<string>('')

  const [searchParams] = useSearchParams()

  useEffect(() => {
    const workspace = searchParams.get('workspace')
    if (workspace) {
      setWorkspaceUrl(workspace)
    }
  }, [searchParams])

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
