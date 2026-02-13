import Link from "next/link";
import {
  Activity,
  Server,
  Bell,
  BarChart3,
  ArrowRight,
  Check,
  Zap,
  Shield,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  FadeIn,
  FadeInView,
  FadeInStagger,
  FadeInStaggerItem,
  ScaleIn,
} from "@/components/motion";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  const isLoggedIn = !!session;

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-base font-semibold tracking-tight"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
              <Activity className="h-4 w-4 text-emerald-500" />
            </div>
            Heartbeat
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {isLoggedIn ? (
              <Button size="sm" className="rounded-full px-4" asChild>
                <Link href="/dashboard">
                  Dashboard
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full px-4"
                  asChild
                >
                  <Link href="/sign-in">Sign in</Link>
                </Button>
                <Button size="sm" className="rounded-full px-4" asChild>
                  <Link href="/sign-up">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-emerald-500/8 blur-[120px]" />
          <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-emerald-500/5 blur-[100px]" />
        </div>

        <div className="mx-auto max-w-6xl px-6 pt-24 pb-20 sm:pt-36 sm:pb-32">
          <FadeIn className="mx-auto max-w-3xl text-center">
            {/* Status pill */}
            <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              All systems operational
            </div>

            {/* Headline */}
            <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
              Know Before
              <br />
              <span className="bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Your Users Do
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Heartbeat monitors your endpoints around the clock and alerts you
              the instant something breaks. Simple, fast, reliable.
            </p>

            {/* CTA */}
            <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              {isLoggedIn ? (
                <Button
                  size="lg"
                  className="h-12 rounded-full px-8 text-base shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-shadow"
                  asChild
                >
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    className="h-12 rounded-full px-8 text-base shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-shadow"
                    asChild
                  >
                    <Link href="/sign-up">
                      Start Monitoring Free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 rounded-full px-8 text-base border-border/60"
                    asChild
                  >
                    <Link href="/sign-in">Sign in</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Trust signals */}
            <div className="mt-10 flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                Free to start
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                No credit card
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                Setup in 30s
              </span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="mx-auto max-w-6xl px-6 pb-28">
        <ScaleIn>
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-2xl shadow-black/5 dark:shadow-black/20 backdrop-blur-sm">
            <div className="flex items-center gap-2 border-b border-border/40 px-5 py-3.5">
              <div className="h-3 w-3 rounded-full bg-red-400/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-400/80" />
              <span className="ml-4 text-xs font-medium text-muted-foreground/60">
                heartbeat &mdash; dashboard
              </span>
            </div>
            <div className="p-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground/70">
                    <th className="px-4 py-3 font-medium">Endpoint</th>
                    <th className="px-4 py-3 font-medium">URL</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 text-right font-medium">
                      Response
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {[
                    {
                      name: "Production API",
                      url: "api.example.com/health",
                      status: "UP",
                      time: "124ms",
                    },
                    {
                      name: "Marketing Site",
                      url: "www.example.com",
                      status: "UP",
                      time: "89ms",
                    },
                    {
                      name: "Payment Service",
                      url: "pay.example.com/status",
                      status: "DOWN",
                      time: "—",
                    },
                    {
                      name: "Auth Server",
                      url: "auth.example.com/ping",
                      status: "UP",
                      time: "203ms",
                    },
                  ].map((row) => (
                    <tr
                      key={row.name}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="px-4 py-3.5 font-medium">{row.name}</td>
                      <td className="px-4 py-3.5 font-mono text-xs text-muted-foreground">
                        {row.url}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            row.status === "UP"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-red-500/10 text-red-600 dark:text-red-400"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              row.status === "UP"
                                ? "bg-emerald-500"
                                : "bg-red-500 animate-pulse"
                            }`}
                          />
                          {row.status === "UP" ? "Operational" : "Down"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono text-xs tabular-nums text-muted-foreground">
                        {row.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ScaleIn>
      </section>

      {/* CTA */}
      <section className="border-t border-border/40 py-28">
        <div className="mx-auto max-w-6xl px-6">
          <FadeInView>
            <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/80 px-8 py-20 text-center backdrop-blur-sm sm:px-16">
              {/* Background glow */}
              <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-emerald-500/8 blur-[80px]" />
              </div>

              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Start monitoring in seconds
              </h2>
              <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
                Free to get started. No credit card required. Set up your first
                monitor in under a minute.
              </p>
              <div className="mt-10">
                <Button
                  size="lg"
                  className="h-12 rounded-full px-8 text-base shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-shadow"
                  asChild
                >
                  <Link href={isLoggedIn ? "/dashboard" : "/sign-up"}>
                    {isLoggedIn ? "Go to Dashboard" : "Get Started Free"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
          <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <Activity className="h-4 w-4 text-emerald-500" />
            <span>Heartbeat</span>
          </div>
          <p className="text-sm text-muted-foreground">
            <a
              href="https://x.com/thedevkrish"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-emerald-500 transition-colors"
            >
              Suresh Krishna
            </a>
          </p>
          <div className="flex items-center gap-6">
            <a
              href="https://x.com/thedevkrish"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
