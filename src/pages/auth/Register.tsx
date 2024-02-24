import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

import Logo from "../../components/Logo";
import {
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/20/solid";
import clsx from "clsx";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerError, setRegisterError] = useState<string>();
  const [confirmationEmailSent, setConfirmationEmailSent] = useState(false);

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
                  Create a new account
                </h2>
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
