import { Suspense } from "react";
import TripContent from "@/components/trip-content";

const Trip = () => {
  return (
    <Suspense>
      <TripContent />
    </Suspense>
  );
};

export default Trip;
