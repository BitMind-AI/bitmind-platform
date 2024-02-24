import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabase";

import Logo from "../../components/Logo";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

export default function ForgotPassword() {
  const { state } = useLocation();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(state?.email ?? "");
  const [resetError, setResetError] = useState<string>();
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handleForgotPassword = async () => {
    try {
      setLoading(true);
      setResetError(undefined);
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      if (data) {
        setResetEmailSent(true);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.message) {
        setResetError(error.message);
      }
      console.error(
        "Error resetting password:",
        error.error_description || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {!resetEmailSent ? (
          <>
            <div>
              <div className="flex justify-center">
                <Logo />
              </div>
              <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                Reset Password
              </h2>
            </div>
            <form
              className="mt-8 space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                handleForgotPassword();
              }}
            >
              <input type="hidden" name="remember" defaultValue="true" />
              <div className="-space-y-px rounded-md shadow-sm">
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Email address"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className={clsx(
                    "group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white",
                    loading
                      ? "opacity-50"
                      : "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  )}
                  disabled={loading}
                >
                  Reset password
                </button>
              </div>

              {resetError && (
                <p className="mt-2 text-sm text-red-600" id="email-error">
                  {resetError}
                </p>
              )}
            </form>
          </>
        ) : (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircleIcon
                  className="h-5 w-5 text-green-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Password reset email sent
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    If an account with this email exists, we will send you an
                    email with a link to reset your password.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <p className="mt-2 text-center text-sm text-gray-600">
          <Link
            to="/signin"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Go back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
