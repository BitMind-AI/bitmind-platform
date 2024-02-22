import { Fragment } from "react";
import { Link } from "react-router-dom";

import { supabase } from "../lib/supabase";
import useSupabase from "../hooks/useSupabase";

import { Menu, Transition } from "@headlessui/react";

import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

import clsx from "clsx";

const userNavigation = [{ name: "Account", href: "/account" }];

export default function Header({
  theme,
  setTheme,
}: {
  theme: string;
  setTheme: (theme: string) => void;
}) {
  const { user, profile } = useSupabase();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="sticky top-0 z-10 bg-white bg-opacity-75 shadow backdrop-blur backdrop-filter dark:bg-neutral-800 dark:shadow-gray-500">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <Logo />

          <div className="flex flex-1 items-center justify-end gap-x-8">
            <ThemeToggle theme={theme} setTheme={setTheme} />

            {/* Profile dropdown */}
            <Menu as="div" className="relative">
              <div>
                <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                  <span className="sr-only">Open user menu</span>
                  {profile?.avatar_url ? (
                    <img
                      className="h-8 w-8 rounded-full"
                      src={profile.avatar_url}
                      alt=""
                    />
                  ) : (
                    <span className="inline-block h-8 w-8 overflow-hidden rounded-full bg-gray-100">
                      <svg
                        className="h-full w-full text-gray-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </span>
                  )}
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {user ? (
                    <>
                      {userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <Link
                              to={item.href}
                              className={clsx(
                                "block px-4 py-2 text-sm text-gray-700",
                                active && "bg-gray-100"
                              )}
                            >
                              {item.name}
                            </Link>
                          )}
                        </Menu.Item>
                      ))}
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={clsx(
                              "block w-full px-4 py-2 text-left text-sm text-red-700",
                              active && "bg-gray-100"
                            )}
                            onClick={handleSignOut}
                          >
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </>
                  ) : (
                    <>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/signin"
                            className={clsx(
                              "block px-4 py-2 text-sm text-gray-700",
                              active && "bg-gray-100"
                            )}
                          >
                            Sign in / Sign up
                          </Link>
                        )}
                      </Menu.Item>
                    </>
                  )}
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
}
