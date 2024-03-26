import {
  ArrowUpOnSquareIcon,
  BanknotesIcon,
  BoltIcon
} from '@heroicons/react/24/solid'
import { Link } from 'react-router-dom'

const features = [
  {
    name: 'Zero-config workspace',
    description:
      'Get started quickly with no configuration required. BitMind works out of the box.',
    icon: BoltIcon
  },
  {
    name: 'Deploy your models',
    description:
      'Deploy your models to incentive networks like Bittensor, and earn rewards for your work.',
    icon: ArrowUpOnSquareIcon
  },
  {
    name: 'Cash out your rewards',
    description:
      'Easily cash out your rewards to your bank account or cryptocurrency wallet.',
    icon: BanknotesIcon
  }
]

export default function Home() {
  return (
    <main className="flex h-full flex-1 flex-col bg-white dark:bg-neutral-800">
      <div className="relative isolate overflow-hidden bg-gray-100">
        <img
          className="absolute inset-0 -z-10 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1656510922456-e9018507288f?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
        />
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Welcome to BitMind
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-xl text-gray-500">
            Get started by creating a new workspace or pick up where you left
            off.
          </p>

          <div className="mx-auto mt-12 max-w-lg lg:max-w-3xl">
            <div className="flex justify-center">
              <Link
                to="/compute"
                className="rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700"
              >
                New Workspace
              </Link>
              <Link
                to="/account"
                className="ml-4 rounded-md border border-transparent bg-gray-200 px-8 py-3 text-base font-medium text-gray-800 hover:bg-gray-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
              >
                Existing Workspaces &#8599;
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Get rewarded for your work
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
            BitMind is a platform for developing and deploying machine learning
            models. You can track your model performance and deploy your models
            to incentive networks. You can also cash out your rewards to your
            bank account or cryptocurrency wallet.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="mb-6 flex h-10 w-10 items-center justify-center">
                    <feature.icon
                      className="h-10 w-10 text-indigo-600"
                      aria-hidden="true"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </main>
  )
}
