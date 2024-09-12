"use client";

import { useState } from "react";

import { useTrip } from "@/app/providers/trip-context";
import { validateForm, ValidationErrors } from "@/utils/validation";

import Button from "@/components/button";
import Input from "@/components/input";
import SearchModal from "@/components/search-modal";
import SearchInput, { Destination } from "@/components/search-input";
import SearchIcon from "@/images/icons/search-icon";

export default function SearchForm() {
  const { tripQuery, setTripQuery } = useTrip();

  const [destinationError, setDestinationError] = useState<string | null>(null);
  const [durationError, setDurationError] = useState<string | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  function setSelectedDestination(newDestination: Destination) {
    setTripQuery((prevTripQuery) => ({
      ...prevTripQuery,
      destination: newDestination,
    }));
    setDestinationError(null);
  }

  function handleDurationChange(newDuration: number) {
    setTripQuery((prevTripQuery) => ({
      ...prevTripQuery,
      duration: newDuration,
    }));
    setDurationError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { destinationError, durationError }: ValidationErrors = validateForm(
      tripQuery.destination,
      tripQuery.duration,
    );

    setDestinationError(destinationError);
    setDurationError(durationError);

    if (!destinationError && !durationError) {
      setIsSearchModalOpen(true);
    }
  }

  return (
    <>
      <div className="mt-12 flex w-full flex-col items-center gap-8 rounded-3xl bg-[linear-gradient(180deg,rgba(0,0,0,0.10)0%,rgba(33,35,44,0.70)100%),url('/assets/mountains.jpg')] bg-cover bg-bottom px-6 pb-8 pt-16 shadow-heavy sm:px-10 sm:pb-12 sm:pt-16 md:px-12 md:pb-24 md:pt-48">
        <div className="flex flex-col items-center gap-6 text-pretty text-center text-white">
          <h1 className="text-4xl md:text-7xl">Love travel, hate planning?</h1>
          <p className="text-lg font-normal">
            Plan your next adventure in seconds through the power of AI
          </p>
        </div>
        <div className="flex w-full max-w-3xl flex-col items-start gap-2 rounded-2xl bg-white p-4 shadow-heavy md:p-6 md:pb-8">
          <form
            id="cardForm"
            className="flex w-full flex-col gap-x-4 gap-y-6 md:grid md:grid-cols-[1fr,1fr,130px] md:items-end md:gap-4"
            onSubmit={handleSubmit}
          >
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
              onChange={(e) => handleDurationChange(Number(e.target.value))}
              placeholder="Enter your trip duration"
              label="How many days is your trip?"
              error={durationError}
              showLabel
              min={1}
              max={14}
              required
            />
            <Button type="submit">
              <SearchIcon height="20" width="20" />
              Plan trip
            </Button>
          </form>
        </div>
        <div className="flex flex-col items-center gap-2">
          <h5 className="mt-4 text-center text-sm font-medium text-white">
            Support us on Product Hunt
          </h5>
          <a
            href="https://www.producthunt.com/posts/wanderai-2?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-wanderai&#0045;2"
            target="_blank"
          >
            <img
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=484286&theme=neutral"
              alt="WanderAI - Plan&#0032;your&#0032;next&#0032;trip&#0032;in&#0032;seconds&#0032;with&#0032;the&#0032;power&#0032;of&#0032;AI | Product Hunt"
              style={{ width: "185px", height: "40px" }}
              width="185"
              height="40"
            />
          </a>
        </div>
      </div>
      <SearchModal
        isModalOpen={isSearchModalOpen}
        setIsModalOpen={setIsSearchModalOpen}
      />
    </>
  );
}
