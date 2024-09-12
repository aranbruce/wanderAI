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
      <div className="z-10 flex w-full max-w-96 cursor-pointer flex-row items-center justify-between gap-2 rounded-full border border-gray-300 bg-white px-2 py-[0.625rem] text-center text-sm font-medium shadow-medium">
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
      </div>
    </div>
  );
}
