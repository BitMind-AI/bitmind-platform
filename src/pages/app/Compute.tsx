export default function Compute() {
  return (
    <div className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-24 xl:pl-12">
      <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
        Compute
      </h2>
      <p className="mx-auto mt-4 max-w-3xl text-center text-xl text-gray-500">
        Choose a compute option to start a new project.
      </p>
      <div className="mx-auto mt-12 max-w-lg lg:max-w-3xl">
        <ul className="mt-4 space-y-4">
          <li>
            <a href="/template" className="text-indigo-600 hover:underline">
              Compute 1
            </a>
          </li>
          <li>
            <a href="/template" className="text-indigo-600 hover:underline">
              Compute 2
            </a>
          </li>
          <li>
            <a href="/template" className="text-indigo-600 hover:underline">
              Compute 3
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
