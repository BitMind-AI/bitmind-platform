import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import useSupabase from "../hooks/useSupabase";
import useNotifications from "../hooks/useNotifications";

import Editor from "./Editor";
import { Snippet } from "../App";

import clsx from "clsx";
import DialogEmpty from "./DialogEmpty";
import { PlayIcon, StopIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { DocumentArrowDownIcon } from "@heroicons/react/24/solid";

const startCode = `# Welcome to BitMind Platform!`;

function Environment({ theme, snippet }: { theme: string; snippet?: Snippet }) {
  const savedInput = localStorage.getItem("input");

  const [input, setInput] = useState(snippet?.code || savedInput || startCode);

  const { user } = useSupabase();

  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [snippetName, setSnippetName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const isRunning = false;
  const isLoading = false;

  const { addMessage } = useNotifications();
  const navigate = useNavigate();

  const workspaceRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files[0];
    const validTypes = ["text/x-python", "text/x-python-script"];
    if (file && validTypes.includes(file.type)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target?.result;
        if (typeof fileContent === "string") {
          setInput(fileContent);
        }
      };
      reader.readAsText(file);
    } else {
      addMessage({
        title: "Invalid file type",
        message: "Please upload a Python file",
        type: "error",
      });
    }
  };

  useEffect(() => {
    const workspace = workspaceRef.current;
    if (workspace) {
      workspace.addEventListener("dragover", handleDragOver);
      workspace.addEventListener("dragleave", handleDragLeave);
      workspace.addEventListener("drop", handleDrop);
    }
    return () => {
      if (workspace) {
        workspace.removeEventListener("dragover", handleDragOver);
        workspace.removeEventListener("dragleave", handleDragLeave);
        workspace.removeEventListener("drop", handleDrop);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceRef]);

  useEffect(() => {
    setSnippetName(
      snippet
        ? snippet.user_id === user?.id
          ? snippet.title
          : snippet.title + " - Copy"
        : ""
    );
  }, [snippet, user]);

  useEffect(() => {
    if (input) {
      localStorage.setItem("input", input);
    }
  }, [input]);

  function run() {
    console.log("Running code...");
  }

  function stop() {
    console.log("Stopping code...");
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    console.log("Submitting...", data);
  };

  const handleSave = async () => {
    if (isSaving) return;
    try {
      setIsSaving(true);
      if (!user) {
        throw new Error("No user");
      }
      if (snippet?.user_id === user?.id) {
        const { error, status } = await supabase
          .from("snippets")
          .update({
            title: snippetName,
            data: {
              code: input,
            },
          })
          .eq("id", snippet.id);
        if (error && status !== 406) {
          throw error;
        }
      } else {
        const { data, error, status } = await supabase
          .from("snippets")
          .insert([
            {
              user_id: user?.id,
              title: snippetName,
              data: {
                code: input,
              },
            },
          ])
          .select(`id`)
          .single();
        if (error && status !== 406) {
          throw error;
        }
        if (data) {
          navigate(`/?edit=${data.id}`);
        }
      }
      addMessage({
        title: "Snippet saved",
        message: "Your snippet has been saved successfully",
        type: "success",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      addMessage({
        title: "Error saving snippet",
        message: error.message || "Please try again later",
        type: "error",
      });
      console.error("Error saving snippet:", error.message);
    } finally {
      setSaveModalOpen(false);
      setIsSaving(false);
    }
  };

  return (
    <>
      <main ref={workspaceRef} className="flex h-full flex-1 dark:bg-[#141414]">
        <div className="flex flex-col w-full">
          <div className="flex flex-wrap justify-between gap-x-2 gap-y-2 border-b p-2 dark:border-gray-500">
            <div className="flex gap-x-2">
              <button
                className="rounded-md bg-red-50 px-2.5 py-1.5 text-sm font-semibold text-red-700 shadow-sm ring-1 ring-inset ring-gray-300 ring-red-600/20 hover:bg-red-100"
                onClick={() => {
                  setInput(snippet?.code || startCode);
                }}
              >
                Reset
              </button>
            </div>
            <div className="flex gap-x-2">
              <button
                className="rounded-md bg-emerald-50 px-2.5 py-1.5 text-sm font-semibold text-emerald-700 shadow-sm ring-1 ring-inset ring-emerald-600/20 hover:bg-emerald-100"
                onClick={() => {
                  if (!snippetName) {
                    setSnippetName("Untitled");
                  }
                  setSaveModalOpen(true);
                }}
              >
                Save
              </button>
              {!isRunning ? (
                <button
                  className={clsx(
                    "inline-flex items-center gap-x-1.5 rounded-md bg-emerald-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600",
                    isLoading && "cursor-not-allowed opacity-50"
                  )}
                  onClick={run}
                  disabled={isLoading}
                >
                  <PlayIcon className="-ml-0.5 h-4 w-4" aria-hidden="true" />
                  Run
                </button>
              ) : (
                <button
                  className="inline-flex items-center gap-x-1.5 rounded-md bg-emerald-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                  onClick={stop}
                >
                  <StopIcon className="h-4 w-4" />
                  Stop
                </button>
              )}
            </div>
          </div>

          <Editor
            theme={theme}
            input={input}
            onChange={(value) => setInput(value)}
          />

          <div className="flex flex-wrap justify-end gap-x-2 gap-y-2 border-t p-2 dark:border-gray-500">
            <form className="flex gap-x-2" onSubmit={handleSubmit}>
              <select
                id="submit-option"
                name="submit-option"
                className="rounded-md border-gray-300 px-2 py-1.5 pr-8 text-sm font-medium text-gray-900 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              >
                <option value="1">Subnet 1</option>
                <option value="2">Subnet 2</option>
                <option value="3">Subnet 3</option>
              </select>
              <button
                className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
                onClick={run}
              >
                Submit to Bittensor
              </button>
            </form>
          </div>
        </div>

        {isDragging && (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-white bg-opacity-10 backdrop-blur-sm backdrop-filter">
            <div className="rounded-md bg-emerald-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <DocumentArrowDownIcon
                    className="h-5 w-5 text-emerald-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-emerald-800">
                    Drop file to upload
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <DialogEmpty show={saveModalOpen} onClose={() => setSaveModalOpen(false)}>
        <button
          className="absolute right-0 top-0 p-4"
          onClick={() => setSaveModalOpen(false)}
        >
          <span className="sr-only">Close</span>
          <XMarkIcon className="h-6 w-6 text-neutral-500 dark:text-neutral-400" />
        </button>
        <div className="bg-white py-6 sm:py-12">
          <div className="mx-auto px-6 lg:px-8">
            <div className="pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Save snippet
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Give your snippet a name and save it to your account.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-full">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                      value={snippetName}
                      onChange={(e) => setSnippetName(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className={clsx(
                  "inline-flex w-full justify-center rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 sm:ml-3 sm:w-auto",
                  (!snippetName || isSaving) && "cursor-not-allowed opacity-50"
                )}
                onClick={handleSave}
                disabled={!snippetName || isSaving}
              >
                Save
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                onClick={() => setSaveModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </DialogEmpty>
    </>
  );
}

export default Environment;
