import { Link } from "react-router-dom";

import { computeOptions } from "../../fixtures/compute";

import Steps from "../../components/Steps";
import clsx from "clsx";

const steps = [
  { id: "Step 1", name: "Compute", href: "/compute", status: "current" },
  { id: "Step 2", name: "Template", href: "#", status: "upcoming" },
  { id: "Step 3", name: "Preview", href: "#", status: "upcoming" },
];

export default function Compute() {
  return (
    <main className="flex h-full flex-1 bg-white dark:bg-neutral-800 flex-col">
      <Steps steps={steps} />

      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 w-full">
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight dark:text-white">
              Compute
            </h2>
          </div>
          <div className="mt-4 flex md:ml-4 md:mt-0">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add Custom Server
            </button>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-7xl">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                Servers
              </h1>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
                Choose a server to run your code on.
              </p>
            </div>
          </div>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Charge
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Provider
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Geography
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                        >
                          <span className="sr-only">Select</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {computeOptions.map(
                        ({ id, name, status, charge, provider, geography }) => (
                          <tr key={id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {name}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {charge}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {provider}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {geography}
                            </td>
                            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                              <span
                                className={clsx(
                                  "inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium ring-1 ring-inset",
                                  status === "Available"
                                    ? "bg-green-50 text-green-700 ring-green-600/20"
                                    : "bg-red-50 text-red-700 ring-red-600/20"
                                )}
                              >
                                {status}
                              </span>
                            </td>
                            <td className="relative py-3.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <Link
                                to={`/template?computeId=${id}`}
                                className={clsx(
                                  "inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
                                  status !== "Available" &&
                                    "cursor-not-allowed opacity-30 hover:bg-white"
                                )}
                              >
                                Select<span className="sr-only">, {name}</span>
                              </Link>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
