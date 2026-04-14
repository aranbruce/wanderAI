"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

const isProduction = process.env.NODE_ENV === "production";
const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const isPosthogEnabled = Boolean(posthogKey && isProduction);

if (typeof window !== "undefined") {
  if (isPosthogEnabled) {
    posthog.init(posthogKey, {
      api_host: "/ingest",
      ui_host: "https://eu.posthog.com",
      person_profiles: "always",
    });
  }
}

export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  if (!isPosthogEnabled) {
    return <>{children}</>;
  }

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
