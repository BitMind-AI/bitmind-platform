import { useState } from 'react'

import DialogEmpty from './DialogEmpty'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'

function Environment({ theme }: { theme: string }) {
  const [submitModalOpen, setSubmitModalOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    console.log('Submitting...', data)
  }

  return (
    <>
      <main className="flex h-full flex-1 flex-col divide-y dark:divide-gray-500 dark:bg-[#141414]">
        <iframe
          className="h-full flex-1"
          src={`https://bitmind-ai.github.io/jupyterlite/lab/index.html?theme=${theme === 'dark' ? 'JupyterLab Dark' : 'JupyterLab Light'}`}
          width="100%"
          height="100%"
        />

        <div className="flex flex-wrap justify-end gap-x-2 gap-y-2 border-t p-2 dark:border-gray-500">
          <form className="flex gap-x-2" onSubmit={handleSubmit}>
            <select
              id="model-option"
              name="model-option"
              className="rounded-md border-gray-300 px-2 py-1.5 pr-8 text-sm font-medium text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="1">miner.py</option>
              <option value="2">validator.py</option>
            </select>
            <select
              id="subnet-option"
              name="subnet-option"
              className="rounded-md border-gray-300 px-2 py-1.5 pr-8 text-sm font-medium text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {[...Array(32)].map((_, i) => (
                <option key={i} value={i + 1}>
                  Subnet {i + 1}
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
            onClick={() => setSubmitModalOpen(true)}
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

export default Environment
