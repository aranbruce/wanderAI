"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { experimental_useObject as useObject } from "ai/react";

import { locationsSchema } from "@/app/api/trip/schema";

import useGetNewSearchParams from "@/hooks/useGetNewSearchParams";

import Map from "@/components/map";
import SignUpModal from "@/components/sign-up-modal";
import LocationCard from "@/components/location-card";
import Loading from "@/components/loading";

export interface LocationProps {
  id?: string;
  day?: number;
  timeOfDay?: string;
  title?: string;
  rating?: number;
  reviewCount?: number;
  tripadvisorUrl?: string;
  websiteUrl?: string;
  priceLevel?: "$" | "$$" | "$$$" | "$$$$";
  description?: string;
  coordinates?: {
    latitude?: number;
    longitude?: number;
  };

  photoUrls?: string[];
  isLoaded?: boolean;
}

export default function TripContent() {
  const [tripItinerary, setTripItinerary] = useState<LocationProps[]>([]);
  const [currentItineraryItemIndex, setCurrentItineraryItemIndex] = useState(0);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  const getNewSearchParams = useGetNewSearchParams();
  const { destination, duration, preferences } = getNewSearchParams();
  const router = useRouter();

  const { object, submit, stop, isLoading } = useObject({
    api: "/api/trip",
    schema: locationsSchema,
    onFinish: (object) => {
      setTripItinerary(object.object.locations);
      console.log("Trip itinerary: ", object.object.locations);
    },
    onError: (error) => {
      throw new Error(error.message);
    },
  });

  useEffect(() => {
    stop();
    submit({ destination, duration, preferences });
  }, []);

  function increaseTimeOfDay() {
    if (
      currentItineraryItemIndex === duration * 3 - 1 ||
      currentItineraryItemIndex >= 3 * 2 - 1
    ) {
      setIsSignUpModalOpen(true);
    } else {
      setCurrentItineraryItemIndex(currentItineraryItemIndex + 1);
    }
  }

  function decreaseTimeOfDay() {
    if (currentItineraryItemIndex === 0) {
      router.push("/");
    } else {
      setCurrentItineraryItemIndex(currentItineraryItemIndex - 1);
    }
  }

  return (
    <div className="relative flex h-svh max-h-dvh w-full flex-col overflow-hidden">
      {!object?.locations && tripItinerary.length === 0 ? (
        <Loading />
      ) : (
        <>
          <Map
            tripItinerary={
              !isLoading && tripItinerary.length > 0
                ? tripItinerary
                : object?.locations
            }
            currentItineraryItemIndex={currentItineraryItemIndex}
          />
          <LocationCard
            location={
              !isLoading && tripItinerary.length > 0
                ? tripItinerary[currentItineraryItemIndex]
                : object.locations[currentItineraryItemIndex]
            }
            increaseTimeOfDay={increaseTimeOfDay}
            decreaseTimeOfDay={decreaseTimeOfDay}
          />
        </>
      )}
      <SignUpModal
        isModalOpen={isSignUpModalOpen}
        setIsModalOpen={setIsSignUpModalOpen}
      />
    </div>
  );
}
