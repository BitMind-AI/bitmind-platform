import { useEffect, useState } from 'react'

import { ChevronRightIcon } from '@heroicons/react/20/solid'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

const stats = [
  {
    netUid: 1,
    position: 10,
    uid: 891,
    dailyRewards: '4.149τ',
    updated: 21,
    axon: '207.188xx.xx'
  },
  {
    netUid: 4,
    position: 10,
    uid: 11,
    dailyRewards: '5.515τ',
    updated: 197,
    axon: '160.202xx.xx'
  }
]

export default function Performance() {
  const [chartData, setChartData] = useState<
    { time: string; rewards: number }[]
  >([])

  // Function to generate fake data with the specified conditions
  const generateFakeData = () => {
    const data: { time: string; rewards: number }[] = []
    for (let i = 0; i <= 60; i++) {
      if (i < 30) {
        // Slowly climbing data for the first 30 seconds
        data.push({ time: `${i}s`, rewards: i * 0.5 })
      } else if (i === 30) {
        // Large spike at 30s
        data.push({ time: `${i}s`, rewards: 40 })
      } else {
        // Flattening back out after the spike
        data.push({ time: `${i}s`, rewards: 40 })
      }
    }
    return data
  }

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index <= 60) {
        const newData = generateFakeData().slice(0, index + 1)
        setChartData(newData)
        index++
      } else {
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <main className="flex h-full flex-1 flex-col bg-white dark:bg-neutral-800">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32">
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
              Model performance
            </h1>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-y-16 lg:max-w-none lg:grid-cols-5 lg:gap-x-8">
          <div className="col-span-2 border border-gray-200 shadow-xl dark:border-gray-700 sm:rounded-xl">
            <div className="p-8">
              <div className="relative flex items-center space-x-4 rounded-xl border border-gray-300 px-4 py-4 shadow">
                <div className="min-w-0 flex-auto">
                  <div className="flex items-center gap-x-3">
                    <div className="flex-none rounded-full bg-green-400/10 p-1 text-green-400">
                      <div className="h-2 w-2 rounded-full bg-current" />
                    </div>
                    <h2 className="min-w-0 text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                      <a href="#" className="flex gap-x-2">
                        <span className="truncate">Taoshi</span>
                        <span className="text-gray-400">/</span>
                        <span className="whitespace-nowrap">model_v5</span>
                        <span className="absolute inset-0" />
                      </a>
                    </h2>
                  </div>
                  <div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-gray-500 dark:text-gray-400">
                    <p className="truncate">model_v5_1.h5</p>
                    <svg
                      viewBox="0 0 2 2"
                      className="h-0.5 w-0.5 flex-none fill-gray-300"
                    >
                      <circle cx={1} cy={1} r={1} />
                    </svg>
                    <p className="whitespace-nowrap">2 days ago</p>
                  </div>
                </div>
                <div className="flex-none rounded-full bg-indigo-400/10 px-2 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-400/30">
                  Bittensor
                </div>
                <ChevronRightIcon
                  className="h-5 w-5 flex-none text-gray-400"
                  aria-hidden="true"
                />
              </div>

              <div className="mx-1 mt-8">
                <span className="flex items-center overflow-hidden text-xs font-semibold text-gray-500 dark:text-gray-400">
                  Hotkey:{' '}
                  <code className="ml-1 truncate rounded-md bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-900 dark:bg-gray-800 dark:text-white">
                    5D7thQ8XUCLMm58BxF75PTvMsyGbLC93T61RACqTmKLt49A7
                  </code>
                </span>
              </div>

              <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr className="divide-x divide-gray-200">
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-0"
                          >
                            NetUID
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                          >
                            Position
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                          >
                            UID
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                          >
                            Daily Rewards
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                          >
                            Updated
                          </th>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pr-0"
                          >
                            Axon
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {stats.map((stat) => (
                          <tr
                            key={stat.uid}
                            className="divide-x divide-gray-200"
                          >
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 dark:text-white sm:pl-0">
                              {stat.netUid}
                            </td>
                            <td className="whitespace-nowrap p-4 text-sm text-gray-500 dark:text-gray-300">
                              {stat.position}
                            </td>
                            <td className="whitespace-nowrap p-4 text-sm text-gray-500 dark:text-gray-300">
                              {stat.uid}
                            </td>
                            <td className="whitespace-nowrap p-4 text-sm text-gray-500 dark:text-gray-300">
                              {stat.dailyRewards}
                            </td>
                            <td className="whitespace-nowrap p-4 text-sm text-gray-500 dark:text-gray-300">
                              {stat.updated}
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 dark:text-gray-300 sm:pr-0">
                              {stat.axon}
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

          <div className="col-span-3 border border-gray-200 shadow-xl dark:border-gray-700 sm:rounded-xl">
            <ResponsiveContainer width="100%" height={600}>
              <LineChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 20,
                  left: 20,
                  bottom: 40
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  label={{
                    value: 'Time (s)',
                    position: 'insideBottom',
                    offset: -10
                  }}
                />
                <YAxis
                  label={{
                    value: 'Rewards (Emissions)',
                    angle: -90,
                    position: 'insideLeft'
                  }}
                />
                <Tooltip />
                <Legend
                  verticalAlign="top"
                  height={36}
                  content={
                    <div className="flex items-center justify-center">
                      <div className="flex items-center gap-x-4">
                        <div className="flex items-center gap-x-2">
                          <div className="h-3 w-3 rounded-full bg-blue-500" />
                          <span className="text-xs font-semibold text-gray-900 dark:text-white">
                            Rewards
                          </span>
                        </div>
                      </div>
                    </div>
                  }
                />
                <Line type="monotone" dataKey="rewards" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </main>
  )
}
