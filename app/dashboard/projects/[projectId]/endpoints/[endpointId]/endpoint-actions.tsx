"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditEndpointSheet } from "@/components/edit-endpoint-sheet";
import { DeleteEndpointButton } from "./delete-endpoint-button";

export function EndpointActions({
  projectId,
  endpointId,
}: {
  projectId: string;
  endpointId: string;
}) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
        <Pencil className="mr-1.5 h-3.5 w-3.5" />
        Edit
      </Button>
      <DeleteEndpointButton projectId={projectId} endpointId={endpointId} />
      <EditEndpointSheet
        projectId={projectId}
        endpointId={endpointId}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </div>
  );
}
