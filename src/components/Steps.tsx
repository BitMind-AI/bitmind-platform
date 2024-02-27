import { Link } from "react-router-dom";

export default function Steps({
  steps,
}: {
  steps: {
    id: string;
    name: string;
    href: string;
    status: string;
  }[];
}) {
  return (
    <nav className="mx-auto w-full p-4 max-w-7xl" aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((step) => (
          <li key={step.name} className="md:flex-1">
            {step.status === "complete" ? (
              <Link
                to={step.href}
                className="group flex flex-col border-l-4 border-indigo-600 py-2 pl-4 hover:border-indigo-800 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
              >
                <span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-800">
                  {step.id}
                </span>
                <span className="text-sm font-medium text-black dark:text-white">
                  {step.name}
                </span>
              </Link>
            ) : step.status === "current" ? (
              <Link
                to={step.href}
                className="flex flex-col border-l-4 border-indigo-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                aria-current="step"
              >
                <span className="text-sm font-medium text-indigo-600">
                  {step.id}
                </span>
                <span className="text-sm font-medium text-black dark:text-white">
                  {step.name}
                </span>
              </Link>
            ) : (
              <a className="group flex flex-col border-l-4 border-gray-200 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-sm font-medium text-gray-500">
                  {step.id}
                </span>
                <span className="text-sm font-medium text-black dark:text-white">
                  {step.name}
                </span>
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
