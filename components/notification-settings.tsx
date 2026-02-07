"use client";

import { useEffect, useState } from "react";

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
        // Create the email channel
        const res = await fetch(`/api/projects/${projectId}/notifications`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "EMAIL", enabled: true }),
        });
        const channel = await res.json();
        setEmailChannel(channel);
      } else {
        // Toggle existing channel
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
      }
    } finally {
      setToggling(false);
    }
  }

  const isEnabled = emailChannel?.enabled ?? false;

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-100 text-sm dark:bg-zinc-800">
            @
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              Email
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {userEmail}
            </p>
          </div>
        </div>
        <button
          onClick={toggleEmail}
          disabled={loading || toggling}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
            isEnabled
              ? "bg-zinc-900 dark:bg-zinc-50"
              : "bg-zinc-200 dark:bg-zinc-700"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform duration-200 dark:bg-zinc-900 ${
              isEnabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
