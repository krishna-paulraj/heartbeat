"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const MAX_PROJECTS = 2;

export function NewProjectSheet({
  projectCount = 0,
  children,
}: {
  projectCount?: number;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const atLimit = projectCount >= MAX_PROJECTS;

  function reset() {
    setName("");
    setDescription("");
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description: description || undefined }),
    });

    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error || "Failed to create project");
      setLoading(false);
      return;
    }

    const project = await res.json();
    toast.success("Project created");
    reset();
    setOpen(false);
    router.push(`/dashboard/projects/${project.id}`);
    router.refresh();
  }

  if (atLimit) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {children ?? (
            <Button size="sm" variant="outline" disabled>
              <Lock className="mr-1.5 h-3.5 w-3.5" />
              Limit Reached
            </Button>
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>You can create a maximum of {MAX_PROJECTS} projects</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <SheetTrigger asChild>
        {children ?? (
          <Button size="sm">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            New Project
          </Button>
        )}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New Project</SheetTitle>
          <SheetDescription>
            Create a project to group your monitored endpoints.
            <span className="mt-1 block text-xs">
              {projectCount}/{MAX_PROJECTS} projects used
            </span>
          </SheetDescription>
        </SheetHeader>
        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col gap-4 px-4"
        >
          <div className="space-y-2">
            <Label htmlFor="new-project-name">Name</Label>
            <Input
              id="new-project-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="My Website"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-project-desc">
              Description{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="new-project-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Brief description of the project"
            />
          </div>
        </form>
        <SheetFooter>
          <Button onClick={handleSubmit} disabled={loading || !name.trim()}>
            {loading ? "Creating..." : "Create Project"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
