import { corsHeaders } from "../_shared/cors.ts";

import { createClient } from "@supabase/supabase-js";

import { decode } from "https://deno.land/x/djwt@v2.8/mod.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get("SUPABASE_URL") ?? "",
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      // {
      //   global: {
      //     headers: { Authorization: req.headers.get("authorization")! },
      //   },
      // }
    );

    const token = req.headers.get("authorization")!.replace("Bearer ", "");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_header, payload, _signature] =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      decode(token) as any;
    const { sub: userId } = payload;

    if (!userId) throw new Error("No user id!");

    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) throw error;

    const data = {
      message: `User deleted`,
    };

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return new Response(JSON.stringify({ message: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
