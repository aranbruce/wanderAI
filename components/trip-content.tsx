"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { experimental_useObject as useObject } from "ai/react";
import { AnimatePresence } from "framer-motion";

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
  googleMapsUri?: string;
  priceLevel?: "$" | "$$" | "$$$" | "$$$$";
  description?: string;
  coordinates?: {
    latitude?: number;
    longitude?: number;
  };

  photoReferences?: string[];
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
      const tripItineraryWithPhotos = object.object.locations.map(
        async (location: LocationProps) => {
          const photoReferences = await getPhotos(location.id);
          return { ...location, photoReferences };
        },
      );
      Promise.all(tripItineraryWithPhotos).then((tripItinerary) =>
        setTripItinerary(tripItinerary),
      );
    },
  });

  useEffect(() => {
    stop();
    submit({ destination, duration, preferences });
  }, []);

  async function getPhotos(placeId: string) {
    const response = await fetch(`/api/photos?placeId=${placeId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch photos: ${response.statusText}`);
    }
    return response.json();
  }

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
