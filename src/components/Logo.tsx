import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="flex flex-shrink-0 items-center space-x-4">
      <img className="h-8 w-auto" src="/icon.svg" alt="BitMind" />
      <h1 className="text-xl font-bold dark:text-white">BitMind</h1>
    </Link>
  );
}
