import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link
            href="/"
            className="text-base font-semibold text-zinc-900 dark:text-zinc-50"
          >
            Heartbeat
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 pt-24 pb-20 sm:pt-32 sm:pb-28">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            All systems operational
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
            Monitor your endpoints.
            <br />
            <span className="text-zinc-400 dark:text-zinc-500">
              Get alerted instantly.
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Know when your services go down before your users do. Heartbeat
            monitors your HTTP endpoints around the clock and sends you instant
            alerts the moment something breaks.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Start Monitoring
            </Link>
            <Link
              href="/sign-in"
              className="rounded-md border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="mx-auto max-w-5xl px-4 pb-20">
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
          {/* Mock header bar */}
          <div className="flex items-center gap-2 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <div className="h-3 w-3 rounded-full bg-emerald-400" />
            <span className="ml-3 text-xs text-zinc-400">
              heartbeat dashboard
            </span>
          </div>
          {/* Mock table */}
          <div className="p-1">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-zinc-500 dark:text-zinc-400">
                  <th className="px-4 py-2.5 font-medium">Endpoint</th>
                  <th className="px-4 py-2.5 font-medium">URL</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5 text-right font-medium">
                    Response
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                <tr>
                  <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">
                    Production API
                  </td>
                  <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">
                    api.example.com
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      UP
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-zinc-500 dark:text-zinc-400">
                    124ms
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">
                    Marketing Site
                  </td>
                  <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">
                    www.example.com
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      UP
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-zinc-500 dark:text-zinc-400">
                    89ms
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">
                    Payment Service
                  </td>
                  <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">
                    pay.example.com
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-950 dark:text-red-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      DOWN
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-zinc-500 dark:text-zinc-400">
                    —
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">
                    Auth Server
                  </td>
                  <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">
                    auth.example.com
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      UP
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-zinc-500 dark:text-zinc-400">
                    203ms
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-zinc-200 bg-white py-20 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
              Everything you need to stay online
            </h2>
            <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400">
              Simple, reliable monitoring without the complexity.
            </p>
          </div>
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <svg
                  className="h-5 w-5 text-zinc-600 dark:text-zinc-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 17.25v-.228a4.5 4.5 0 0 0-.12-1.03l-2.268-9.64a3.375 3.375 0 0 0-3.285-2.602H7.923a3.375 3.375 0 0 0-3.285 2.602l-2.268 9.64a4.5 4.5 0 0 0-.12 1.03v.228m19.5 0a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3m19.5 0a3 3 0 0 0-3-3H5.25a3 3 0 0 0-3 3m16.5 0h.008v.008h-.008v-.008Zm-3 0h.008v.008h-.008v-.008Z"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Uptime Monitoring
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Monitor any HTTP endpoint with configurable check intervals.
                Support for GET, POST, and HEAD requests.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <svg
                  className="h-5 w-5 text-zinc-600 dark:text-zinc-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Instant Alerts
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Get notified via email the moment an endpoint goes down.
                Recovery alerts when services come back online.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <svg
                  className="h-5 w-5 text-zinc-600 dark:text-zinc-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Incident Tracking
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Automatic incident creation when downtime is detected. Track
                duration, resolution time, and uptime history.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-zinc-200 py-20 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
              Up and running in minutes
            </h2>
            <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400">
              Three simple steps to never miss downtime again.
            </p>
          </div>
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-bold text-white dark:bg-zinc-50 dark:text-zinc-900">
                1
              </div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Add your endpoints
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Enter the URLs you want to monitor and configure check
                intervals.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-bold text-white dark:bg-zinc-50 dark:text-zinc-900">
                2
              </div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                We monitor 24/7
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Heartbeat checks your endpoints around the clock and tracks
                response times.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-bold text-white dark:bg-zinc-50 dark:text-zinc-900">
                3
              </div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Get alerted
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Receive instant email notifications when something goes down and
                when it recovers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-200 bg-white py-20 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
            Start monitoring in seconds
          </h2>
          <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400">
            Free to get started. No credit card required.
          </p>
          <div className="mt-8">
            <Link
              href="/sign-up"
              className="inline-block rounded-md bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Create your account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            Heartbeat
          </span>
          <div className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Sign up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
