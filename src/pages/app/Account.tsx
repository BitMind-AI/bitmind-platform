import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import { fetchWorkspaces } from '../../api/workspaces'

import { supabase } from '../../lib/supabase'
import useSupabase from '../../hooks/useSupabase'
import useNotifications from '../../hooks/useNotifications'

import Contact from '../../components/Contact'

import {
  ChevronRightIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/20/solid'
import Loader from '../../components/Loader'
import Dialog from '../../components/Dialog'
import DialogEmpty from '../../components/DialogEmpty'

import clsx from 'clsx'

const statuses = {
  stopped: 'text-gray-500 bg-gray-100/10',
  running: 'text-green-400 bg-green-400/10',
  error: 'text-rose-400 bg-rose-400/10'
}

export default function Account() {
  const [supportModalOpen, setSupportModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const { data: workspaces, isLoading } = useQuery({
    queryKey: ['workspaces'],
    queryFn: fetchWorkspaces
  })

  const navigate = useNavigate()
  const { user, profile } = useSupabase()
  const { addMessage } = useNotifications()

  const handleDeleteAccount = async () => {
    try {
      const { error } = await supabase.functions.invoke('close-account')
      if (error) throw error

      await supabase.auth.signOut()
      navigate('/')
    } catch (error) {
      addMessage({
        title: 'Error closing account',
        message: 'Please try again later.',
        type: 'error'
      })
      console.error('Error closing account:', error)
    }
  }

  if (isLoading || !user || !profile) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-neutral-800">
        <Loader />
      </div>
    )
  }

  return (
    <>
      <main className="flex h-full flex-1 flex-col bg-white dark:bg-neutral-800">
        <header className="relative isolate pt-16">
          <div
            className="absolute inset-0 -z-10 overflow-hidden"
            aria-hidden="true"
          >
            <div className="absolute left-16 top-full -mt-16 transform-gpu opacity-50 blur-3xl dark:opacity-75 xl:left-1/2 xl:-ml-80">
              <div
                className="aspect-[1154/678] w-[72.125rem] bg-gradient-to-br from-[#4F46E5] to-[#4238CA]"
                style={{
                  clipPath:
                    'polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)'
                }}
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-px bg-gray-900/5 dark:bg-white/5" />
          </div>

          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-2xl items-center justify-between gap-x-8 lg:mx-0 lg:max-w-none">
              <div className="flex items-center gap-x-6">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt=""
                    className="h-16 w-16 flex-none rounded-full ring-1 ring-gray-900/10 dark:ring-white/10"
                  />
                ) : (
                  <span className="inline-block h-16 w-16 overflow-hidden rounded-full bg-gray-100">
                    <svg
                      className="h-full w-full text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                )}
                <h1>
                  <div className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                    {profile.full_name}
                  </div>
                  <div className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-300">
                    {profile.username || user.email}
                  </div>
                </h1>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto w-full max-w-7xl divide-y px-4 py-16 dark:divide-gray-600 sm:px-6 lg:px-8">
          <div className="mt-8">
            <div className="mt-8 max-w-2xl">
              <h2 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                Workspaces
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-200">
                View and manage your workspaces.
              </p>

              <ul
                role="list"
                className="divide-y divide-gray-100 dark:divide-white/5"
              >
                {workspaces && workspaces.count > 0 ? (
                  workspaces.workspaces.map(
                    ({
                      id,
                      name,
                      template_display_name,
                      latest_build,
                      last_used_at
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    }: any) => (
                      <li
                        key={id}
                        className="relative flex items-center space-x-4 py-4"
                      >
                        <div className="min-w-0 flex-auto">
                          <div className="flex items-center gap-x-3">
                            <div
                              className={clsx(
                                statuses[
                                  latest_build.status as keyof typeof statuses
                                ],
                                'flex-none rounded-full p-1'
                              )}
                            >
                              <div className="h-2 w-2 rounded-full bg-current" />
                            </div>
                            <h2 className="min-w-0 text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                              <Link
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                to={`/editor?subdomain=${latest_build.resources.find((r: any) => r.type === 'docker_container')?.agents[0]?.apps.find((a: any) => a.slug === 'vscode-web')?.subdomain_name}`}
                                className="flex gap-x-2"
                              >
                                <span className="truncate">{name}</span>
                                <span className="text-gray-400">/</span>
                                <span className="whitespace-nowrap">
                                  {template_display_name}
                                </span>
                                <span className="absolute inset-0" />
                              </Link>
                            </h2>
                          </div>
                          <div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-gray-400">
                            <p className="truncate">
                              {latest_build.initiator_name}
                            </p>
                            <svg
                              viewBox="0 0 2 2"
                              className="h-0.5 w-0.5 flex-none fill-gray-300"
                            >
                              <circle cx={1} cy={1} r={1} />
                            </svg>
                            <p className="whitespace-nowrap">
                              Last used{' '}
                              <time dateTime={last_used_at}>
                                {new Date(last_used_at).toLocaleDateString()}
                              </time>
                            </p>
                          </div>
                        </div>
                        <ChevronRightIcon
                          className="h-5 w-5 flex-none text-gray-400"
                          aria-hidden="true"
                        />
                      </li>
                    )
                  )
                ) : (
                  <div className="mt-4 flex items-center gap-x-2">
                    <InformationCircleIcon
                      className="h-4 w-4 text-gray-400 dark:text-gray-300"
                      aria-hidden="true"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      No workspaces found.
                    </p>
                  </div>
                )}
              </ul>
            </div>
          </div>

          <div className="mt-8">
            <div className="mt-8 max-w-2xl">
              <h2 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                Support
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-200">
                If you have any questions or need help, please contact us.
              </p>
              <button
                type="button"
                className="relative mt-4 flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => setSupportModalOpen(true)}
              >
                Contact support
              </button>
            </div>
          </div>

          <div className="mt-8">
            <div className="mt-8 max-w-2xl">
              <h2 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                Account deletion
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-200">
                Once you delete your account, there is no going back.
              </p>
              <button
                type="button"
                className="relative mt-4 flex justify-center rounded-md border border-transparent bg-red-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                onClick={() => {
                  setDeleteModalOpen(true)
                }}
              >
                Delete account
              </button>
            </div>
          </div>
        </div>
      </main>

      <Dialog
        show={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete account"
        description="Are you sure you want to delete your account? All of your workspaces will be permanently removed. This action cannot be undone."
        onConfirm={handleDeleteAccount}
        confirmText="I'm sure, delete my account"
        cancelText="Cancel"
      />

      <DialogEmpty
        show={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
      >
        <button
          className="absolute right-0 top-0 p-4"
          onClick={() => setSupportModalOpen(false)}
        >
          <span className="sr-only">Close</span>
          <XMarkIcon className="h-6 w-6 text-neutral-500 dark:text-neutral-400" />
        </button>
        <Contact />
      </DialogEmpty>
    </>
  )
}
