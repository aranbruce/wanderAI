import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import Image from "next/image";
import Button from "@/components/button";
import BackIcon from "@/images/icons/back-icon";
import { LocationProps } from "@/components/trip-content";

interface LocationCardProps {
  location: LocationProps;
  increaseTimeOfDay: () => void;
  decreaseTimeOfDay: () => void;
}

const LocationCard = ({
  location,
  increaseTimeOfDay,
  decreaseTimeOfDay,
}: LocationCardProps) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

  return (
    <div className="absolute bottom-0 z-10 flex w-full flex-col items-center gap-6 rounded-t-lg bg-white py-6 shadow-lg md:h-screen md:w-96 md:justify-between md:gap-4 md:rounded-none md:px-2 md:pt-20 lg:w-[420px]">
      <div className="flex min-h-0 w-full flex-col gap-3">
        <div className="flex w-full items-center gap-2 px-6">
          <div className="flex w-full flex-col gap-2">
            {location?.day && (
              <h3 className="text-sm font-semibold text-gray-600">
                {`Day ${location?.day} - 
                  ${
                    location?.timeOfDay?.charAt(0).toUpperCase() +
                    location?.timeOfDay?.slice(1)
                  }`}
              </h3>
            )}
            <h2 className="w-full text-lg font-semibold">{location?.title}</h2>
          </div>
          {location.rating && (
            <div className="flex items-center justify-end gap-1">
              <p className="text-base font-semibold text-green-600">
                {location?.rating}
              </p>
              <Image
                src="/assets/star.svg"
                alt="Star Icon"
                width={24}
                height={24}
                priority
              />
            </div>
          )}
        </div>
        <div className="flex w-full flex-col gap-4">
          <p className="px-6 leading-6 text-gray-800">
            {location?.description}
          </p>
          <div className="flex w-full snap-x snap-mandatory scroll-pl-6 gap-4 overflow-x-scroll px-6 md:grid md:snap-y md:grid-cols-2 md:overflow-y-scroll">
            {location?.photoReferences ? (
              location?.photoReferences.map((photoRef) => (
                <Image
                  width={128}
                  height={128}
                  key={photoRef}
                  src={`https://maps.googleapis.com/maps/api/place/photo?photo_reference=${photoRef}&maxheight=1600&key=${apiKey}`}
                  alt="Location image"
                  className="min-w-[120px] rounded-xl bg-gray-300 object-cover"
                />
              ))
            ) : (
              <>
                <Skeleton
                  count={1}
                  height={128}
                  containerClassName="h-32 snap-start w-full rounded-xl object-cover min-w-[128px] bg-gray-300 leading-4 overflow-hidden"
                />
                <Skeleton
                  count={1}
                  height={128}
                  containerClassName="h-32 snap-start w-full rounded-xl object-cover min-w-[128px] bg-gray-300 leading-4 overflow-hidden"
                />
                <Skeleton
                  count={1}
                  height={128}
                  containerClassName="h-32 snap-start w-full rounded-xl object-cover min-w-[128px] bg-gray-300 leading-4 overflow-hidden"
                />
                <Skeleton
                  count={1}
                  height={128}
                  containerClassName="h-32 snap-start w-full rounded-xl object-cover min-w-[128px] bg-gray-300 leading-4 overflow-hidden"
                />
              </>
            )}
          </div>
        </div>
      </div>
      <footer className="grid w-full grid-cols-[0fr_1fr] gap-4 px-6">
        <Button variant="secondary" onClick={decreaseTimeOfDay}>
          <BackIcon height="24" width="24" />
        </Button>
        <Button onClick={increaseTimeOfDay}>Next</Button>
      </footer>
    </div>
  );
};

export default LocationCard;
