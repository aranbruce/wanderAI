"use client";

import { useSearchParams } from "next/navigation";

export default function useGetNewSearchParams() {
  const searchParams = useSearchParams();

  function getNewSearchParams() {
    const destination = searchParams.get("destination");
    const duration = Number(searchParams.get("duration"));
    const preferences = searchParams.getAll("preferences");
    return { destination, duration, preferences };
  }

  return getNewSearchParams;
}
