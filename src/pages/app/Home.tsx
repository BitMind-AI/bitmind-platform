import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import useSupabase from "../../hooks/useSupabase";
import useNotifications from "../../hooks/useNotifications";

import { ChevronRightIcon } from "@heroicons/react/20/solid";

import Loader from "../../components/Loader";
import { Link } from "react-router-dom";

export default function Home() {
  const [snippetsLoading, setSnippetsLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [snippets, setSnippets] = useState<any[]>([]);

  const { user } = useSupabase();
  const { addMessage } = useNotifications();

  useEffect(() => {
    if (user) {
      getSnippets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const getSnippets = async () => {
    if (!user || snippetsLoading) return;
    try {
      setSnippetsLoading(true);
      const { data, error, status } = await supabase
        .from("snippets")
        .select(
          `id,
          title,
          data->code,
          updated_at`
        )
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });
      if (error && status !== 406) {
        throw error;
      }
      if (data) {
        setSnippets(data);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      addMessage({
        title: "Error getting snippets",
        message: "Please try again later.",
        type: "error",
      });
      console.error("Error getting snippets:", error.message);
    } finally {
      setSnippetsLoading(false);
    }
  };

  if (!user || snippetsLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-neutral-800">
        <Loader />
      </div>
    );
  }

  return (
    <main className="flex h-full flex-1 bg-white dark:bg-neutral-800">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl text-gray-900 dark:text-white">
          Welcome to the BitMind Platform!
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-xl text-gray-500 dark:text-gray-400">
          Create a new project or continue with an existing one.
        </p>
        <div className="mx-auto mt-12 max-w-lg lg:max-w-3xl">
          <div className="flex justify-center">
            <Link
              to="/compute"
              className="bg-indigo-600 border border-transparent rounded-md py-3 px-8 text-base font-medium text-white hover:bg-indigo-700"
            >
              Create New Project
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-lg lg:max-w-3xl">
          <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            Existing Projects
          </h3>
          <ul
            role="list"
            className="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl mt-8"
          >
            {snippets.length > 0 ? (
              snippets.map(({ id, title, updated_at }) => (
                <Link
                  to={`/editor?edit=${id}`}
                  key={id}
                  className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6"
                >
                  <div className="flex min-w-0 gap-x-4">
                    <div className="min-w-0 flex-auto">
                      <p className="text-sm font-semibold leading-6 text-gray-900">
                        {title}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-x-4">
                    <div className="hidden sm:flex sm:flex-col sm:items-end">
                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        Last updated{" "}
                        <time dateTime={updated_at}>
                          {new Date(updated_at).toLocaleDateString()}
                        </time>
                      </p>
                    </div>
                    <ChevronRightIcon
                      className="h-5 w-5 flex-none text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              ))
            ) : (
              <li className="px-4 py-5 sm:px-6">
                <p className="text-sm text-gray-500">No projects found.</p>
              </li>
            )}
          </ul>
        </div>
      </div>
    </main>
  );
}
