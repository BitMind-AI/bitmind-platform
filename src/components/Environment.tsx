import { useState } from 'react'

import DialogEmpty from './DialogEmpty'
import { XMarkIcon } from '@heroicons/react/20/solid'

function Environment() {
  const [submitModalOpen, setSubmitModalOpen] = useState(false)

  return (
    <>
      <main className="flex h-full flex-1 flex-col dark:bg-[#141414]">
        <h1>Environment</h1>
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
