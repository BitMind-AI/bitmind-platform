import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { fetchTemplates } from '../../api/templates'
import { createWorkspace } from '../../api/workspaces'

import { computeOptions } from '../../fixtures/compute'

import Loader from '../../components/Loader'
import Steps from '../../components/Steps'
import clsx from 'clsx'
import { InformationCircleIcon } from '@heroicons/react/20/solid'

export default function Review() {
  const [editMode, setEditMode] = useState(false)
  const [workspaceName, setWorkspaceName] = useState(
    'my-workspace-' + new Date().toISOString().split('T')[0].replace(/-/g, '')
  )
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentStep, setDeploymentStep] = useState(1)

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const computeId = searchParams.get('computeId')
  const templateId = searchParams.get('templateId')

  const queryClient = useQueryClient()

  const { data: templates, isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: fetchTemplates
  })

  const createWorkspaceMutation = useMutation({
    mutationFn: ({ name, templateId }: { name: string; templateId: string }) =>
      createWorkspace({
        name,
        templateId
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['workspaces']
      })
    }
  })

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-neutral-800">
        <Loader />
      </div>
    )
  }

  const steps = [
    { id: 'Step 1', name: 'Compute', href: '/compute', status: 'complete' },
    {
      id: 'Step 2',
      name: 'Template',
      href: `/template?computeId=${computeId}`,
      status: 'complete'
    },
    { id: 'Step 3', name: 'Review', href: '#', status: 'current' }
  ]

  const handleDeploy = async () => {
    if (!templateId) return

    try {
      setIsDeploying(true)

      const newWorkspace = await createWorkspaceMutation.mutateAsync({
        name: workspaceName,
        templateId
      })
      if (!newWorkspace) throw new Error('Failed to create workspace')

      // Mock deployment
      setDeploymentStep(1)
      setInterval(() => {
        setDeploymentStep((prev) => prev + 1)
      }, 1000)
      setTimeout(() => {
        setIsDeploying(false)
        navigate(`/account`)
      }, 4000)
    } catch (error) {
      console.error('Error deploying workspace:', error)
      setIsDeploying(false)
    }
  }

  const template = templates.find((t: any) => t.id === templateId)

  const compute = computeOptions.find((c) => c.id === computeId)

  if (isDeploying) {
    return (
      <main className="flex h-full flex-1 flex-col bg-white dark:bg-neutral-800">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32">
          <h4 className="sr-only">Status</h4>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            Deploying compute configuration...
          </p>
          <div className="mt-6" aria-hidden="true">
            <div className="overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-indigo-600 transition-all"
                style={{ width: `${(deploymentStep / 4) * 100}%` }}
              />
            </div>
            <div className="mt-6 hidden grid-cols-4 text-sm font-medium text-gray-600 sm:grid">
              <div
                className={clsx(
                  'text-left',
                  deploymentStep >= 1 ? 'text-indigo-600' : 'text-gray-400'
                )}
              >
                Copying files
              </div>
              <div
                className={clsx(
                  'text-center',
                  deploymentStep >= 2 ? 'text-indigo-600' : 'text-gray-400'
                )}
              >
                Spinning up compute
              </div>
              <div
                className={clsx(
                  'text-center',
                  deploymentStep >= 3 ? 'text-indigo-600' : 'text-gray-400'
                )}
              >
                Turning gears
              </div>
              <div
                className={clsx(
                  'text-right',
                  deploymentStep >= 4 ? 'text-indigo-600' : 'text-gray-400'
                )}
              >
                Deployed
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex h-full flex-1 flex-col bg-white dark:bg-neutral-800">
      <Steps steps={steps} />

      <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32">
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
              Review deployment
            </h2>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-2xl">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                Deployment configuration
              </h1>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
                Review your deployment before running.
              </p>
            </div>
          </div>

          <div className="mt-8 flex items-center">
            {editMode ? (
              <div className="flex flex-col">
                <input
                  type="text"
                  className="block w-full min-w-[12rem] rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm"
                  placeholder="Workspace name"
                  value={workspaceName}
                  onChange={(e) =>
                    setWorkspaceName(e.target.value.replace(/\s/g, ''))
                  }
                />
              </div>
            ) : (
              <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                {workspaceName}
              </h3>
            )}
            <button
              type="button"
              className="ml-3 text-sm font-medium text-indigo-600"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? 'Save' : 'Edit name'}
            </button>
          </div>
          {editMode && (
            <div className="mt-1 flex items-center">
              <InformationCircleIcon
                className="h-4 w-4 text-gray-400 dark:text-gray-300"
                aria-hidden="true"
              />
              <p className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                No spaces allowed
              </p>
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 gap-y-6">
            <div className="flex flex-col space-y-4">
              <div className="rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-800">
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <span className="block text-sm font-medium text-gray-900 dark:text-white">
                      {compute?.name}
                    </span>
                    <span className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      {compute?.charge}
                    </span>
                    <span className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                      {compute?.provider}
                    </span>
                  </span>
                </span>
              </div>

              <Link
                to="/compute"
                className="text-sm font-medium text-indigo-600"
              >
                Change compute
              </Link>
            </div>
            <div className="flex flex-col space-y-4">
              <div className="rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-800">
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <span className="block text-sm font-medium text-gray-900 dark:text-white">
                      {template?.display_name ||
                        template?.name ||
                        'Blank template'}
                    </span>
                    <span className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {template
                        ? ''
                        : 'An empty workspace, pick your own tools.'}
                    </span>
                  </span>
                </span>
              </div>

              <Link
                to={`/template?computeId=${computeId}`}
                className="text-sm font-medium text-indigo-600"
              >
                Change template
              </Link>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Estimated charges
            </h3>
            <div className="mt-6">
              <div className="rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-800">
                <span className="block text-sm font-medium text-gray-900 dark:text-white">
                  {compute?.charge}
                </span>
                <span className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Estimated charges for compute
                </span>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-20 max-w-lg lg:max-w-3xl">
            <div className="flex justify-center">
              <button
                className="rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700"
                onClick={handleDeploy}
              >
                Looks good, deploy!
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
