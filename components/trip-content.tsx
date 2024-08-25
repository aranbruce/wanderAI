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
  description?: string;
  coordinates?: {
    latitude?: number;
    longitude?: number;
  };
  rating?: number;
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
      console.log("object: ", object);
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
              tripItinerary.length === 0 ? object?.locations : tripItinerary
            }
            currentItineraryItemIndex={currentItineraryItemIndex}
          />

          <LocationCard
            location={
              tripItinerary.length === 0
                ? object.locations[currentItineraryItemIndex]
                : tripItinerary[currentItineraryItemIndex]
            }
            increaseTimeOfDay={increaseTimeOfDay}
            decreaseTimeOfDay={decreaseTimeOfDay}
          />
        </>
      )}

      <AnimatePresence>
        {isSignUpModalOpen && (
          <SignUpModal
            setIsModalOpen={setIsSignUpModalOpen}
            isModalOpen={isSignUpModalOpen}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
