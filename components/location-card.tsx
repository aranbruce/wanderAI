import Image from "next/image";
import Button from "@/components/button";
import BackIcon from "@/images/icons/back-icon";
import { LocationProps } from "@/components/trip-content";

interface LocationCardProps {
  location: LocationProps;
  increaseTimeOfDay: () => void;
  decreaseTimeOfDay: () => void;
}

export default function LocationCard({
  location,
  increaseTimeOfDay,
  decreaseTimeOfDay,
}: LocationCardProps) {
  return (
    <div className="fixed bottom-0 z-30 flex w-full flex-col items-center gap-4 rounded-t-lg bg-white pt-6 shadow-medium md:h-screen md:w-96 md:justify-between md:gap-4 md:rounded-none md:pt-20 lg:w-[420px]">
      <div className="flex min-h-0 w-full flex-col gap-3">
        <div className="flex w-full items-center gap-2 px-6 md:px-8">
          <div className="flex w-full flex-col gap-2">
            {location?.day && (
              <h3 className="text-sm font-semibold text-gray-800">
                {`Day ${location?.day} - 
                  ${
                    location?.timeOfDay?.charAt(0).toUpperCase() +
                      location?.timeOfDay?.slice(1) || ""
                  }`}
              </h3>
            )}
            <h2 className="w-full text-lg font-semibold">{location?.title}</h2>
          </div>
          {location?.rating && (
            <div className="flex items-center justify-end gap-1">
              <p className="text-green-600 text-base font-semibold">
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
        <div className="flex min-h-0 w-full flex-col gap-4">
          {location?.description ? (
            <p className="px-6 leading-6 text-gray-800 md:px-8">
              {location?.description}
            </p>
          ) : (
            <div className="flex w-full flex-col gap-3 px-6 md:px-8">
              <div className="h-5 w-1/2 animate-pulse rounded-md bg-gray-300" />
              <div className="h-5 w-3/4 animate-pulse rounded-md bg-gray-300" />
            </div>
          )}
          <div className="flex w-full snap-x snap-mandatory scroll-pl-6 gap-4 overflow-x-scroll px-6 md:grid md:snap-y md:grid-cols-2 md:overflow-y-scroll md:px-8">
            {location?.photoReferences && location?.isLoaded ? (
              location?.photoReferences.map((photoRef) => (
                <div
                  className="bg-gray-30 relative h-32 w-full min-w-32 snap-start overflow-hidden rounded-xl"
                  key={photoRef}
                >
                  <Image
                    fill={true}
                    key={photoRef}
                    src={`https://maps.googleapis.com/maps/api/place/photo?photo_reference=${photoRef}&maxheight=1600&key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}`}
                    alt="Location image"
                    className="h-full w-full min-w-[120px] rounded-xl bg-gray-300 object-cover"
                  />
                </div>
              ))
            ) : (
              <>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-32 w-full min-w-[128px] animate-pulse snap-start overflow-hidden rounded-xl bg-gray-300 object-cover"
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
      <footer className="md:px-8-6 z-10 grid w-full grid-cols-[0fr_1fr] gap-4 bg-white px-6 py-3 md:py-4">
        <Button variant="secondary" onClick={decreaseTimeOfDay}>
          <BackIcon height="24" width="24" />
        </Button>
        <Button onClick={increaseTimeOfDay}>Next</Button>
      </footer>
    </div>
  );
}
