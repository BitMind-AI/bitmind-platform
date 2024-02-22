import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import clsx from "clsx";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string>();
  const [redirectUrl, setRedirectUrl] = useState<string>();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check to see if we have a redirect URL
    const redirect = searchParams.get("redirect");
    if (redirect) {
      setRedirectUrl(redirect);
    }
  }, [searchParams]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setLoginError(undefined);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: redirectUrl
            ? `${window.location.origin}${redirectUrl}`
            : `${window.location.origin}/account`,
        },
      });
      if (error) throw error;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.message) {
        setLoginError(error.message);
      }
      console.error(
        "Error logging in:",
        error.error_description || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full min-h-screen bg-gray-50">
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <div className="flex flex-col sm:mx-auto sm:w-full sm:max-w-md">
              <div className="mx-auto flex flex-shrink-0 items-center space-x-4">
                <img className="h-10 w-auto" src="/icon.svg" alt="BitMind" />
                <h1 className="text-xl font-bold text-gray-900">BitMind</h1>
              </div>
              <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Sign in to your account
              </h2>
            </div>

            <div className="mt-8">
              <button
                className={clsx(
                  "flex w-full items-center justify-center gap-3 rounded-md bg-[#24292F] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F]",
                  loading && "cursor-not-allowed opacity-50"
                )}
                onClick={handleLogin}
                disabled={loading}
              >
                <svg
                  className="h-5 w-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-semibold leading-6">
                  Continue with GitHub
                </span>
              </button>
            </div>

            <p className="mt-10 text-center text-sm text-gray-500">
              By continuing, you agree to our
              <br />
              <Link
                to="/terms"
                className="font-semibold leading-6 text-emerald-600 hover:text-emerald-500"
              >
                Terms of Service
              </Link>
              <span className="mx-1">and</span>
              <Link
                to="/privacy"
                className="font-semibold leading-6 text-emerald-600 hover:text-emerald-500"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          {loginError && (
            <p className="mt-10 text-center text-sm text-red-600">
              {loginError}
            </p>
          )}
        </div>

        <Link
          to="/"
          className="text-grey-600 mx-auto mt-10 inline-flex items-center text-center text-sm"
        >
          <ArrowLeftIcon
            className="mr-2 inline-block h-4 w-4 text-gray-600"
            aria-hidden="true"
          />
          Back to home
        </Link>
      </div>
    </div>
  );
}
