"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditProjectSheet } from "@/components/edit-project-sheet";
import { DeleteProjectButton } from "./delete-project-button";

export function ProjectActions({ projectId }: { projectId: string }) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
        <Pencil className="mr-1.5 h-3.5 w-3.5" />
        Edit
      </Button>
      <DeleteProjectButton projectId={projectId} />
      <EditProjectSheet
        projectId={projectId}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </div>
  );
}
