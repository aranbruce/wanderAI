"use client";

import { useEffect, useState } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { AnimatePresence } from "framer-motion";

import Button from "@/components/button";
import Input from "@/components/input";
import SearchModal from "@/components/search-modal";
import SearchInput, { Destination } from "@/components/search-input";

export default function SearchForm() {
  const [destination, setDestination] = useLocalStorage<Destination | null>(
    "destination",
    null,
  );
  const [duration, setDuration] = useLocalStorage("duration", "");
  const [preferences, setPreferences] = useLocalStorage("preferences", []);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  useEffect(() => {
    console.log("destination", destination);
  }, [destination]);

  function handleDestinationChange(newDestination: Destination) {
    setDestination(newDestination);
  }

  function handleDurationChange(newDuration: string) {
    setDuration(newDuration);
  }

  function handlePreferenceChange(changedPreference: string) {
    if (preferences.includes(changedPreference)) {
      setPreferences(
        preferences.filter((preference) => preference !== changedPreference),
      );
    } else {
      setPreferences([...preferences, changedPreference]);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (destination && duration && duration !== "0") {
      setIsSearchModalOpen(true);
    }
  }

  return (
    <>
      <div className="mt-12 flex w-full flex-col items-center gap-8 rounded-3xl bg-[linear-gradient(180deg,rgba(0,0,0,0.10)0%,rgba(33,35,44,0.70)100%),url('/assets/mountains.jpg')] bg-cover bg-bottom px-6 py-16 shadow-heavy sm:px-10 sm:py-16 md:mt-0 md:px-12 md:py-48">
        <div className="flex flex-col items-center gap-6 text-pretty text-center text-white">
          <h1 className="text-4xl md:text-7xl">Love travel, hate planning?</h1>
          <p className="text-lg font-normal">
            Plan your next adventure in seconds through the power of AI
          </p>
        </div>
        <div className="flex w-full max-w-3xl flex-col items-start gap-2 rounded-2xl bg-white p-4 shadow-heavy md:p-6">
          <form
            id="cardForm"
            className="flex w-full flex-col gap-x-4 gap-y-6 md:grid md:grid-cols-[1fr,1fr,120px] md:items-end md:gap-4"
            onSubmit={handleSubmit}
          >
            <SearchInput
              label="Where do you want to go?"
              showLabel
              destinationValue={destination}
              setDestinationValue={handleDestinationChange}
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
              min={1}
              max={14}
              required
            />
            <Button type="submit">Plan trip</Button>
          </form>
        </div>
      </div>
      <SearchModal
        isModalOpen={isSearchModalOpen}
        setIsModalOpen={setIsSearchModalOpen}
        destination={destination}
        setSelectedDestination={handleDestinationChange}
        duration={duration}
        handleDurationChange={handleDurationChange}
        preferences={preferences}
        handlePreferenceChange={handlePreferenceChange}
      />
    </>
  );
}
