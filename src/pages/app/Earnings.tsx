import { Fragment, useState } from 'react'

import useNotifications from '../../hooks/useNotifications'

import { Dialog, Transition } from '@headlessui/react'
import { BuildingLibraryIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { InformationCircleIcon } from '@heroicons/react/20/solid'

import clsx from 'clsx'

const transactions = [
  {
    id: 1,
    time: '10:00 AM',
    updated: 21,
    emission: '0.0554τ'
  },
  {
    id: 2,
    time: '11:00 AM',
    updated: 197,
    emission: '0.0734τ'
  },
  {
    id: 3,
    time: '12:00 PM',
    updated: 21,
    emission: '0.0554τ'
  },
  {
    id: 4,
    time: '1:00 PM',
    updated: 197,
    emission: '0.0734τ'
  },
  {
    id: 5,
    time: '2:00 PM',
    updated: 21,
    emission: '0.0554τ'
  },
  {
    id: 6,
    time: '3:00 PM',
    updated: 197,
    emission: '0.0734τ'
  }
]

export default function Earnings() {
  const [earnings, setEarnings] = useState<number>(0.128)
  const [isWithdrawDrawerOpen, setIsWithdrawDrawerOpen] = useState(false)

  const { addMessage } = useNotifications()

  const handleCashOut = () => {
    setEarnings(0)
    addMessage({
      title: 'Success',
      message: 'You have successfully cashed out your earnings!',
      type: 'success'
    })
  }

  const canCashOut = earnings > 0

  return (
    <>
      <main className="flex h-full flex-1 flex-col bg-white dark:bg-neutral-800">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32">
          <div className="md:flex md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
                Earnings
              </h1>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-y-16 lg:max-w-none lg:grid-cols-3 lg:gap-x-8">
            <div className="col-span-1 border border-gray-200 shadow-xl dark:border-gray-700 sm:rounded-xl">
              <div className="p-8">
                <h2 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                  Balance
                </h2>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {earnings}τ
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsWithdrawDrawerOpen(true)}
                    className={clsx(
                      'rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
                      !canCashOut && 'cursor-not-allowed opacity-50'
                    )}
                    disabled={!canCashOut}
                  >
                    Cash Out
                  </button>
                </div>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  ~ ${(earnings * 655.01).toFixed(2)} USD (1τ = $655.01 USD)
                </p>
              </div>
            </div>

            <div className="col-span-2 border border-gray-200 shadow-xl dark:border-gray-700 sm:rounded-xl">
              <div className="m-8 sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <h1 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                    Transactions
                  </h1>
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
                    Recent transactions may take a few minutes to appear.
                  </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                  <button
                    type="button"
                    className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Export
                  </button>
                </div>
              </div>
              <div className="m-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-0"
                          >
                            Transaction ID
                          </th>
                          <th
                            scope="col"
                            className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                          >
                            Time
                          </th>
                          <th
                            scope="col"
                            className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                          >
                            Updated (blocks)
                          </th>
                          <th
                            scope="col"
                            className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                          >
                            Emission (τ)
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {transactions.map((transaction) => (
                          <tr key={transaction.id}>
                            <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 dark:text-gray-300 sm:pl-0">
                              {transaction.id}
                            </td>
                            <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900 dark:text-white">
                              {transaction.time}
                            </td>
                            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900 dark:text-white">
                              {transaction.updated}
                            </td>
                            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 dark:text-gray-300">
                              {transaction.emission}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Transition.Root show={isWithdrawDrawerOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsWithdrawDrawerOpen(false)}
        >
          <div className="fixed inset-0" />

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <form className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl dark:divide-gray-700 dark:border dark:border-gray-700/50 dark:bg-neutral-800">
                      <div className="h-0 flex-1 overflow-y-auto">
                        <div className="bg-indigo-700 px-4 py-6 sm:px-6">
                          <div className="flex items-center justify-between">
                            <Dialog.Title className="text-base font-semibold leading-6 text-white">
                              Withdrawal
                            </Dialog.Title>
                            <div className="ml-3 flex h-7 items-center">
                              <button
                                type="button"
                                className="relative rounded-md bg-indigo-700 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                onClick={() => setIsWithdrawDrawerOpen(false)}
                              >
                                <span className="absolute -inset-2.5" />
                                <span className="sr-only">Close panel</span>
                                <XMarkIcon
                                  className="h-6 w-6"
                                  aria-hidden="true"
                                />
                              </button>
                            </div>
                          </div>
                          <div className="mt-1">
                            <p className="text-sm text-indigo-300">
                              Select your preferred withdrawal method.
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div className="divide-y divide-gray-200 px-4 dark:divide-gray-700 sm:px-6">
                            <div className="space-y-6 pb-5 pt-6">
                              <fieldset>
                                <legend className="text-sm font-medium leading-6 text-gray-900 dark:text-white">
                                  Withdrawal method
                                </legend>
                                <div>
                                  <div className="mt-2 space-y-4">
                                    <div className="relative flex items-start">
                                      <div className="absolute flex h-6 items-center">
                                        <input
                                          id="withdrawal-bank"
                                          name="withdrawal"
                                          aria-describedby="withdrawal-bank-description"
                                          type="radio"
                                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                          defaultChecked
                                        />
                                      </div>
                                      <div className="pl-7 text-sm leading-6">
                                        <label
                                          htmlFor="withdrawal-bank"
                                          className="font-medium text-gray-900 dark:text-white"
                                        >
                                          Bank transfer
                                        </label>
                                        <p
                                          id="withdrawal-bank-description"
                                          className="text-gray-500 dark:text-gray-400"
                                        >
                                          Transfer your earnings directly to
                                          your bank account.
                                        </p>
                                      </div>
                                    </div>
                                    <div>
                                      <div className="relative flex items-start">
                                        <div className="absolute flex h-6 items-center">
                                          <input
                                            id="withdrawal-crypto"
                                            name="withdrawal"
                                            aria-describedby="withdrawal-crypto-description"
                                            type="radio"
                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                          />
                                        </div>
                                        <div className="pl-7 text-sm leading-6">
                                          <label
                                            htmlFor="withdrawal-crypto"
                                            className="font-medium text-gray-900 dark:text-white"
                                          >
                                            Crypto
                                          </label>
                                          <p
                                            id="withdrawal-crypto-description"
                                            className="text-gray-500 dark:text-gray-400"
                                          >
                                            Transfer your earnings to your
                                            crypto wallet.
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="mt-5">
                                    <div className="flex items-start justify-between rounded-md bg-gray-50 px-6 py-5 dark:bg-neutral-700">
                                      <h4 className="sr-only">Bank Account</h4>
                                      <div className="flex items-start">
                                        <BuildingLibraryIcon
                                          className="h-8 w-8 text-gray-400 dark:text-gray-500"
                                          aria-hidden="true"
                                        />
                                        <div className="ml-4 mt-0">
                                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            Bank Account
                                          </div>
                                          <div className="mt-1 flex items-center text-sm text-gray-600 dark:text-gray-300">
                                            <span>&middot;</span>
                                            <span>&middot;</span>
                                            <span className="ml-1">1111</span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="ml-6 mt-0 flex-shrink-0">
                                        <button
                                          type="button"
                                          className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                        >
                                          Edit
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </fieldset>
                            </div>
                            <div className="pb-6 pt-4">
                              <div className="flex text-sm">
                                <div className="inline-flex items-center text-gray-500 dark:text-gray-400">
                                  <InformationCircleIcon
                                    className="h-5 w-5 text-gray-400 dark:text-gray-500"
                                    aria-hidden="true"
                                  />
                                  <span className="ml-2">
                                    Direct bank transfer may take 3-5 business
                                    days.
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-shrink-0 justify-end px-4 py-4">
                        <button
                          type="button"
                          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                          onClick={() => setIsWithdrawDrawerOpen(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          onClick={(e) => {
                            e.preventDefault()
                            setIsWithdrawDrawerOpen(false)
                            handleCashOut()
                          }}
                        >
                          Confirm
                        </button>
                      </div>
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}
