import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { validateForm, ValidationErrors } from "@/utils/validation";

import Backdrop from "@/components/backdrop";
import Button from "@/components/button";
import Checkbox from "@/components/checkbox";
import Input from "@/components/input";
import SearchInput, { Destination } from "@/components/search-input";
import useIsLargeScreen from "@/hooks/useIsLargeScreen"; // Import the custom hook
import BackIcon from "@/images/icons/back-icon";
import { MotionDiv } from "./motion";

interface SearchModalProps {
  destination: Destination | null;
  setSelectedDestination: (destination: Destination) => void;
  duration: string;
  handleDurationChange: (duration: string) => void;
  preferences: string[];
  handlePreferenceChange: (preference: string) => void;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}

export default function SearchModal({
  destination,
  setSelectedDestination,
  duration,
  handleDurationChange,
  preferences,
  handlePreferenceChange,
  isModalOpen,
  setIsModalOpen,
}: SearchModalProps) {
  const [destinationError, setDestinationError] = useState<string | null>(null);
  const [durationError, setDurationError] = useState<string | null>(null);

  const router = useRouter();
  const isLargeScreen = useIsLargeScreen(768);
  const preferenceOptions = [
    "Food",
    "Culture",
    "Outdoors",
    "Indoors",
    "Active",
    "Relaxation",
    "Pet friendly",
    "Child friendly",
    "Vegetarian",
    "Vegan",
    "Nightlife",
  ];

  function handleModalClose() {
    setIsModalOpen(false);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { destinationError, durationError }: ValidationErrors = validateForm(
      destination,
      duration,
    );
    setDestinationError(destinationError);
    setDurationError(durationError);
    if (!destinationError && !durationError) {
      const preferenceString = preferences
        .map((preference) => `preferences=${preference}`)
        .join("&");
      const url = `/trip?destination=${destination.mapboxId}&duration=${duration}${preferenceString ? "&" + preferenceString : ""}`;
      router.push(url);
    }
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
          <MotionDiv
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
            className="fixed bottom-0 left-0 z-50 flex h-fit max-h-screen w-full flex-col items-start overflow-hidden rounded-t-xl bg-white shadow-heavy md:w-[568px] md:rounded-xl"
          >
            <header className="sticky top-0 w-full border-b border-gray-200 bg-white px-6 py-4">
              <h3 className="text-lg">Your trip details</h3>
            </header>
            <form
              id="modalForm"
              className="w-full overflow-y-auto"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col gap-8 overflow-y-auto p-6 pb-32">
                <div className="flex flex-col gap-4">
                  <SearchInput
                    label="Where do you want to go?"
                    showLabel
                    destinationValue={destination}
                    setDestinationValue={setSelectedDestination}
                    error={destinationError}
                    required
                  />
                  <Input
                    type="number"
                    inputMode="numeric"
                    value={duration}
                    onChange={(e) => handleDurationChange(e.target.value)}
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
                  <h4>Priorities</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {preferenceOptions.map((preference) => (
                      <Checkbox
                        key={preference}
                        label={preference}
                        checked={preferences.includes(preference)}
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
                <div className="flex w-full grow flex-col">
                  <Button type="submit">Plan</Button>
                </div>
              </div>
            </form>
          </MotionDiv>
        )}
      </AnimatePresence>
    </>
  );
}
