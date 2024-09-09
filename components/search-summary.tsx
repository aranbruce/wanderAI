"use client";

import { useState } from "react";

import Button from "@/components/button";
import SearchIcon from "@/images/icons/search-icon";

interface SearchSummaryProps {
  destination: any;
  duration: number;
  preferences: string[];
}

export default function SearchSummary({
  destination,
  duration,
  preferences,
}: SearchSummaryProps) {
  return (
    <div className="margin-x-auto flex w-full flex-col items-center md:w-[calc(100%-384px)] lg:w-[calc(100%-420px)]">
      <div
        onClick={() => {
          console.log("Book trip");
        }}
        className="z-10 flex w-full max-w-96 cursor-pointer flex-row items-center justify-between gap-2 rounded-full border border-gray-300 bg-white py-[3px] pl-3 pr-1 text-center text-sm font-medium shadow-medium"
      >
        <div className="line-clamp-1 w-full">{destination?.name}</div>
        <div className="h-5 w-[1px] border-l border-gray-300"></div>
        <div className="line-clamp-1 w-full">
          {duration} {duration === 1 ? "day" : "days"}
        </div>
        <div className="h-5 w-[1px] border-r border-gray-300"></div>

        <div className="line-clamp-1 w-full">
          {preferences?.length}{" "}
          {preferences?.length > 1 ? "preferences" : "preference"}
        </div>
        <Button
          isCircular
          onClick={() => {
            console.log("Book trip");
          }}
        >
          <SearchIcon height="20" width="20" />
        </Button>
      </div>
    </div>
  );
}
