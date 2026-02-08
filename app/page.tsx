import Link from "next/link";
import { Activity, Server, Bell, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-base font-semibold"
          >
            <Activity className="h-5 w-5 text-emerald-500" />
            Heartbeat
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 pt-24 pb-20 sm:pt-32 sm:pb-28">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-sm text-muted-foreground">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            All systems operational
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Monitor your endpoints.
            <br />
            <span className="text-muted-foreground">
              Get alerted instantly.
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Know when your services go down before your users do. Heartbeat
            monitors your HTTP endpoints around the clock and sends you instant
            alerts the moment something breaks.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/sign-up">Start Monitoring</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </div>
        </FadeIn>
      </section>

      {/* Dashboard Preview */}
      <section className="mx-auto max-w-5xl px-4 pb-20">
        <FadeIn delay={0.2}>
          <div className="overflow-hidden rounded-xl border bg-card shadow-xl">
            <div className="flex items-center gap-2 border-b px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-emerald-400" />
              <span className="ml-3 text-xs text-muted-foreground">
                heartbeat dashboard
              </span>
            </div>
            <div className="p-1">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground">
                    <th className="px-4 py-2.5 font-medium">Endpoint</th>
                    <th className="px-4 py-2.5 font-medium">URL</th>
                    <th className="px-4 py-2.5 font-medium">Status</th>
                    <th className="px-4 py-2.5 text-right font-medium">
                      Response
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    {
                      name: "Production API",
                      url: "api.example.com",
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
                      url: "pay.example.com",
                      status: "DOWN",
                      time: "—",
                    },
                    {
                      name: "Auth Server",
                      url: "auth.example.com",
                      status: "UP",
                      time: "203ms",
                    },
                  ].map((row) => (
                    <tr key={row.name}>
                      <td className="px-4 py-3 font-medium">{row.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {row.url}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium ${
                            row.status === "UP"
                              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              row.status === "UP"
                                ? "bg-emerald-500"
                                : "bg-red-500"
                            }`}
                          />
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground">
                        {row.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Features */}
      <section className="border-t bg-card py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Everything you need to stay online
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Simple, reliable monitoring without the complexity.
            </p>
          </div>
          <FadeInStagger className="mt-14 grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: Server,
                title: "Uptime Monitoring",
                description:
                  "Monitor any HTTP endpoint with configurable check intervals. Support for GET, POST, and HEAD requests.",
              },
              {
                icon: Bell,
                title: "Instant Alerts",
                description:
                  "Get notified via email the moment an endpoint goes down. Recovery alerts when services come back online.",
              },
              {
                icon: BarChart3,
                title: "Incident Tracking",
                description:
                  "Automatic incident creation when downtime is detected. Track duration, resolution time, and uptime history.",
              },
            ].map((feature) => (
              <FadeInStaggerItem key={feature.title}>
                <div className="rounded-xl border bg-background p-6 transition-shadow hover:shadow-md">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <feature.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h3 className="text-sm font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </FadeInStaggerItem>
            ))}
          </FadeInStagger>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Up and running in minutes
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Three simple steps to never miss downtime again.
            </p>
          </div>
          <FadeInStagger className="mt-14 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Add your endpoints",
                description:
                  "Enter the URLs you want to monitor and configure check intervals.",
              },
              {
                step: "2",
                title: "We monitor 24/7",
                description:
                  "Heartbeat checks your endpoints around the clock and tracks response times.",
              },
              {
                step: "3",
                title: "Get alerted",
                description:
                  "Receive instant email notifications when something goes down and when it recovers.",
              },
            ].map((item) => (
              <FadeInStaggerItem key={item.step} className="text-center">
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {item.step}
                </div>
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </FadeInStaggerItem>
            ))}
          </FadeInStagger>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-card py-20">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Start monitoring in seconds
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Free to get started. No credit card required.
          </p>
          <div className="mt-8">
            <Button size="lg" asChild>
              <Link href="/sign-up">Create your account</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6">
          <span className="text-sm text-muted-foreground">Heartbeat</span>
          <div className="flex items-center gap-4">
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
          </div>
        </div>
      </footer>
    </div>
  );
}
