import { redirect } from "next/navigation";

export default async function EditEndpointPage({
  params,
}: {
  params: Promise<{ projectId: string; endpointId: string }>;
}) {
  const { projectId, endpointId } = await params;
  redirect(`/dashboard/projects/${projectId}/endpoints/${endpointId}`);
}
