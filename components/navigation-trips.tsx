"use client";

import Link from "next/link";
import Logo from "@/images/logo";
import SearchSummary from "@/components/search-summary";

import { useTrip } from "@/app/providers/trip-context";
import RefineSearch from "./refine-search";
export default function Navigation() {
  const { tripQuery, tripItineraryIsLoading } = useTrip();

  return (
    <nav className="absolute top-0 z-40 flex w-full justify-center from-white px-3 py-2 transition-all duration-150 ease-in-out md:px-6">
      <div className="flex w-full items-start justify-between gap-2 sm:gap-4">
        <Link className="flex h-11 items-center" href="/">
          <Logo />
        </Link>
        <div className="hidden w-full md:contents">
          {!tripItineraryIsLoading &&
            tripQuery?.destination?.name &&
            tripQuery?.duration &&
            tripQuery?.preferences && (
              <SearchSummary
                destination={tripQuery.destination}
                duration={tripQuery.duration}
                preferences={tripQuery.preferences}
              />
            )}
        </div>
        <div className="contents w-full md:hidden">
          {!tripItineraryIsLoading &&
            tripQuery?.destination?.name &&
            tripQuery?.duration &&
            tripQuery?.preferences && (
              <RefineSearch
                destination={tripQuery.destination}
                duration={tripQuery.duration}
              />
            )}
        </div>
      </div>
    </nav>
  );
}
