// providers.tsx
import React from "react";
import { PostHogProvider } from "@/app/providers/posthog-context"; // Import the PostHogProvider
import { TripProvider } from "@/app/providers/trip-context"; // Import the TripProvider

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider>
      <TripProvider>{children}</TripProvider>
    </PostHogProvider>
  );
}
