"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { Destination } from "@/components/search-input";
import { set } from "zod";

interface TripQuery {
  tripId: string;
  destination: Destination;
  duration: number;
  preferences: string[];
}

interface TripContextType {
  tripQuery: TripQuery | null;
  setTripQuery: React.Dispatch<React.SetStateAction<TripQuery | null>>;
  tripItinerary: any[];
  setTripItinerary: React.Dispatch<React.SetStateAction<any[]>>;
  tripItineraryIsLoading: boolean;
  setTripItineraryIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: React.ReactNode }) {
  const [tripQuery, setTripQuery] = useState<TripQuery | null>(null);
  const [tripItinerary, setTripItinerary] = useState<any[]>([]);
  const [tripItineraryIsLoading, setTripItineraryIsLoading] = useState(false);

  useEffect(() => {
    const storedTrip = localStorage.getItem("trip");
    if (storedTrip) {
      const parsedTrip = JSON.parse(storedTrip);
      setTripQuery(parsedTrip);
    }
  }, []);

  useEffect(() => {
    if (tripQuery) {
      localStorage.setItem("trip", JSON.stringify(tripQuery));
    }
  }, [tripQuery]);

  return (
    <TripContext.Provider
      value={{
        tripQuery,
        setTripQuery,
        tripItinerary,
        setTripItinerary,
        tripItineraryIsLoading,
        setTripItineraryIsLoading,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error("useTrip must be used within a TripProvider");
  }
  return context;
}
