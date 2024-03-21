import { useState } from 'react'
import useNotifications from '../../hooks/useNotifications'

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

  const { addMessage } = useNotifications()

  const handleCashOut = () => {
    setEarnings(0)
    addMessage({
      title: 'Success',
      message: 'You have successfully cashed out your earnings!',
      type: 'success'
    })
  }

  return (
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
                  onClick={handleCashOut}
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Cash Out
                </button>
              </div>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                ~ $83.84 USD (1τ = $655.01 USD)
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
  )
}
