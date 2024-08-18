"use client";

import { useSearchParams } from "next/navigation";

const useGetNewSearchParams = () => {
  const searchParams = useSearchParams();

  const getNewSearchParams = () => {
    const destination = searchParams.get("destination");
    const duration = Number(searchParams.get("duration"));
    const preferences = searchParams.getAll("preferences");
    return { destination, duration, preferences };
  };

  return getNewSearchParams;
};

export default useGetNewSearchParams;
