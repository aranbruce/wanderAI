import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { validateForm, ValidationErrors } from "@/utils/validation";
import useIsLargeScreen from "@/hooks/useIsLargeScreen";
import { useTrip } from "@/app/providers/trip-context";

import Input from "@/components/input";
import SearchInput, { Destination } from "@/components/search-input";
import Checkbox from "@/components/checkbox";
import Button from "@/components/button";
import Backdrop from "@/components/backdrop";
import BackIcon from "@/images/icons/back-icon";
import SpinnerIcon from "@/images/icons/spinner-icon";
import SearchIcon from "@/images/icons/search-icon";

interface SearchModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}

export default function SearchModal({
  isModalOpen,
  setIsModalOpen,
}: SearchModalProps) {
  const { tripQuery, setTripQuery } = useTrip();

  const [destinationError, setDestinationError] = useState<string | null>(null);
  const [durationError, setDurationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();
  const isLargeScreen = useIsLargeScreen(768);
  const preferenceOptions = [
    "Food",
    "Culture",
    "Outdoors",
    "Indoors",
    "Active",
    "Relaxing",
    "Pet friendly",
    "Child friendly",
    "LGBTQ+ friendly",
    "Vegetarian",
    "Vegan",
    "Nightlife",
  ];

  function handleModalClose() {
    setIsModalOpen(false);
  }

  function setSelectedDestination(destination: Destination) {
    setTripQuery((prevTripQuery) => ({
      ...prevTripQuery,
      destination,
    }));
    setDestinationError(null);
  }

  function handleDurationChange(duration: number) {
    setTripQuery((prevTripQuery) => ({
      ...prevTripQuery,
      duration: duration,
    }));
    setDurationError(null);
  }

  function handlePreferenceChange(preference: string) {
    setTripQuery((prevTripQuery) => {
      const newPreferences = prevTripQuery.preferences.includes(preference)
        ? prevTripQuery.preferences.filter((p) => p !== preference)
        : [...prevTripQuery.preferences, preference];
      return {
        ...prevTripQuery,
        preferences: newPreferences,
      };
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    const { destinationError, durationError }: ValidationErrors = validateForm(
      tripQuery?.destination,
      tripQuery?.duration,
    );
    setDestinationError(destinationError);
    setDurationError(durationError);
    if (!destinationError && !durationError) {
      const result = await createTrip(
        tripQuery?.destination,
        tripQuery?.duration,
        tripQuery?.preferences,
      );
      const tripId = result.tripId;
      const url = `/trips/${encodeURIComponent(tripId)}`;
      setIsLoading(false);
      router.push(url);
    }
  }

  async function createTrip(
    destination: Destination,
    duration: number,
    preferences: string[],
  ) {
    const result = await fetch("/api/trips/query", {
      method: "POST",
      body: JSON.stringify({
        destination,
        duration: Number(duration),
        preferences,
      }),
    });
    const data = await result.json();
    console.log(data);
    return data;
  }

  const animation = isLargeScreen
    ? {
        opacity: 1,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }
    : {
        opacity: 1,
        bottom: "0",
        left: "50%",
        transform: "translate(-50%, -100%)",
      };

  return (
    <>
      <Backdrop onClick={() => handleModalClose()} isModalOpen={isModalOpen} />
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            key="search-modal"
            initial={{
              opacity: 0,
              left: "50%",
              top: "100%",
              transform: "translate(-50%, 0%)",
            }}
            animate={animation}
            exit={{
              opacity: 0,
              left: "50%",
              top: "100%",
              transform: "translate(-50%, -0%)",
            }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
            className="fixed bottom-0 left-0 z-50 flex h-fit max-h-screen w-full flex-col items-start overflow-hidden rounded-t-xl bg-white shadow-heavy md:bottom-1/2 md:left-1/2 md:w-[568px] md:-translate-x-1/2 md:-translate-y-1/2 md:transform md:rounded-xl"
          >
            <header className="sticky top-0 w-full border-b border-gray-200 bg-white px-6 py-4">
              <h3 className="text-lg">Your trip details</h3>
            </header>
            <form
              id="modalForm"
              className="w-full overflow-y-auto"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col gap-6 overflow-y-auto p-6 pb-28">
                <div className="flex flex-col gap-4">
                  <SearchInput
                    label="Where do you want to go?"
                    showLabel
                    destinationValue={tripQuery?.destination}
                    setDestinationValue={setSelectedDestination}
                    error={destinationError}
                    required
                  />
                  <Input
                    type="number"
                    inputMode="numeric"
                    value={tripQuery?.duration}
                    onChange={(e) =>
                      handleDurationChange(Number(e.target.value))
                    }
                    placeholder="Enter your trip duration"
                    label="How many days is your trip?"
                    showLabel
                    error={durationError}
                    min={1}
                    max={14}
                    required
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <h4 className="font-medium">Priorities</h4>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {preferenceOptions.map((preference) => (
                      <Checkbox
                        key={preference}
                        label={preference}
                        checked={tripQuery?.preferences.includes(preference)}
                        onChange={() => handlePreferenceChange(preference)}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="fixed bottom-0 left-0 flex w-full gap-4 border-t border-gray-200 bg-white p-4">
                <div>
                  <Button
                    variant="secondary"
                    onClick={handleModalClose}
                    type="button"
                  >
                    <BackIcon height="24" width="24" />
                  </Button>
                </div>
                <div className="flex w-full flex-grow flex-col">
                  <Button type="submit" aria-disabled={isLoading}>
                    {isLoading ? (
                      <SpinnerIcon height="20" width="20" />
                    ) : (
                      <SearchIcon width="20" height="20" />
                    )}
                    Plan
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
