import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Link, useSearchParams } from "react-router-dom";

import Logo from "../../components/Logo";
import {
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/20/solid";
import clsx from "clsx";

export default function Register() {
  const [redirectUrl, setRedirectUrl] = useState<string>();
  const [registerError, setRegisterError] = useState<string>();

  const [loading, setLoading] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationEmailSent, setConfirmationEmailSent] = useState(false);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check to see if we have a redirect URL
    const redirect = searchParams.get("redirect");
    if (redirect) {
      setRedirectUrl(redirect);
    }
  }, [searchParams]);

  const handleRegister = async () => {
    try {
      setLoading(true);
      setRegisterError(undefined);

      if (name.length < 3)
        throw new Error("Account name should be at least 3 characters");

      if (password.length < 6)
        throw new Error("Password should be at least 6 characters");

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/plan`,
          data: {
            name,
            account_type: "business",
          },
        },
      });
      if (error) throw error;
      setConfirmationEmailSent(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.message) {
        setRegisterError(error.message);
      }
      console.error(
        "Error registering account:",
        error.error_description || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const signInWithOAuth = async (provider: "github" | "google") => {
    try {
      setRegisterError(undefined);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl
            ? `${window.location.origin}${redirectUrl}`
            : `${window.location.origin}`,
        },
      });
      if (error) throw error;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.message) {
        setRegisterError(error.message);
      }
      console.error(
        "Error logging in:",
        error.error_description || error.message
      );
    }
  };

  return (
    <>
      <div className="flex min-h-full items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {!confirmationEmailSent ? (
            <>
              <div>
                <div className="flex justify-center">
                  <Logo />
                </div>
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                  Get started
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                  Create a new account
                </p>
              </div>

              <div className="mt-10">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => signInWithOAuth("google")}
                    className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
                  >
                    <svg
                      className="h-5 w-5"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                        fill="#EA4335"
                      />
                      <path
                        d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                        fill="#34A853"
                      />
                    </svg>
                    <span className="text-sm font-semibold leading-6">
                      Google
                    </span>
                  </button>

                  <button
                    onClick={() => signInWithOAuth("github")}
                    className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
                  >
                    <svg
                      className="h-5 w-5 fill-[#24292F]"
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
                      GitHub
                    </span>
                  </button>
                </div>

                <div className="mt-10">
                  <div className="relative">
                    <div
                      className="absolute inset-0 flex items-center"
                      aria-hidden="true"
                    >
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm font-medium leading-6">
                      <span className="bg-white px-6 text-gray-900">
                        Or continue with
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRegister();
                }}
              >
                <div className="space-y-12">
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="col-span-full">
                      <label
                        htmlFor="account-name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Account name
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="account-name"
                          id="account-name"
                          className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          onChange={(e) => setName(e.target.value)}
                          value={name}
                        />
                      </div>
                      <p className="mt-3 text-sm leading-6 text-gray-600">
                        Either your business name or your own name.
                      </p>
                    </div>

                    <div className="col-span-full">
                      <label
                        htmlFor="email-address"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Email address
                      </label>
                      <div className="mt-2">
                        <input
                          type="email"
                          name="email-address"
                          id="email-address"
                          className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          onChange={(e) => setEmail(e.target.value)}
                          value={email}
                        />
                      </div>
                      <p className="mt-3 text-sm leading-6 text-gray-600">
                        We'll use this for billing and important notifications.
                      </p>
                    </div>

                    <div className="col-span-full">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Password
                      </label>
                      <div className="mt-2">
                        <div className="relative">
                          <input
                            id="new-password"
                            name="password"
                            type={hidePassword ? "password" : "text"}
                            autoComplete="new-password"
                            required
                            className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 z-10 flex items-center pl-3 pr-3"
                            onClick={() => setHidePassword(!hidePassword)}
                          >
                            {hidePassword ? (
                              <EyeSlashIcon
                                className="h-5 w-5 cursor-pointer text-gray-500"
                                aria-hidden="true"
                              />
                            ) : (
                              <EyeIcon
                                className="h-5 w-5 cursor-pointer text-gray-500"
                                aria-hidden="true"
                              />
                            )}
                          </button>
                        </div>
                      </div>
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
                      Create account
                    </button>
                  </div>

                  {registerError && (
                    <p className="mt-2 text-sm text-red-600" id="email-error">
                      {registerError}
                    </p>
                  )}
                </div>
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
                    Confirmation email sent
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>
                      Before you can start using your account, you need to
                      verify your email address by clicking on the verification
                      link we just sent to you.
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
    </>
  );
}
