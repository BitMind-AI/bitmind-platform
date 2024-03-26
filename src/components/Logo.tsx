import { Link } from 'react-router-dom'

export default function Logo() {
  return (
    <Link to="/" className="flex flex-shrink-0 items-center">
      <img
        className="hidden h-8 w-auto dark:block"
        src="/logo.png"
        alt="Bitmind"
      />
      <img
        className="h-8 w-auto dark:hidden"
        src="/logo-dark.png"
        alt="Bitmind"
      />
    </Link>
  )
}
