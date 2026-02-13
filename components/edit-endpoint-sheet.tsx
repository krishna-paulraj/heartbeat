"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
} from "@/components/ui/sheet";

export function EditEndpointSheet({
  projectId,
  endpointId,
  open,
  onOpenChange,
}: {
  projectId: string;
  endpointId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [checkInterval, setCheckInterval] = useState("60");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetch(`/api/projects/${projectId}/endpoints/${endpointId}`)
        .then((res) => res.json())
        .then((data) => {
          setUrl(data.url || "");
          setName(data.name || "");
          setMethod(data.method || "GET");
          setCheckInterval(String(data.checkInterval || 60));
          setIsActive(data.isActive ?? true);
        });
    }
  }, [open, projectId, endpointId]);

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);

    const res = await fetch(
      `/api/projects/${projectId}/endpoints/${endpointId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          name,
          method,
          checkInterval: Number(checkInterval),
          isActive,
        }),
      },
    );

    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error || "Failed to update endpoint");
      setLoading(false);
      return;
    }

    toast.success("Endpoint updated");
    setLoading(false);
    onOpenChange(false);
    router.refresh();
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Endpoint</SheetTitle>
          <SheetDescription>
            Update your endpoint configuration.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 px-4">
          <div className="space-y-2">
            <Label htmlFor="edit-ep-name">Name</Label>
            <Input
              id="edit-ep-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-ep-url">URL</Label>
            <Input
              id="edit-ep-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
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
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <Switch
              id="edit-ep-active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="edit-ep-active" className="cursor-pointer">
              Active (monitoring enabled)
            </Label>
          </div>
        </form>
        <SheetFooter>
          <Button
            onClick={() => handleSubmit()}
            disabled={loading || !name.trim() || !url.trim()}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
