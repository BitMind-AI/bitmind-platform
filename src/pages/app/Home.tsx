import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "../../lib/supabase";

import { createWorkspace, fetchWorkspaces } from "../../api/workspaces";

import { ChevronRightIcon } from "@heroicons/react/20/solid";

import Loader from "../../components/Loader";
import clsx from "clsx";

const statuses = {
  stopped: "text-gray-500 bg-gray-100/10",
  running: "text-green-400 bg-green-400/10",
  error: "text-rose-400 bg-rose-400/10",
};

export default function Home() {
  const { data: workspaces, isLoading } = useQuery({
    queryKey: ["workspaces"],
    queryFn: fetchWorkspaces,
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      console.log("Creating new workspace");

      return createWorkspace({
        name: `Workspace-${Math.random().toString(36).substring(7)}`,
        // Adjust the templateId to match your own template
        templateId: "b5a30f44-2562-4817-ae00-37427658b95e",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces"],
      });
    },
  });

  const handleCreateCoderUser = async () => {
    try {
      const { error } = await supabase.functions.invoke("create-coder-user");
      if (error) throw error;
    } catch (error) {
      console.error("Error creating coder user:", error);
    }
  };

  if (isLoading) {
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
          Create a new workspace or continue with an existing one.
        </p>
        <div className="mx-auto mt-12 max-w-lg lg:max-w-3xl">
          {/* <div className="flex justify-center">
            <Link
              to="/compute"
              className="bg-indigo-600 border border-transparent rounded-md py-3 px-8 text-base font-medium text-white hover:bg-indigo-700"
            >
              Create New Workspace
            </Link>
          </div> */}

          <div className="flex justify-center">
            <button
              type="button"
              className="bg-indigo-600 border border-transparent rounded-md py-3 px-8 text-base font-medium text-white hover:bg-indigo-700"
              onClick={() => mutation.mutate()}
            >
              Create New Workspace
            </button>
          </div>

          <div className="flex justify-center mt-8">
            <button
              type="button"
              className="bg-white border border-gray-300 text-gray-700 rounded-md py-3 px-8 text-base font-medium hover:bg-gray-50"
              onClick={handleCreateCoderUser}
            >
              Create Coder User
            </button>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-lg lg:max-w-3xl">
          <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            Existing Workspaces
          </h3>

          <ul
            role="list"
            className="divide-y dark:divide-white/5 divide-gray-100"
          >
            {workspaces && workspaces.count > 0 ? (
              workspaces.workspaces.map(
                ({
                  id,
                  name,
                  template_display_name,
                  latest_build,
                  last_used_at,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                }: any) => (
                  <li
                    key={id}
                    className="relative flex items-center space-x-4 py-4"
                  >
                    <div className="min-w-0 flex-auto">
                      <div className="flex items-center gap-x-3">
                        <div
                          className={clsx(
                            statuses[
                              latest_build.status as keyof typeof statuses
                            ],
                            "flex-none rounded-full p-1"
                          )}
                        >
                          <div className="h-2 w-2 rounded-full bg-current" />
                        </div>
                        <h2 className="min-w-0 text-sm font-semibold leading-6 dark:text-white text-gray-900">
                          <Link
                            to={`/editor?edit=${id}`}
                            className="flex gap-x-2"
                          >
                            <span className="truncate">{name}</span>
                            <span className="text-gray-400">/</span>
                            <span className="whitespace-nowrap">
                              {template_display_name}
                            </span>
                            <span className="absolute inset-0" />
                          </Link>
                        </h2>
                      </div>
                      <div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-gray-400">
                        <p className="truncate">
                          {latest_build.initiator_name}
                        </p>
                        <svg
                          viewBox="0 0 2 2"
                          className="h-0.5 w-0.5 flex-none fill-gray-300"
                        >
                          <circle cx={1} cy={1} r={1} />
                        </svg>
                        <p className="whitespace-nowrap">
                          Last used{" "}
                          <time dateTime={last_used_at}>
                            {new Date(last_used_at).toLocaleDateString()}
                          </time>
                        </p>
                      </div>
                    </div>
                    <ChevronRightIcon
                      className="h-5 w-5 flex-none text-gray-400"
                      aria-hidden="true"
                    />
                  </li>
                )
              )
            ) : (
              <li className="px-4 py-5 sm:px-6">
                <p className="text-sm text-gray-500">No workspaces found.</p>
              </li>
            )}
          </ul>
        </div>
      </div>
    </main>
  );
}
