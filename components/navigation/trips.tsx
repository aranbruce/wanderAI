"use client";

import Link from "next/link";
import Logo from "@/images/logo";
import SearchSummary from "@/components/search-summary";

import { useTrip } from "@/app/providers/trip-context";
export default function Navigation() {
  const { tripQuery, tripItineraryIsLoading } = useTrip();

  return (
    <nav className="absolute top-0 z-40 flex w-full justify-center from-white px-3 py-2 transition-all duration-150 ease-in-out md:px-6">
      <div className="flex w-full items-center justify-between gap-2">
        <Link href="/">
          <Logo />
        </Link>
        {!tripItineraryIsLoading &&
          tripQuery?.destination?.name &&
          tripQuery?.duration &&
          tripQuery?.preferences && (
            <SearchSummary
              destination={{ name: tripQuery.destination.name }}
              duration={tripQuery.duration}
              preferences={tripQuery.preferences}
            />
          )}
      </div>
    </nav>
  );
}
