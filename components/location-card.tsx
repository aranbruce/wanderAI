import { useState } from "react";

import Image from "next/image";
import { AnimatePresence } from "framer-motion";

import Button from "@/components/button";
import BackIcon from "@/images/icons/back-icon";
import { LocationProps } from "@/components/trip-content";
import ImageModal from "./image-modal";

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

  const openModal = (photoUri) => {
    setSelectedPhotoUri(photoUri);
    setIsImageModalOpen(true);
  };

  return (
    <>
      <div className="fixed bottom-0 z-30 flex w-full flex-col items-center gap-2 rounded-t-lg bg-white pt-4 shadow-top md:h-screen md:w-96 md:justify-between md:gap-4 md:rounded-none md:pt-20 md:shadow-medium lg:w-[420px]">
        <div className="flex min-h-0 w-full flex-col gap-2 md:gap-3">
          <div className="flex w-full items-start gap-2 px-4 md:px-8">
            <div className="flex w-full flex-col gap-1 md:gap-2">
              {location?.day && (
                <h3 className="text-sm font-semibold text-gray-800">
                  {`Day ${location?.day} - 
                  ${
                    location?.timeOfDay?.charAt(0).toUpperCase() +
                      location?.timeOfDay?.slice(1) || ""
                  }`}
                </h3>
              )}
              <h2 className="w-full text-lg font-semibold">
                {location?.title}
              </h2>
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
              <p className="px-4 leading-6 text-gray-800 md:px-8">
                {location?.description}
              </p>
            ) : (
              <div className="flex w-full flex-col gap-3 px-4 md:px-8">
                <div className="h-5 w-1/2 animate-pulse rounded-md bg-gray-300" />
                <div className="h-5 w-3/4 animate-pulse rounded-md bg-gray-300" />
              </div>
            )}
            <div className="flex w-full snap-x snap-mandatory scroll-pl-6 gap-4 overflow-x-scroll px-4 md:grid md:snap-y md:grid-cols-2 md:overflow-y-scroll md:px-8">
              {location?.isLoaded &&
              location?.photoReferences &&
              location.photoReferences?.length > 0 ? (
                location.photoReferences.map((photoUri) => (
                  <div
                    className="bg-gray-30 relative h-32 w-full min-w-32 snap-start overflow-hidden rounded-xl"
                    key={photoUri}
                  >
                    <Image
                      fill={true}
                      sizes="128px"
                      key={photoUri}
                      src={photoUri}
                      alt="Location image"
                      className="h-full w-full min-w-[120px] cursor-pointer rounded-xl bg-gray-300 object-cover"
                      onClick={() => openModal(photoUri)}
                      priority
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
        <footer className="z-10 grid w-full grid-cols-[0fr_1fr] gap-4 bg-white px-4 py-3 md:px-8 md:py-4">
          <Button variant="secondary" onClick={decreaseTimeOfDay}>
            <BackIcon height="24" width="24" />
          </Button>
          <Button onClick={increaseTimeOfDay}>Next</Button>
        </footer>
      </div>
      {isImageModalOpen && (
        <AnimatePresence>
          <ImageModal
            isModalOpen={isImageModalOpen}
            setIsModalOpen={setIsImageModalOpen}
            selectedPhotoUri={selectedPhotoUri}
          ></ImageModal>
        </AnimatePresence>
      )}
    </>
  );
}
