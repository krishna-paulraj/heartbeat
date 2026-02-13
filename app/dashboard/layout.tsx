import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PingStatus } from "@/lib/generated/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    include: { endpoints: { select: { id: true } } },
    orderBy: { createdAt: "desc" },
  });

  const projectsWithStatus = await Promise.all(
    projects.map(async (project) => {
      if (project.endpoints.length === 0) {
        return {
          id: project.id,
          name: project.name,
          overallStatus: null as PingStatus | null,
          endpointCount: 0,
        };
      }

      const latestPings = await Promise.all(
        project.endpoints.map((e) =>
          prisma.ping.findFirst({
            where: { endpointId: e.id },
            orderBy: { checkedAt: "desc" },
            select: { status: true },
          }),
        ),
      );

      const statuses = latestPings.filter(Boolean).map((p) => p!.status);
      let overallStatus: PingStatus | null = null;
      if (statuses.includes(PingStatus.DOWN)) overallStatus = PingStatus.DOWN;
      else if (statuses.includes(PingStatus.DEGRADED))
        overallStatus = PingStatus.DEGRADED;
      else if (statuses.length > 0) overallStatus = PingStatus.UP;

      return {
        id: project.id,
        name: project.name,
        overallStatus,
        endpointCount: project.endpoints.length,
      };
    }),
  );

  return (
    <SidebarProvider>
      <AppSidebar
        user={{
          name: session.user.name,
          email: session.user.email,
        }}
        projects={projectsWithStatus}
      />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <main className="mx-auto w-full max-w-5xl px-4 py-6 lg:px-8">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
