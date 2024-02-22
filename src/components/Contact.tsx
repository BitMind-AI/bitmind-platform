import { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    reason: "",
    message: "",
  });
  const [messageSent, setMessageSent] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const encode = (data: any) => {
    return Object.keys(data)
      .map(
        (key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
      )
      .join("&");
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const response = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode({ "form-name": "contact", ...form }),
    });
    if (response.ok) {
      setMessageSent(true);
    } else {
      console.error("Error sending message");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (e: { target: { id: any; value: any } }) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  return (
    <div className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-24 xl:pl-12">
      <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
        We're here to help!
      </h2>
      <p className="mx-auto mt-4 max-w-3xl text-center text-xl text-gray-500">
        Please fill out the form below to get in touch with us.
      </p>
      <div className="mx-auto mt-12 max-w-lg lg:max-w-3xl">
        {messageSent ? (
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
                  Message sent
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    We'll get back to you as soon as we can. Thanks for reaching
                    out!
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-6">
            <div>
              <label htmlFor="name" className="sr-only">
                Full name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                autoComplete="name"
                className="block w-full rounded-md border-gray-300 px-4 py-3 placeholder-gray-500 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                placeholder="Full name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="block w-full rounded-md border-gray-300 px-4 py-3 placeholder-gray-500 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="reason" className="sr-only">
                Reason
              </label>
              <select
                id="reason"
                name="reason[]"
                className="block w-full rounded-md border-gray-300 px-4 py-3 placeholder-gray-500 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                placeholder="Reason"
                value={form.reason}
                onChange={handleChange}
                required
              >
                <option value="general">General enquiry</option>
                <option value="support">Support request</option>
                <option value="refund">Request a refund</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="sr-only">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="block w-full rounded-md border-gray-300 px-4 py-3 placeholder-gray-500 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                placeholder="Message"
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-emerald-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
