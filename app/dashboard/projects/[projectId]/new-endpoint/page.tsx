import { redirect } from "next/navigation";

export default async function NewEndpointPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  redirect(`/dashboard/projects/${projectId}`);
}
