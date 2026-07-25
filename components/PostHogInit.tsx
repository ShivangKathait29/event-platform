"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export default function PostHogInit() {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    if (!key || !host) {
      if (process.env.NODE_ENV !== "production") {
        throw new Error(
          "NEXT_PUBLIC_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_KEY is configured"
        );
      }
      return;
    }

    posthog.init(key, {
      api_host: host,
      defaults: "2026-05-30",
    });
  }, []);

  return null;
}
