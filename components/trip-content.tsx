"use client";

import { useEffect, useState } from "react";
import { generateTripItinerary } from "@/app/actions";
import { readStreamableValue } from "ai/rsc";
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
}

const TripContent = () => {
  const [tripItinerary, setTripItinerary] = useState<LocationProps[]>([]);
  const [currentItineraryItemIndex, setCurrentItineraryItemIndex] = useState(0);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);

  const getNewSearchParams = useGetNewSearchParams();
  const { destination, duration, preferences } = getNewSearchParams();
  const router = useRouter();

  const { object, submit, stop, isLoading } = useObject({
    api: "/api/trip",
    schema: locationsSchema,
    onFinish: (object) => {
      console.log("object: ", object);
      setTripItinerary(object?.object?.locations);
    },
  });

  useEffect(() => {
    // fetchItineraryDetails();
    stop();
    submit({ destination, duration, preferences });
    console.log("object: ", object);
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

          // setTripItinerary(JSON.stringify(locations, null, 2));
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
    <div>
      {!object?.locations && tripItinerary.length === 0 ? (
        <Loading />
      ) : (
        <>
          <Map
            tripItinerary={tripItinerary}
            currentItineraryItemIndex={currentItineraryItemIndex}
            isLoading={isLoading}
          />
          {isLoading &&
            object?.locations &&
            object.locations[currentItineraryItemIndex] && (
              <LocationCard
                location={object.locations[currentItineraryItemIndex]}
                increaseTimeOfDay={increaseTimeOfDay}
                decreaseTimeOfDay={decreaseTimeOfDay}
              />
            )}
          {!isLoading && (
            <LocationCard
              location={tripItinerary[currentItineraryItemIndex]}
              increaseTimeOfDay={increaseTimeOfDay}
              decreaseTimeOfDay={decreaseTimeOfDay}
            />
          )}
        </>
      )}

      <AnimatePresence>
        {isSignUpModalOpen && (
          <SignUpModal
            setIsSignUpModalOpen={setIsSignUpModalOpen}
            isSignUpModalOpen={isSignUpModalOpen}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TripContent;
