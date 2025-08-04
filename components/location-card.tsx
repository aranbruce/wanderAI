import { useState } from "react";
import dynamic from "next/dynamic";

import Image from "next/image";

import Button from "@/components/button";
import BackIcon from "@/images/icons/back-icon";
import { LocationProps } from "@/components/trip-content";
import LocationImages from "./location-images";

// Lazy load the ImageModal component
const ImageModal = dynamic(() => import("./image-modal"), {
  ssr: false,
});

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
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedPhotoUri, setSelectedPhotoUri] = useState<string | null>(null);

  const openModal = (photoUri: string) => {
    setSelectedPhotoUri(photoUri);
    setIsImageModalOpen(true);
  };

  return (
    <>
      <div className="shadow-top md:shadow-medium bottom-0 z-30 flex w-full flex-col items-center gap-2 rounded-t-lg bg-white pt-4 md:order-1 md:h-screen md:justify-between md:gap-4 md:rounded-none md:pt-20">
        <div className="flex min-h-0 w-full flex-col gap-2 md:gap-3">
          <div className="flex w-full items-start gap-2 px-4 md:px-8">
            <div className="flex w-full flex-col gap-1 md:gap-2">
              {location?.day && (
                <h3 className="text-xs font-medium text-gray-800">
                  {`Day ${location?.day} - 
                  ${
                    location?.timeOfDay?.charAt(0).toUpperCase() +
                      location?.timeOfDay?.slice(1) || ""
                  }`}
                </h3>
              )}
              <h2 className="text-md w-full font-semibold">
                {location?.title}
              </h2>
            </div>
            {location?.rating && (
              <div className="flex flex-col md:gap-1">
                <div className="flex items-center justify-end gap-1">
                  <p className="text-sm font-semibold text-green-600">
                    {location?.rating ? location.rating.toFixed(1) : ""}
                  </p>
                  <Image
                    src="/assets/star.svg"
                    alt="Star Icon"
                    width={16}
                    height={16}
                    priority
                  />
                  {location?.reviewCount && (
                    <p className="w-auto text-xs text-nowrap text-gray-800">
                      ({new Intl.NumberFormat().format(location?.reviewCount)})
                    </p>
                  )}
                </div>
                {location?.priceLevel && (
                  <p className="w-auto text-right text-xs font-semibold text-nowrap">
                    {location?.priceLevel}
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="flex w-full gap-4 px-4 md:px-8">
            {location?.websiteUrl && (
              <a
                href={location?.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="cursor-pointer text-xs font-semibold text-green-500 hover:text-green-400 active:text-green-300"
              >
                View website
              </a>
            )}
            {location?.tripadvisorUrl && (
              <a
                href={location?.tripadvisorUrl}
                target="_blank"
                rel="noreferrer"
                className="cursor-pointer text-xs font-semibold text-green-500 hover:text-green-400 active:text-green-300"
              >
                View on TripAdvisor
              </a>
            )}
          </div>

          <div className="flex min-h-0 w-full flex-col gap-4">
            {location?.description ? (
              <p className="px-4 leading-6 text-gray-800 md:px-8">
                {location?.description}
              </p>
            ) : (
              <div className="flex w-full flex-col gap-3 px-4 md:px-8">
                <div className="h-5 w-1/2 animate-pulse rounded-md bg-gray-300" />
                <div className="h-5 w-3/4 animate-pulse rounded-md bg-gray-300" />
              </div>
            )}
            <LocationImages
              isLoaded={location?.isLoaded}
              photoUrls={location?.photoUrls}
              openModal={openModal}
            />
          </div>
        </div>
        <footer className="z-10 grid w-full grid-cols-[0fr_1fr] gap-4 bg-white px-4 pt-2 pb-3 md:px-8 md:py-4">
          <Button variant="secondary" onClick={decreaseTimeOfDay}>
            <BackIcon height="24" width="24" />
          </Button>
          <Button onClick={increaseTimeOfDay}>Next</Button>
        </footer>
      </div>
      <ImageModal
        isModalOpen={isImageModalOpen}
        setIsModalOpen={setIsImageModalOpen}
        photoUrls={location?.photoUrls}
        selectedPhotoIndex={location?.photoUrls?.indexOf(selectedPhotoUri)}
      ></ImageModal>
    </>
  );
}
