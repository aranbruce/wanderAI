"use client";

import { useState, useEffect } from "react";

import useLocalStorage from "@/hooks/useLocalStorage";
import { AnimatePresence } from "framer-motion";

import Section from "@/components/section";
import Input from "@/components/input";
import Button from "@/components/button";
import SearchModal from "@/components/search-modal";
import TextAndImage from "@/components/text-and-image";
import SignUpCard from "@/components/sign-up-card";
import ExampleTripCard from "@/components/example-trip-card";
import TestimonialCard from "@/components/testimonial-card";

const Home = () => {
  const [destination, setDestination] = useLocalStorage("destination", "");
  const [duration, setDuration] = useLocalStorage("duration", "");
  const [preferences, setPreferences] = useLocalStorage("preferences", []);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "auto";
    document.body.style.height = "auto";
  }, []);

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
  };

  const handleDurationChange = (e) => {
    setDuration(e.target.value);
  };

  const handlePreferenceChange = (changedPreference) => {
    if (preferences.includes(changedPreference)) {
      setPreferences(
        preferences.filter((preference) => preference !== changedPreference),
      );
    } else {
      setPreferences([...preferences, changedPreference]);
    }
  };

  const handleSubmit = (e) => {
    if (destination && duration) {
      e.preventDefault();
      setIsSearchModalOpen(true);
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
    }
  };

  return (
    <main className="min-h-screen">
      <Section isHero>
        <div className="mt-12 flex w-full max-w-5xl flex-col items-center gap-8 rounded-3xl bg-[linear-gradient(180deg,rgba(0,0,0,0.10)0%,rgba(33,35,44,0.70)100%),url('/assets/mountains.jpg')] bg-cover bg-bottom px-8 py-12 shadow-lg sm:px-10 sm:py-16 md:px-12 md:py-32">
          <div className="flex flex-col items-center gap-6 text-pretty text-center text-white">
            <h1 className="text-4xl md:text-6xl">
              Love travel, hate planning?
            </h1>
            <p className="text-lg">
              Plan your next adventure in seconds through the power of AI
            </p>
          </div>
          <div className="flex w-full max-w-3xl flex-col items-start gap-2 rounded-2xl bg-white p-6 shadow-2xl">
            <form
              id="cardForm"
              className="flex w-full flex-col gap-x-4 gap-y-6 md:flex-row md:items-end md:gap-4"
              onSubmit={handleSubmit}
            >
              <Input
                type="text"
                value={destination}
                inputMode="text"
                onChange={handleDestinationChange}
                placeholder="Enter your destination"
                label="Where do you want to go?"
                required
              />
              <Input
                type="number"
                inputMode="numeric"
                value={duration}
                onChange={handleDurationChange}
                placeholder="Enter your trip duration"
                label="How many days is your trip?"
                required
              />
              <Button type="submit">Plan trip</Button>
            </form>
          </div>
        </div>
      </Section>
      <Section>
        <div className="flex flex-col items-center gap-2 text-center">
          <h5 className="leading-5 text-green-400">How it works</h5>
          <h2 className="text-3xl md:text-4xl">Adventure awaits</h2>
        </div>
        <div className="flex flex-col items-center gap-16">
          <TextAndImage
            title="Enter your destination and get an itinerary in seconds"
            description="Simply fill in where you are looking to go, how long for and your personal preferences. WanderAI will then generate a full itinerary for your trip in seconds"
            imgSrc="/assets/howItWorks1.svg"
            imgAlt="Card showing the destination and duration input fields"
          />
          <TextAndImage
            title="Read your itinerary and refine your trip"
            description="Read through your planned itinerary, suggest changes and our AI powered trip planner will instantly create amendments so you can be sure to have a trip that suits your interests"
            imgSrc="/assets/howItWorks2.svg"
            imgAlt="Card showing itinerary to for a morning in New York"
            classNames="md:flex-row-reverse"
          />
        </div>
      </Section>
      <Section>
        <div className="flex flex-col items-center gap-2 text-center">
          <h5 className="text-green-400">Example trips</h5>
          <h2 className="text-3xl md:text-4xl">Get inspired</h2>
        </div>
        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2">
          <ExampleTripCard
            location="New York"
            imgSrc="/assets/newYork.png"
            imgAlt="New York skyscrapers"
          />
          <ExampleTripCard
            location="London"
            imgSrc="/assets/london.png"
            imgAlt="London and the River Thames"
          />
          <ExampleTripCard
            location="Dubai"
            imgSrc="/assets/dubai.png"
            imgAlt="Dubai"
          />
          <ExampleTripCard
            location="Santorini"
            imgSrc="/assets/santorini.png"
            imgAlt="Cliffs of Santorini"
          />
        </div>
      </Section>
      <Section>
        <div className="flex flex-col items-center gap-2 text-center">
          <h5 className="text-green-400">Reviews</h5>
          <h2 className="text-3xl md:text-4xl">
            Read what our users are saying
          </h2>
        </div>
        <div className="mx-auto grid grid-cols-1 gap-8 md:grid-cols-2">
          <TestimonialCard
            imgSrc="/assets/testimonial1.png"
            testimonial="“Fast, seamless and effortlessly intuitive. WanderAI makes holiday inspiration a breeze”"
            author="Phil - WanderAI User"
          />
          <TestimonialCard
            imgSrc="/assets/testimonial2.png"
            testimonial="“Using WanderAI made planning my holiday a lot easier. I'd never visited Naxos before, but now I've got lots of ideas of places to go - and things to eat”"
            author="Will - WanderAI User"
          />
        </div>
      </Section>
      <Section>
        <SignUpCard />
      </Section>
      <AnimatePresence>
        {isSearchModalOpen && (
          <SearchModal
            setIsSearchModalOpen={setIsSearchModalOpen}
            destination={destination}
            handleDestinationChange={handleDestinationChange}
            duration={duration}
            handleDurationChange={handleDurationChange}
            preferences={preferences}
            handlePreferenceChange={handlePreferenceChange}
          />
        )}
      </AnimatePresence>
    </main>
  );
};

export default Home;
