import { useEffect } from "react";

import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

export default function ThemeToggle({
  theme,
  setTheme,
}: {
  theme: string;
  setTheme: (theme: string) => void;
}) {
  useEffect(() => {
    // Check if the theme preference is stored in localStorage
    if (localStorage.theme) {
      setTheme(localStorage.theme);
    } else {
      // Check the user's preferred color scheme and set the theme accordingly
      const prefersDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (prefersDarkMode) {
        setTheme("dark");
      } else {
        setTheme("light");
      }
    }
  }, [setTheme]);

  const toggleTheme = () => {
    if (theme === "light") {
      localStorage.theme = "dark";
      document.documentElement.classList.add("dark");
      setTheme("dark");
    } else {
      localStorage.theme = "light";
      document.documentElement.classList.remove("dark");
      setTheme("light");
    }
  };

  return (
    <button
      type="button"
      className="rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none dark:text-white"
      onClick={toggleTheme}
    >
      <SunIcon className="hidden h-6 w-6 dark:block" />
      <MoonIcon className="block h-6 w-6 dark:hidden" />
    </button>
  );
}
