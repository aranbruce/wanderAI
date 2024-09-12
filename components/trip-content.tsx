"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { experimental_useObject as useObject } from "ai/react";

import { useTrip } from "@/app/providers/trip-context";
import { locationsSchema } from "@/app/api/trips/schema";

import Map from "@/components/map";
import SignUpModal from "@/components/sign-up-modal";
import LocationCard from "@/components/location-card";
import Loading from "@/components/loading";
import RefineSearch from "@/components/refine-search";

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

export default function TripContent({ tripId }: { tripId: string }) {
  const {
    tripQuery,
    setTripQuery,
    tripItinerary,
    setTripItinerary,
    tripItineraryIsLoading,
    setTripItineraryIsLoading,
  } = useTrip();
  const [currentItineraryItemIndex, setCurrentItineraryItemIndex] = useState(0);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  const router = useRouter();

  const { object, submit, stop, isLoading } = useObject({
    api: "/api/trips/results",
    schema: locationsSchema,
    onFinish: (object) => {
      setTripItinerary(object.object.locations);
    },
    onError: (error) => {
      throw new Error(error.message);
    },
  });

  useEffect(() => {
    if (object?.locations) {
      setTripItineraryIsLoading(false);
    }
  }, [object]);

  useEffect(() => {
    setTripItineraryIsLoading(true);
    getTripSearch();
    setTripItinerary([]);
    stop();
    submit({ tripId });
  }, []);

  async function getTripSearch() {
    const response = await fetch(`/api/trips/query?tripId=${tripId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    const { destination, duration, preferences } = data;
    setTripQuery({
      destination,
      duration,
      preferences,
      tripId,
    });
  }

  function increaseTimeOfDay() {
    const duration = tripQuery?.duration;
    setCurrentItineraryItemIndex((prevIndex) => {
      // Ensure the index does not exceed the length of the itinerary
      if (prevIndex < duration * 3 - 1) {
        return prevIndex + 1;
      } else {
        setIsSignUpModalOpen(true);
        return prevIndex;
      }
    });
  }

  function decreaseTimeOfDay() {
    if (currentItineraryItemIndex === 0) {
      router.push("/");
    } else {
      setCurrentItineraryItemIndex((prevIndex) => prevIndex - 1);
    }
  }

  return (
    <div className="relative flex h-svh max-h-dvh w-full flex-col overflow-hidden">
      {!object?.locations && tripItinerary.length === 0 ? (
        <>
          <Loading />
        </>
      ) : (
        <>
          <div className="relative ml-auto h-[calc(100%-300px)] w-full md:absolute md:right-0 md:h-screen md:w-[calc(100%-384px)] lg:w-[calc(100%-420px)]">
            <div className="absolute bottom-0 z-10 mx-auto hidden w-full flex-col items-center px-4 pb-6 md:flex">
              <RefineSearch
                destination={tripQuery.destination}
                duration={tripQuery.duration}
              />
            </div>
            <Map
              tripItinerary={
                !isLoading && tripItinerary.length > 0
                  ? tripItinerary
                  : object?.locations
              }
              currentItineraryItemIndex={currentItineraryItemIndex}
            />
          </div>
          <LocationCard
            location={
              !isLoading && tripItinerary.length > 0
                ? tripItinerary[currentItineraryItemIndex]
                : object?.locations[currentItineraryItemIndex]
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
