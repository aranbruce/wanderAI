import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";

import Input from "@/components/input";
import Checkbox from "@/components/checkbox";
import Button from "@/components/button";
import Backdrop from "@/components/backdrop";
import BackIcon from "@/images/icons/back-icon";

export default function SearchModal({
  destination,
  handleDestinationChange,
  duration,
  handleDurationChange,
  preferences,
  handlePreferenceChange,
  setIsSearchModalOpen,
}) {
  function handleModalClose() {
    console.log("handleModalClose");
    setIsSearchModalOpen(false);
    document.body.style.overflow = "auto";
    document.body.style.height = "auto";
  }

  const router = useRouter();
  const isLargeScreen = useMediaQuery({ query: "(min-width: 768px)" });

  function handleSubmit(e) {
    if (destination && duration) {
      e.preventDefault();
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
      const preferenceString = preferences
        .map((preference) => `preferences=${preference}`)
        .join("&");
      const url = `/trip?destination=${destination}&duration=${duration}&${preferenceString}`;
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
    <Backdrop onClick={() => handleModalClose()}>
      <motion.div
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
        className="shadow-heavy fixed bottom-0 left-0 z-50 flex h-fit max-h-screen w-full flex-col items-start overflow-hidden rounded-t-xl bg-white md:bottom-1/2 md:left-1/2 md:w-[568px] md:-translate-x-1/2 md:-translate-y-1/2 md:transform md:rounded-xl"
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
              <Input
                type="text"
                inputMode="text"
                value={destination}
                onChange={(e) => handleDestinationChange(e.target.value)}
                placeholder="Enter your destination"
                label="Where do you want to go?"
                required
              />
              <Input
                type="number"
                inputMode="numeric"
                value={duration}
                onChange={(e) => handleDurationChange(e.target.value)}
                placeholder="Enter your trip duration"
                label="How many days is your trip?"
                required
              />
            </div>
            <div className="flex flex-col gap-4">
              <h4>Priorities</h4>
              <div className="grid grid-cols-2 gap-2">
                <Checkbox
                  label="Food"
                  checked={preferences.includes("Food")}
                  onChange={() => handlePreferenceChange("Food")}
                />
                <Checkbox
                  label="Culture"
                  checked={preferences.includes("Culture")}
                  onChange={() => handlePreferenceChange("Culture")}
                />
                <Checkbox
                  label="Outdoors"
                  checked={preferences.includes("Outdoors")}
                  onChange={() => handlePreferenceChange("Outdoors")}
                />
                <Checkbox
                  label="Indoors"
                  checked={preferences.includes("Indoors")}
                  onChange={() => handlePreferenceChange("Indoors")}
                />
                <Checkbox
                  label="Active"
                  checked={preferences.includes("Active")}
                  onChange={() => handlePreferenceChange("Active")}
                />
                <Checkbox
                  label="Relaxation"
                  checked={preferences.includes("Relaxation")}
                  onChange={() => handlePreferenceChange("Relaxation")}
                />
                <Checkbox
                  label="Pet friendly"
                  checked={preferences.includes("Pet friendly")}
                  onChange={() => handlePreferenceChange("Pet friendly")}
                />
                <Checkbox
                  label="Child friendly"
                  checked={preferences.includes("Child friendly")}
                  onChange={() => handlePreferenceChange("Child friendly")}
                />
                <Checkbox
                  label="Vegetarian"
                  checked={preferences.includes("Vegetarian")}
                  onChange={() => handlePreferenceChange("Vegetarian")}
                />
                <Checkbox
                  label="Vegan"
                  checked={preferences.includes("Vegan")}
                  onChange={() => handlePreferenceChange("Vegan")}
                />
                <Checkbox
                  label="Nightlife"
                  checked={preferences.includes("Nightlife")}
                  onChange={() => handlePreferenceChange("Nightlife")}
                />
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
              <Button type="submit">Plan</Button>
            </div>
          </div>
        </form>
      </motion.div>
    </Backdrop>
  );
}
