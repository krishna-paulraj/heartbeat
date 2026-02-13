"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const MAX_ENDPOINTS = 5;

export function NewEndpointSheet({
  projectId,
  endpointCount = 0,
  children,
}: {
  projectId: string;
  endpointCount?: number;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [checkInterval, setCheckInterval] = useState("60");
  const [loading, setLoading] = useState(false);

  const atLimit = endpointCount >= MAX_ENDPOINTS;

  function reset() {
    setName("");
    setUrl("");
    setMethod("GET");
    setCheckInterval("60");
    setLoading(false);
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);

    const res = await fetch(`/api/projects/${projectId}/endpoints`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        name,
        method,
        checkInterval: Number(checkInterval),
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error || "Failed to add endpoint");
      setLoading(false);
      return;
    }

    toast.success("Endpoint added");
    reset();
    setOpen(false);
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
          <p>
            You can create a maximum of {MAX_ENDPOINTS} endpoints per project
          </p>
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
            Add Endpoint
          </Button>
        )}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Endpoint</SheetTitle>
          <SheetDescription>
            Add a URL to monitor for uptime.
            <span className="mt-1 block text-xs">
              {endpointCount}/{MAX_ENDPOINTS} endpoints used
            </span>
          </SheetDescription>
        </SheetHeader>
        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col gap-4 px-4"
        >
          <div className="space-y-2">
            <Label htmlFor="new-ep-name">Name</Label>
            <Input
              id="new-ep-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Production API"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-ep-url">URL</Label>
            <Input
              id="new-ep-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              placeholder="https://example.com/health"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Method</Label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="HEAD">HEAD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Check Interval</Label>
              <Select value={checkInterval} onValueChange={setCheckInterval}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="60">1 minute</SelectItem>
                  <SelectItem value="300">5 minutes</SelectItem>
                  <SelectItem value="600">10 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
        <SheetFooter>
          <Button
            onClick={() => handleSubmit()}
            disabled={loading || !name.trim() || !url.trim()}
          >
            {loading ? "Adding..." : "Add Endpoint"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
