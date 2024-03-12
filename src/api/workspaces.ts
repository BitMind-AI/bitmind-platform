// import axios from "../utils/axios";

import { supabase } from "../lib/supabase";

const { VITE_CODER_API_KEY: CODER_API_KEY } = import.meta.env;

export const fetchWorkspaces = async () => {
  try {
    // const res = await axios.get(`${CODER_SERVER_API}/workspaces?owner=me`);
    // return res.data;

    const { data, error } = await supabase.functions.invoke("workspaces", {
      headers: {
        "Coder-Session-Token": CODER_API_KEY,
      },
    });
    if (error) throw new Error("Failed to fetch workspaces");
    return data;
  } catch (error) {
    console.error("Error fetching workspaces", error);
    throw new Error("Failed to fetch workspaces");
  }
};
