import { useEffect, useState } from 'react'

import Workspace from '../../components/Workspace'
import DialogEmpty from '../../components/DialogEmpty'

import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'

export default function Editor({ theme }: { theme: string }) {
  const models = ['model_v5_1.h5', 'model_v6_1.h5']
  const subnets = [...Array(32)].map((_, i) => i + 1)

  const [submitModalOpen, setSubmitModalOpen] = useState(false)
  const [selectedModel, setSelectedModel] = useState(models[0])
  const [selectedSubnet, setSelectedSubnet] = useState(subnets[0])
  const [infoModalOpen, setInfoModalOpen] = useState(false)

  const [consoleOutput, setConsoleOutput] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // const data = new FormData(e.currentTarget)

    setSubmitModalOpen(true)
  }

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = []

    const appendLineWithDelay = (line: string, delay: number) => {
      return new Promise<void>((resolve) => {
        const timeoutId = setTimeout(() => {
          setConsoleOutput((prev) => [...prev, line])
          resolve()
        }, delay)
        timeouts.push(timeoutId)
      })
    }

    const appendLinesWithDelay = async (lines: string[], delay: number) => {
      for (let i = 0; i < lines.length; i++) {
        await appendLineWithDelay(lines[i], delay * i)
      }
    }

    if (submitModalOpen) {
      const consoleOutput = [
        'btcli subnet register --wallet.name <wallet_name> --wallet.hotkey <hotkey> --subtensor.network test --netuid ' +
          selectedSubnet,
        `Your balance is: τ1.9500000852
  The cost to register by recycle is τ0.000000000001`,
        '📡 Checking Balance...',
        `Balance:
    τ1.9500000852 -> τ1.9500000851`,
        '✅ Registered'
      ]

      const delayPerLine = 1000

      appendLinesWithDelay(consoleOutput, delayPerLine)
    } else {
      // Clear all timeouts when the modal closes
      timeouts.forEach((timeoutId) => clearTimeout(timeoutId))
      setConsoleOutput([])
    }

    // Cleanup function to clear all timeouts when the component unmounts
    return () => {
      timeouts.forEach((timeoutId) => clearTimeout(timeoutId))
    }
  }, [selectedSubnet, submitModalOpen])

  return (
    <>
      <main className="flex h-full flex-1 flex-col divide-y dark:divide-gray-500 dark:bg-[#141414]">
        <Workspace theme={theme} />

        <div className="flex flex-wrap justify-end gap-x-2 gap-y-2 border-t p-2 dark:border-gray-500">
          <form className="flex gap-x-2" onSubmit={handleSubmit}>
            <select
              id="model-option"
              name="model-option"
              className="rounded-md border-gray-300 px-2 py-1.5 pr-8 text-sm font-medium text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              {models.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
            <select
              id="subnet-option"
              name="subnet-option"
              className="rounded-md border-gray-300 px-2 py-1.5 pr-8 text-sm font-medium text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={selectedSubnet}
              onChange={(e) => setSelectedSubnet(Number(e.target.value))}
            >
              {subnets.map((i) => (
                <option key={i} value={i}>
                  Subnet {i}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Submit to Bittensor
            </button>
          </form>
          <button
            className="px-1.5 py-1"
            onClick={() => setInfoModalOpen(true)}
          >
            <QuestionMarkCircleIcon className="h-5 w-5 stroke-black dark:stroke-white" />
          </button>
        </div>
      </main>

      <DialogEmpty
        show={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
      >
        <button
          className="absolute right-0 top-0 p-4"
          onClick={() => setSubmitModalOpen(false)}
        >
          <span className="sr-only">Close</span>
          <XMarkIcon className="h-6 w-6 text-neutral-500 dark:text-neutral-400" />
        </button>
        <div className="bg-white px-4 pb-4 pt-12">
          <div className="rounded-md bg-blue-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <InformationCircleIcon
                  className="h-5 w-5 text-blue-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3 flex-1 md:flex md:justify-between">
                <p className="text-sm text-blue-700">
                  Submitting{' '}
                  <span className="font-semibold">{selectedModel}</span> to{' '}
                  <span className="font-semibold">Subnet {selectedSubnet}</span>
                  .
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <pre className="rounded-md bg-gray-50 p-4 dark:bg-gray-800">
              <code className="text-sm text-gray-900 dark:text-gray-100">
                {consoleOutput.map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </code>
            </pre>
          </div>

          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              onClick={() => setSubmitModalOpen(false)}
            >
              Done
            </button>
          </div>
        </div>
      </DialogEmpty>

      <DialogEmpty show={infoModalOpen} onClose={() => setInfoModalOpen(false)}>
        <button
          className="absolute right-0 top-0 p-4"
          onClick={() => setInfoModalOpen(false)}
        >
          <span className="sr-only">Close</span>
          <XMarkIcon className="h-6 w-6 text-neutral-500 dark:text-neutral-400" />
        </button>
        <div className="bg-white py-6 sm:py-12">
          <div className="mx-auto px-6 lg:px-8">
            <div className="pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Info about submitting to Bittensor
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Here you can submit your code to Bittensor. You can choose the
                subnet you want to submit to.
              </p>
            </div>

            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                onClick={() => setSubmitModalOpen(false)}
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      </DialogEmpty>
    </>
  )
}
