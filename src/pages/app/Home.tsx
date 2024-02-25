export default function Home() {
  // create new project button - goes to /compute
  // mock list of existing projects - goes to /editor
  return (
    <div className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-24 xl:pl-12">
      <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
        Welcome to the BitMind Platflorm!
      </h2>
      <p className="mx-auto mt-4 max-w-3xl text-center text-xl text-gray-500">
        Create a new project or edit an existing one.
      </p>
      <div className="mx-auto mt-12 max-w-lg lg:max-w-3xl">
        <div className="flex justify-center">
          <a
            href="/compute"
            className="bg-indigo-600 border border-transparent rounded-md py-3 px-8 text-base font-medium text-white hover:bg-indigo-700"
          >
            Create New Project
          </a>
        </div>
        <div className="mt-8">
          <h3 className="text-lg font-bold tracking-tight text-gray-900">
            Existing Projects
          </h3>
          <ul className="mt-4 space-y-4">
            <li>
              <a href="/editor" className="text-indigo-600 hover:underline">
                Project 1
              </a>
            </li>
            <li>
              <a href="/editor" className="text-indigo-600 hover:underline">
                Project 2
              </a>
            </li>
            <li>
              <a href="/editor" className="text-indigo-600 hover:underline">
                Project 3
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
