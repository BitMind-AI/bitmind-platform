import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import useNotifications from "../../hooks/useNotifications";

import { useSearchParams } from "react-router-dom";
import Loader from "../../components/Loader";
import Environment from "../../components/Environment";
import { Snippet } from "../../App";

export default function Editor({ theme }: { theme: string }) {
  const [snippetLoading, setSnippetLoading] = useState(false);
  const [editSnippet, setEditSnippet] = useState<Snippet>();

  const { addMessage } = useNotifications();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check to see if editing a snippet
    const edit = searchParams.get("edit");
    if (edit) {
      (async () => {
        try {
          setSnippetLoading(true);
          const { data, error, status } = await supabase
            .from("snippets")
            .select(
              `id,
              title,
              data->code,
              data->packages,
              user_id`
            )
            .eq("id", edit)
            .single();
          if (error && status !== 406) {
            throw error;
          }
          if (data) {
            setEditSnippet(data as Snippet);
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          addMessage({
            title: "Error loading snippet",
            message: "Please try again later",
            type: "error",
          });
          console.error("Error loading snippet:", error.message);
        } finally {
          setSnippetLoading(false);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  if (snippetLoading) {
    return (
      <div className="flex h-full flex-1 flex-col justify-center bg-white dark:bg-neutral-800">
        <Loader />
      </div>
    );
  }

  return <Environment theme={theme} snippet={editSnippet} />;
}
