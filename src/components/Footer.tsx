import { Link } from 'react-router-dom'

const navigation = {
  main: [
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Support', href: '/support' }
  ]
}

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-neutral-700">
      <div className="mx-auto flex max-w-7xl flex-col justify-between overflow-hidden px-6 py-6 sm:py-8 md:w-full md:max-w-full md:flex-row md:items-center md:py-4 lg:px-8">
        <nav
          className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12 md:mb-0"
          aria-label="Footer"
        >
          {navigation.main.map((item) => (
            <div key={item.name} className="pb-6 md:pb-0">
              {item.href.startsWith('/') ? (
                <Link
                  to={item.href}
                  className="text-sm leading-6 text-gray-600 hover:text-gray-900 dark:text-gray-50 dark:hover:text-gray-200"
                >
                  {item.name}
                </Link>
              ) : (
                <a
                  href={item.href}
                  className="text-sm leading-6 text-gray-600 hover:text-gray-900 dark:text-gray-50 dark:hover:text-gray-200"
                >
                  {item.name}
                </a>
              )}
            </div>
          ))}
        </nav>
        <p className="mt-10 text-center text-xs leading-5 text-gray-500 dark:text-gray-400 md:mt-0">
          &copy; {new Date().getFullYear()}{' '}
          <a
            className="hover:text-gray-900 dark:hover:text-gray-50"
            href="https://bitmind.ca"
            target="_blank"
          >
            BitMind
          </a>
          . All rights reserved.
        </p>
      </div>
    </footer>
  )
}
