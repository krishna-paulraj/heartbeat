"use client";

import { useRouter } from "next/navigation";

export function DeleteEndpointButton({
  projectId,
  endpointId,
}: {
  projectId: string;
  endpointId: string;
}) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Delete this endpoint? All monitoring data will be lost.")) return;

    const res = await fetch(`/api/projects/${projectId}/endpoints/${endpointId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      router.push(`/dashboard/projects/${projectId}`);
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
    >
      Delete
    </button>
  );
}
