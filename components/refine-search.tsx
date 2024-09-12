"use client";

import Button from "@/components/button";
import SearchIcon from "@/images/icons/search-icon";
import Textarea from "@/components/textarea";

interface RefineSearchProps {
  destination: any;
  duration: number;
}

export default function RefineSearch({
  destination,
  duration,
}: RefineSearchProps) {
  return (
    <div className="relative flex w-full items-center rounded-3xl shadow-heavy md:max-w-xl">
      <Textarea
        label={"Refine your search"}
        placeholder={`Refine your trip to ${destination.name} for ${duration > 1 ? `${duration} days` : `${duration} day`}`}
      />
      <div className="absolute bottom-[6px] right-[6px]">
        <Button variant="primary" isCircular>
          <SearchIcon height="20" width="20" />
        </Button>
      </div>
    </div>
  );
}
