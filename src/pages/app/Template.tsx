import { Link, useSearchParams } from "react-router-dom";

import { templateOptions } from "../../fixtures/template";

import Steps from "../../components/Steps";

const steps = [
  { id: "Step 1", name: "Compute", href: "/compute", status: "complete" },
  { id: "Step 2", name: "Template", href: "/template", status: "current" },
  { id: "Step 3", name: "Preview", href: "#", status: "upcoming" },
];

export default function Compute() {
  const [searchParams] = useSearchParams();

  const computeId = searchParams.get("computeId");

  return (
    <main className="flex h-full flex-1 bg-white dark:bg-neutral-800 flex-col">
      <Steps steps={steps} />

      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 w-full">
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight dark:text-white">
              Template
            </h2>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-7xl">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                Pre-made Compute Templates
              </h1>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
                Choose a Compute Template to deploy and get started building.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-8">
            {templateOptions.map(
              ({ id, icon, name, description, recommended }) => (
                <div
                  key={id}
                  className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                >
                  <div className="flex-shrink-0">
                    {icon ? (
                      <img
                        className="h-10 w-10 rounded-full border border-gray-100 p-1 object-contain"
                        src={icon}
                        alt=""
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full border border-gray-100 bg-gray-100 flex items-center justify-center">
                        <span className="text-lg font-semibold leading-none text-gray-800">
                          {name.charAt(0).toLocaleUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/preview?computeId=${computeId}&templateId=${id}`}
                      className="focus:outline-none"
                    >
                      <span className="absolute inset-0" aria-hidden="true" />
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {name}
                        </p>
                        {recommended ? (
                          <div className="flex items-center justify-center px-2 py-1 text-xs font-medium leading-none text-indigo-800 bg-indigo-100 rounded-full">
                            Recommended
                          </div>
                        ) : null}
                      </div>
                      <p className="text-sm text-gray-500">{description}</p>
                    </Link>
                  </div>
                </div>
              )
            )}
          </div>

          <p className="mt-8 text-sm text-gray-700 dark:text-gray-400">
            Don't see the template you're looking for?{" "}
            <Link
              to={`/preview?computeId=${computeId}`}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Continue with a blank template
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
