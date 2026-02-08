"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { Switch } from "@/components/ui/switch";

type Channel = {
  id: string;
  type: string;
  enabled: boolean;
};

export function NotificationSettings({
  projectId,
  userEmail,
}: {
  projectId: string;
  userEmail: string;
}) {
  const [emailChannel, setEmailChannel] = useState<Channel | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    fetch(`/api/projects/${projectId}/notifications`)
      .then((res) => res.json())
      .then((channels: Channel[]) => {
        const email = channels.find((c) => c.type === "EMAIL") || null;
        setEmailChannel(email);
      })
      .finally(() => setLoading(false));
  }, [projectId]);

  async function toggleEmail() {
    setToggling(true);
    try {
      if (!emailChannel) {
        const res = await fetch(`/api/projects/${projectId}/notifications`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "EMAIL", enabled: true }),
        });
        const channel = await res.json();
        setEmailChannel(channel);
        toast.success("Email notifications enabled");
      } else {
        const res = await fetch(
          `/api/projects/${projectId}/notifications/${emailChannel.id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ enabled: !emailChannel.enabled }),
          },
        );
        const channel = await res.json();
        setEmailChannel(channel);
        toast.success(
          channel.enabled
            ? "Email notifications enabled"
            : "Email notifications disabled",
        );
      }
    } finally {
      setToggling(false);
    }
  }

  const isEnabled = emailChannel?.enabled ?? false;

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
          <Mail className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium">Email</p>
          <p className="text-xs text-muted-foreground">{userEmail}</p>
        </div>
      </div>
      <Switch
        checked={isEnabled}
        onCheckedChange={toggleEmail}
        disabled={loading || toggling}
      />
    </div>
  );
}
