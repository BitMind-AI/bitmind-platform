import { Link } from 'react-router-dom'

import { humanizeDate } from '../utils/helpers'

import { ChevronRightIcon } from '@heroicons/react/20/solid'

import clsx from 'clsx'

const statuses = {
  stopped: 'text-gray-500 bg-gray-100/10',
  running: 'text-green-400 bg-green-400/10',
  error: 'text-rose-400 bg-rose-400/10'
}

const { VITE_CODER_SERVER_API: CODER_SERVER_API } = import.meta.env

interface WorkspaceLinkProps {
  workspace: {
    id: string
    name: string
    template_display_name: string
    latest_build: {
      status: string
      resources: {
        type: string
        agents: {
          apps: {
            slug: string
            subdomain_name: string
            url: string
          }[]
        }[]
      }[]
    }
    last_used_at: string
  }
  profileName: string
}

export default function WorkspaceLink(props: WorkspaceLinkProps) {
  const { workspace, profileName } = props
  const { name, template_display_name, latest_build, last_used_at } = workspace

  // TODO: Support apps other than code-server
  const app = latest_build.resources
    .find((r: any) => r.type === 'docker_container')
    ?.agents[0]?.apps.find((a: any) => a.slug === 'code-server')

  if (!app) return null

  const { subdomain_name, url } = app

  const urlParams = url.split('?')[1]

  const baseDomain = CODER_SERVER_API.split('//')[1].split('/')[0]

  const workspaceUrl = `https://${subdomain_name}.${baseDomain}/?${urlParams}`

  return (
    <li className="relative flex items-center space-x-4 py-4">
      <div className="min-w-0 flex-auto">
        <div className="flex items-center gap-x-3">
          <div
            className={clsx(
              statuses[latest_build.status as keyof typeof statuses],
              'flex-none rounded-full p-1'
            )}
          >
            <div className="h-2 w-2 rounded-full bg-current" />
          </div>
          <h2 className="min-w-0 text-sm font-semibold leading-6 text-gray-900 dark:text-white">
            <Link
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              to={`/editor?workspace=${workspaceUrl}`}
              className="flex gap-x-2"
            >
              <span className="truncate">{profileName}</span>
              <span className="text-gray-400">/</span>
              <span className="whitespace-nowrap">{name}</span>
              <span className="absolute inset-0" />
            </Link>
          </h2>
        </div>
        <div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-gray-400">
          <p className="truncate">{template_display_name}</p>
          <svg
            viewBox="0 0 2 2"
            className="h-0.5 w-0.5 flex-none fill-gray-300"
          >
            <circle cx={1} cy={1} r={1} />
          </svg>
          <p className="whitespace-nowrap">
            Last used{' '}
            <time dateTime={last_used_at}>{humanizeDate(last_used_at)}</time>
          </p>
        </div>
      </div>
      <ChevronRightIcon
        className="h-5 w-5 flex-none text-gray-400"
        aria-hidden="true"
      />
    </li>
  )
}
