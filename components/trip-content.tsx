"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { z } from "zod";

import useGetNewSearchParams from "@/hooks/useGetNewSearchParams";
import { useMapboxSession } from "@/hooks/useMapboxSession";

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
  const [currentItineraryItemIndex, setCurrentItineraryItemIndex] = useState(0);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const hasSubmitted = useRef(false);

  const getNewSearchParams = useGetNewSearchParams();
  const { destination, duration, preferences } = getNewSearchParams();
  const { sessionToken } = useMapboxSession();
  const router = useRouter();

  // Use useObject hook for streaming object generation
  const { object, submit, isLoading } = useObject({
    api: "/api/trip",
    schema: z.array(
      z.object({
        id: z.string(),
        coordinates: z.object({
          latitude: z.number(),
          longitude: z.number(),
        }),
        day: z.number(),
        timeOfDay: z.enum(["morning", "afternoon", "evening"]),
        title: z.string(),
        rating: z.number(),
        priceLevel: z.enum(["$", "$$", "$$$", "$$$$"]),
        description: z.string(),
        isLoaded: z.boolean(),
      }),
    ),
  });

  useEffect(() => {
    if (!sessionToken || hasSubmitted.current) return;

    console.log("Submitting trip request:", {
      destination,
      duration,
      preferences,
      sessionToken,
    });
    submit({ destination, duration, preferences, sessionToken });
    hasSubmitted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionToken]); // Only depend on sessionToken

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
      {object && object.length > 0 ? (
        (() => {
          const currentIndex = Math.min(
            currentItineraryItemIndex,
            object.length - 1,
          );
          const currentLocation = object[currentIndex];

          return (
            <div className="flex h-full w-full flex-col md:grid md:grid-cols-[384px_1fr] lg:grid-cols-[420px_1fr]">
              <Map
                tripItinerary={object || []}
                currentItineraryItemIndex={currentIndex}
              />
              <LocationCard
                location={currentLocation}
                increaseTimeOfDay={increaseTimeOfDay}
                decreaseTimeOfDay={decreaseTimeOfDay}
              />
            </div>
          );
        })()
      ) : (
        <Loading />
      )}
      <SignUpModal
        isModalOpen={isSignUpModalOpen}
        setIsModalOpen={setIsSignUpModalOpen}
      />
    </div>
  );
}
