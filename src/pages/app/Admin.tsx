import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createCoderUser, fetchUsers } from '../../api/users'

import Loader from '../../components/Loader'
import clsx from 'clsx'

export default function Account() {
  const queryClient = useQueryClient()

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
  })

  const createCoderUserMutation = useMutation({
    mutationFn: (id: string) => createCoderUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users']
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

  return (
    <>
      <main className="flex h-full flex-1 flex-col bg-white dark:bg-neutral-800">
        <div className="mt-8 px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                Users
              </h1>
            </div>
          </div>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                        >
                          Has Coder User
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                        >
                          Is Admin
                        </th>
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                        >
                          <span className="sr-only">Edit</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-900">
                      {users && users.length > 0 ? (
                        users.map(
                          ({ id, full_name, avatar_url, coder, is_admin }) => (
                            <tr key={id}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                                <div className="flex items-center">
                                  <div className="h-11 w-11 flex-shrink-0">
                                    {avatar_url ? (
                                      <img
                                        className="h-11 w-11 rounded-full"
                                        src={avatar_url}
                                        alt=""
                                      />
                                    ) : (
                                      <div className="h-11 w-11 rounded-full bg-gray-100 dark:bg-gray-700" />
                                    )}
                                  </div>
                                  <div className="ml-4">
                                    <div className="font-medium text-gray-900 dark:text-white">
                                      {full_name}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                {!!coder ? 'Yes ✅' : 'No ❌'}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                {is_admin ? 'Yes ✅' : 'No ❌'}
                              </td>
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <button
                                  type="button"
                                  className={clsx(
                                    'text-indigo-600 hover:text-indigo-900',
                                    !!coder && 'cursor-not-allowed opacity-50'
                                  )}
                                  disabled={!!coder}
                                  onClick={() =>
                                    createCoderUserMutation.mutate(id)
                                  }
                                >
                                  Create Coder User
                                </button>
                              </td>
                            </tr>
                          )
                        )
                      ) : (
                        <tr>
                          <td
                            colSpan={3}
                            className="py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6"
                          >
                            No users found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
