import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import TripContent from "@/components/trip-content";

import Loading from "@/components/loading";
import Error from "@/components/error";

export const metadata = {
  title: "WanderAI | Trip",
  description: "Plan your next trip in seconds through the power of AI",
  openGraph: {
    title: "Trip",
    description: "Plan your next trip in seconds through the power of AI",
  },
};

export default function Trip() {
  return (
    <Suspense fallback={<Loading />}>
      <ErrorBoundary fallback={<Error />}>
        <TripContent />
      </ErrorBoundary>
    </Suspense>
  );
}
