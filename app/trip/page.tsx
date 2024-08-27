import { Suspense } from "react";
import TripContent from "@/components/trip-content";

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
    <Suspense>
      <TripContent />
    </Suspense>
  );
}
