import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import useSupabase from "../../hooks/useSupabase";
import useNotifications from "../../hooks/useNotifications";

import Contact from "../../components/Contact";

import { PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/20/solid";
import Loader from "../../components/Loader";
import Dialog from "../../components/Dialog";
import DialogEmpty from "../../components/DialogEmpty";

export default function Account() {
  const [snippetsLoading, setSnippetsLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [snippets, setSnippets] = useState<any[]>([]);
  const [snippetToDelete, setSnippetToDelete] = useState<string>();
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const navigate = useNavigate();
  const { user, profile } = useSupabase();
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
          data->code`
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

  const handleDelete = async () => {
    if (!snippetToDelete) return;
    try {
      const { error } = await supabase
        .from("snippets")
        .delete()
        .eq("id", snippetToDelete);
      if (error) {
        throw error;
      }
      setSnippets((prev) =>
        prev.filter((snippet) => snippet.id !== snippetToDelete)
      );
      addMessage({
        title: "Snippet deleted",
        message: "Your snippet has been deleted.",
        type: "success",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      addMessage({
        title: "Error deleting snippet",
        message: "Please try again later.",
        type: "error",
      });
      console.error("Error deleting snippet:", error.message);
    } finally {
      setSnippetToDelete(undefined);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const { error } = await supabase.functions.invoke("close-account");
      if (error) throw error;

      await supabase.auth.signOut();
      navigate("/");
    } catch (error) {
      addMessage({
        title: "Error closing account",
        message: "Please try again later.",
        type: "error",
      });
      console.error("Error closing account:", error);
    }
  };

  if (!user || !profile) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-neutral-800">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <main className="flex h-full flex-1 flex-col bg-white dark:bg-neutral-800">
        <header className="relative isolate pt-16">
          <div
            className="absolute inset-0 -z-10 overflow-hidden"
            aria-hidden="true"
          >
            <div className="absolute left-16 top-full -mt-16 transform-gpu opacity-50 blur-3xl dark:opacity-75 xl:left-1/2 xl:-ml-80">
              <div
                className="aspect-[1154/678] w-[72.125rem] bg-gradient-to-br from-[#4F46E5] to-[#4238CA]"
                style={{
                  clipPath:
                    "polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)",
                }}
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-px bg-gray-900/5 dark:bg-white/5" />
          </div>

          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-2xl items-center justify-between gap-x-8 lg:mx-0 lg:max-w-none">
              <div className="flex items-center gap-x-6">
                <img
                  src={profile.avatar_url}
                  alt=""
                  className="h-16 w-16 flex-none rounded-full ring-1 ring-gray-900/10 dark:ring-white/10"
                />
                <h1>
                  <div className="text-sm leading-6 text-gray-500 dark:text-gray-300">
                    {profile.full_name}
                  </div>
                  <div className="mt-1 text-base font-semibold leading-6 text-gray-900 dark:text-white">
                    {profile.username}
                  </div>
                </h1>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto w-full max-w-7xl divide-y px-4 py-16 dark:divide-gray-600 sm:px-6 lg:px-8">
          {snippetsLoading ? (
            <div className="mx-auto grid max-w-2xl grid-cols-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {new Array(3).fill(null).map((_, i) => (
                <div
                  key={i}
                  className="mx-auto w-full max-w-sm rounded-md border border-gray-50 p-4 shadow dark:border-gray-600"
                >
                  <div className="flex animate-pulse flex-col">
                    <div className="flex-1 space-y-3 py-1">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 h-6 rounded bg-gray-200 dark:bg-gray-700"></div>
                      </div>
                      <div className="h-32 rounded bg-gray-200 dark:bg-gray-700"></div>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-1 h-6 rounded bg-gray-200 dark:bg-gray-700"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="h-12 rounded bg-gray-200 dark:bg-gray-700"></div>
                          <div className="h-12 rounded bg-gray-200 dark:bg-gray-700"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mx-auto grid max-w-2xl grid-cols-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {snippets.length > 0 ? (
                snippets.map(({ id, title, code }) => (
                  <div
                    key={id}
                    className="rounded-lg shadow-sm ring-1 ring-gray-900/5 dark:ring-white/20"
                  >
                    <div className="flex flex-col items-start space-y-2 p-4">
                      <h2 className="w-full truncate text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        {title}
                      </h2>
                      <div className="fade-mask h-32 w-full overflow-hidden rounded-md bg-gray-100 p-2 text-sm text-gray-900 dark:bg-gray-800 dark:text-gray-50">
                        <pre className="select-none text-xs">
                          {code.slice(0, 200)}
                          {code.length > 200 ? "..." : ""}
                        </pre>
                      </div>
                    </div>
                    <div className="-mt-px flex divide-x divide-gray-200 border-t dark:divide-gray-600 dark:border-gray-600">
                      <div className="flex w-0 flex-1">
                        <Link
                          to={`/editor/?edit=${id}`}
                          className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-neutral-700"
                        >
                          <PencilIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          Edit
                        </Link>
                      </div>
                      <div className="-ml-px flex w-0 flex-1">
                        <button
                          className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent bg-red-50 py-4 text-sm font-semibold text-red-700 hover:bg-red-200 dark:bg-red-700 dark:text-red-50 hover:dark:bg-red-600"
                          onClick={() => setSnippetToDelete(id)}
                        >
                          <TrashIcon className="h-5 w-5" aria-hidden="true" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3">
                  <div className="flex flex-col items-center justify-center gap-y-4">
                    <h2 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                      No snippets found
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      Any snippets you save will show up here.
                    </p>
                    <Link
                      to="/"
                      className="relative mt-6 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <span className="mr-2" aria-hidden="true">
                        &#x2190;
                      </span>
                      Back to home
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-8">
            <div className="mt-8 max-w-2xl">
              <h2 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                Support
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-200">
                If you have any questions or need help, please contact us.
              </p>
              <button
                type="button"
                className="relative mt-4 flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => setSupportModalOpen(true)}
              >
                Contact support
              </button>
            </div>
          </div>

          <div className="mt-8">
            <div className="mt-8 max-w-2xl">
              <h2 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                Delete account
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-200">
                Once you delete your account, there is no going back. All of
                your snippets will be permanently removed.
              </p>
              <button
                type="button"
                className="relative mt-4 flex justify-center rounded-md border border-transparent bg-red-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                onClick={() => {
                  setDeleteModalOpen(true);
                }}
              >
                Delete account
              </button>
            </div>
          </div>
        </div>
      </main>

      <Dialog
        show={!!snippetToDelete}
        onClose={() => setSnippetToDelete(undefined)}
        title="Delete snippet"
        description="Are you sure you want to delete this snippet? This action cannot be undone. Any embeds using this snippet will no longer work."
        onConfirm={handleDelete}
        confirmText="Delete snippet"
        cancelText="Cancel"
      />

      <Dialog
        show={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete account"
        description="Are you sure you want to delete your account? All of your
        snippets will be permanently removed. This action cannot be
        undone."
        onConfirm={handleDeleteAccount}
        confirmText="I'm sure, delete my account"
        cancelText="Cancel"
      />

      <DialogEmpty
        show={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
      >
        <button
          className="absolute right-0 top-0 p-4"
          onClick={() => setSupportModalOpen(false)}
        >
          <span className="sr-only">Close</span>
          <XMarkIcon className="h-6 w-6 text-neutral-500 dark:text-neutral-400" />
        </button>
        <Contact />
      </DialogEmpty>
    </>
  );
}
