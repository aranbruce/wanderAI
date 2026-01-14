"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { z } from "zod";

import useGetNewSearchParams from "@/hooks/useGetNewSearchParams";
import { useMapboxSession } from "@/hooks/useMapboxSession";
import { locationItemSchema } from "@/app/api/trip/schema";

import Map from "@/components/map";
import SignUpModal from "@/components/sign-up-modal";
import LocationCard from "@/components/location-card";
import Loading from "@/components/loading";
import Button from "@/components/button";

// Type for location items from the API
export type LocationItem = z.infer<typeof locationItemSchema>;

// Extended interface for UI components (includes optional fields for additional data)
export interface LocationProps extends Partial<LocationItem> {
  reviewCount?: number;
  tripadvisorUrl?: string;
  websiteUrl?: string;
  photoUrls?: string[];
}

// Constants
const LOCATIONS_PER_DAY = 3;
const MAX_DURATION_DAYS = 2;

export default function TripContent() {
  const [currentItineraryItemIndex, setCurrentItineraryItemIndex] = useState(0);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [localError, setLocalError] = useState<Error | null>(null);
  const hasSubmitted = useRef(false);
  const submissionTimeRef = useRef<number | null>(null);

  const getNewSearchParams = useGetNewSearchParams();
  const { destination, duration, preferences } = getNewSearchParams();
  const { sessionToken } = useMapboxSession();
  const router = useRouter();

  // Helper to convert error to Error object
  const toError = (err: unknown): Error =>
    err instanceof Error ? err : new Error(String(err));

  // Use useObject hook for streaming object generation
  // Schema matches the server's Output.array({ element: locationItemSchema })
  const { object, submit, error, isLoading } = useObject({
    api: "/api/trip",
    schema: z.array(locationItemSchema),
    onError: (error) => {
      console.error("Error in useObject onError callback:", error);
      setLocalError(toError(error));
    },
    onFinish: ({ object, error }) => {
      if (error) {
        console.error("Error in useObject onFinish callback:", error);
        setLocalError(toError(error));
      } else if (object) {
        // Success - clear any previous errors
        setLocalError(null);
      }
    },
  });

  // Combine error from useObject and local error state
  const displayError = error || localError;

  useEffect(() => {
    if (!sessionToken || hasSubmitted.current || !destination || !duration) {
      return;
    }
    submissionTimeRef.current = Date.now();
    submit({ destination, duration, preferences, sessionToken });
    hasSubmitted.current = true;
  }, [sessionToken, destination, duration, preferences, submit]);

  const maxIndex = useMemo(() => {
    return Math.max(
      (duration || MAX_DURATION_DAYS) * LOCATIONS_PER_DAY - 1,
      MAX_DURATION_DAYS * LOCATIONS_PER_DAY - 1,
    );
  }, [duration]);

  function increaseTimeOfDay() {
    if (currentItineraryItemIndex >= maxIndex) {
      setIsSignUpModalOpen(true);
    } else {
      setCurrentItineraryItemIndex((prev) => prev + 1);
    }
  }

  function decreaseTimeOfDay() {
    if (currentItineraryItemIndex === 0) {
      router.push("/");
    } else {
      setCurrentItineraryItemIndex((prev) => prev - 1);
    }
  }

  // When using Output.array(), useObject returns { elements: Array }
  // TypeScript doesn't infer this correctly, so we use type assertion
  // During streaming, elements are PartialObject types, so we cast to LocationProps[]
  type UseObjectResult = {
    elements?: LocationItem[];
  };
  const locations = useMemo(() => {
    const elements = (object as unknown as UseObjectResult)?.elements || [];
    // Cast to LocationProps[] to handle PartialObject types during streaming
    return elements as unknown as LocationProps[];
  }, [object]);

  // Error detection: catch cases where streaming errors occur but aren't properly propagated
  // Checks for: 1) Loading stopped without data after 5+ seconds, 2) Timeout after 20 seconds
  useEffect(() => {
    if (!submissionTimeRef.current || locations.length > 0 || displayError) {
      return;
    }

    const GENERIC_ERROR_MESSAGE =
      "We encountered an error while generating your trip. Please try again.";

    // Check every 2 seconds
    const interval = setInterval(() => {
      if (!submissionTimeRef.current) return;

      const elapsed = Date.now() - submissionTimeRef.current;

      // Case 1: Loading stopped without data (error likely occurred)
      // Only trigger after 5 seconds to avoid false positives
      if (!isLoading && elapsed > 5000 && locations.length === 0) {
        console.warn("Loading stopped without data - assuming error occurred");
        setLocalError(new Error(GENERIC_ERROR_MESSAGE));
        clearInterval(interval);
        return;
      }

      // Case 2: Timeout after 30 seconds (still loading but no data)
      if (elapsed > 30000 && locations.length === 0) {
        console.warn("Timeout: No data received after 20 seconds");
        setLocalError(new Error(GENERIC_ERROR_MESSAGE));
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isLoading, locations.length, displayError]);

  // Calculate current index safely
  const currentIndex = useMemo(() => {
    return Math.min(
      currentItineraryItemIndex,
      Math.max(0, locations.length - 1),
    );
  }, [currentItineraryItemIndex, locations.length]);

  const currentLocation = locations[currentIndex];

  // Handle retry
  const handleRetry = () => {
    setLocalError(null); // Clear error before retrying
    hasSubmitted.current = false;
    submissionTimeRef.current = Date.now();
    if (sessionToken && destination && duration) {
      submit({ destination, duration, preferences, sessionToken });
      hasSubmitted.current = true;
    }
  };

  return (
    <div className="relative flex h-svh max-h-dvh w-full flex-col overflow-hidden">
      {displayError ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-6 p-8 text-center">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold">Something Went Wrong</h1>
            <p className="max-w-md text-gray-600">
              We encountered an error while generating your trip. Please try
              again.
            </p>
            <div className="mt-4 flex justify-center gap-4">
              <Button onClick={handleRetry}>Try Again</Button>
              <Button onClick={() => router.push("/")} variant="secondary">
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      ) : locations.length > 0 && currentLocation ? (
        <div className="flex h-full w-full flex-col md:grid md:grid-cols-[384px_1fr] lg:grid-cols-[420px_1fr]">
          <Map
            tripItinerary={locations}
            currentItineraryItemIndex={currentIndex}
          />
          <LocationCard
            location={currentLocation}
            increaseTimeOfDay={increaseTimeOfDay}
            decreaseTimeOfDay={decreaseTimeOfDay}
          />
        </div>
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
