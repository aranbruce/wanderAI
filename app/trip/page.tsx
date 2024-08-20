import { Suspense } from "react";
import TripContent from "@/components/trip-content";

export default function Trip() {
  return (
    <Suspense>
      <TripContent />
    </Suspense>
  );
}
