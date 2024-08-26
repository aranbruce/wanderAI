import { useEffect, useRef, useState } from "react";

import Button from "@/components/button";
import Backdrop from "@/components/backdrop";
import { motion } from "framer-motion";
import BackIcon from "@/images/icons/back-icon";
import NextIcon from "@/images/icons/next-icon";
import CloseIcon from "@/images/icons/close-icon";

interface ImageModalProps {
  setIsModalOpen: (isOpen: boolean) => void;
  photoUris: string[];
  selectedPhotoIndex: number;
}

export default function ImageModal({
  setIsModalOpen,
  photoUris,
  selectedPhotoIndex,
}: ImageModalProps) {
  const [currentIndex, setCurrentIndex] = useState(selectedPhotoIndex);

  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const isInitialLoad = useRef(true);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    console.log("currentIndex", currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    if (imageRefs.current[currentIndex]) {
      imageRefs.current[currentIndex]?.scrollIntoView({
        behavior: isInitialLoad.current ? "auto" : "smooth",
        block: "nearest",
        inline: "center",
      });
      isInitialLoad.current = false;
    }
  }, [currentIndex]);

  const handleScroll = (event) => {
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    scrollTimeout.current = setTimeout(() => {
      const { scrollLeft, clientWidth } = event.target;
      const newIndex = Math.round(scrollLeft / clientWidth);
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
      }
    }, 50); // Adjust the debounce delay as needed
  };

  function handleModalClose() {
    setIsModalOpen(false);
  }

  function handleBackClick() {
    setCurrentIndex((prev) => (prev === 0 ? photoUris.length - 1 : prev - 1));
  }

  function handleNextClick() {
    setCurrentIndex((prev) => (prev === photoUris.length - 1 ? 0 : prev + 1));
  }

  return (
    <Backdrop onClick={handleModalClose}>
      <motion.div
        initial={{
          opacity: 0,
          left: "50%",
          top: "100%",
          transform: "translate(-50%, 0%)",
        }}
        animate={{
          opacity: 1,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        exit={{
          opacity: 0,
          left: "50%",
          top: "100%",
          transform: "translate(-50%, -0%)",
        }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
        className="fixed bottom-0 left-1/2 z-50 flex h-full w-full translate-x-1/2 translate-y-1/2 transform flex-col items-stretch gap-4 overflow-hidden text-pretty bg-white text-center shadow-heavy md:bottom-1/2 md:max-h-[calc(100%-32px)] md:w-[960px] md:max-w-[calc(100%-32px)] md:translate-y-1/2 md:rounded-xl"
      >
        <Button
          aria-label="Close image modal"
          className="absolute right-2 top-2 z-50 flex h-10 w-10 flex-col items-center justify-center rounded-full border border-gray-200 bg-white text-black hover:bg-gray-100 active:bg-gray-200 md:right-4 md:top-4"
          onClick={handleModalClose}
        >
          <CloseIcon height="24" width="24" />
        </Button>
        <div
          className="flex h-full w-full snap-x snap-mandatory flex-row overflow-x-scroll bg-black"
          onScroll={handleScroll}
        >
          {photoUris.map((photoUri, index) => (
            <img
              key={photoUri}
              src={photoUri}
              alt="Location image"
              ref={(el) => {
                imageRefs.current[index] = el;
              }}
              className="h-full w-full shrink-0 snap-start bg-black object-contain"
            />
          ))}
        </div>
        {/* // Add navigation buttons */}
        <Button
          aria-label="Previous image"
          className="absolute left-2 top-1/2 z-50 flex h-10 w-10 flex-col items-center justify-center rounded-full border border-gray-200 bg-white text-black hover:bg-gray-100 active:bg-gray-200 md:left-4"
          onClick={handleBackClick}
        >
          <BackIcon height="24" width="24" />
        </Button>
        <Button
          aria-label="Next image"
          className="absolute right-2 top-1/2 z-50 flex h-10 w-10 flex-col items-center justify-center rounded-full border border-gray-200 bg-white text-black hover:bg-gray-100 active:bg-gray-200 md:right-4"
          onClick={handleNextClick}
        >
          <NextIcon height="24" width="24" />
        </Button>
      </motion.div>
    </Backdrop>
  );
}
