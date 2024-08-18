"use client";

import { useEffect, useState } from "react";
import { generateTripItinerary } from "@/app/actions";
import { readStreamableValue } from "ai/rsc";
import { useRouter } from "next/navigation";

import useGetNewSearchParams from "@/hooks/useGetNewSearchParams";

import Map from "@/components/map/map";
import SignUpModal from "@/components/sign-up-modal";
import LocationCard from "@/components/locationCard/locationCard";
import { AnimatePresence } from "framer-motion";
import Loading from "./loading/loading";

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
}

const TripContent = () => {
  const [tripItinerary, setTripItinerary] = useState<LocationProps[]>([]);
  const [currentItineraryItemIndex, setCurrentItineraryItemIndex] = useState(0);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getNewSearchParams = useGetNewSearchParams();
  const { destination, duration, preferences } = getNewSearchParams();
  const router = useRouter();

  useEffect(() => {
    console.log("tripItinerary: ", tripItinerary);
    if (isLoading && tripItinerary.length > 0) {
      setIsLoading(false);
    }
  }, [tripItinerary]);

  useEffect(() => {
    fetchItineraryDetails();
  }, []);

  const fetchItineraryDetails = async () => {
    const { object } = await generateTripItinerary({
      destination,
      duration,
      preferences,
    });

    for await (const partialObject of readStreamableValue(object)) {
      if (partialObject) {
        const locations = partialObject.locations;
        if (locations) {
          // console.log(locations);
          // convert the locations to a json array
          const locationsString = JSON.stringify(locations, null, 2);
          const locationsArray = JSON.parse(locationsString);

          setTripItinerary(locationsArray);
        }
      }
    }
  };

  const increaseTimeOfDay = () => {
    if (currentItineraryItemIndex === tripItinerary.length - 1) {
      setIsSignUpModalOpen(true);
    } else {
      setCurrentItineraryItemIndex(currentItineraryItemIndex + 1);
    }
  };

  const decreaseTimeOfDay = () => {
    if (currentItineraryItemIndex === 0) {
      router.push("/");
    } else {
      setCurrentItineraryItemIndex(currentItineraryItemIndex - 1);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {tripItinerary[currentItineraryItemIndex]?.coordinates?.latitude &&
            tripItinerary[currentItineraryItemIndex]?.coordinates
              ?.longitude && (
              // <div>
              //   {tripItinerary[currentItineraryItemIndex].coordinates.latitude}
              // </div>
              <Map
                tripItinerary={tripItinerary}
                currentItineraryItemIndex={currentItineraryItemIndex}
              />
            )}
          {tripItinerary[currentItineraryItemIndex] && (
            <LocationCard
              location={tripItinerary[currentItineraryItemIndex]}
              increaseTimeOfDay={increaseTimeOfDay}
              decreaseTimeOfDay={decreaseTimeOfDay}
            />
          )}
          <AnimatePresence>
            {isSignUpModalOpen && (
              <SignUpModal
                setIsSignUpModalOpen={setIsSignUpModalOpen}
                isSignUpModalOpen={isSignUpModalOpen}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </>
  );
};

export default TripContent;
