import { useEffect, useRef, useState } from "react";

import Button from "@/components/button";
import Backdrop from "@/components/backdrop";
import { AnimatePresence, motion } from "framer-motion";
import BackIcon from "@/images/icons/back-icon";
import NextIcon from "@/images/icons/next-icon";
import CloseIcon from "@/images/icons/close-icon";

interface ImageModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  photoUrls: string[];
  selectedPhotoIndex: number;
}

export default function ImageModal({
  isModalOpen,
  setIsModalOpen,
  photoUrls,
  selectedPhotoIndex,
}: ImageModalProps) {
  const [currentIndex, setCurrentIndex] = useState(selectedPhotoIndex);

  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const isInitialLoad = useRef(true);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

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

  useEffect(() => {
    isInitialLoad.current = true;

    setCurrentIndex(selectedPhotoIndex);
  }, [selectedPhotoIndex]);

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
    }, 100); // Adjust the debounce delay as needed
  };

  function handleModalClose() {
    setIsModalOpen(false);
  }

  function handleBackClick() {
    setCurrentIndex((prev) => (prev === 0 ? photoUrls.length - 1 : prev - 1));
  }

  function handleNextClick() {
    setCurrentIndex((prev) => (prev === photoUrls.length - 1 ? 0 : prev + 1));
  }

  return (
    <>
      <Backdrop onClick={handleModalClose} isModalOpen={isModalOpen} />
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            key="image-modal"
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
            <div className="absolute right-2 top-2 z-50 flex h-10 w-10 flex-col items-center justify-center md:right-4 md:top-4">
              <Button
                aria-label="Close image modal"
                // className="absolute right-2 top-2 z-50 flex h-10 w-10 flex-col items-center justify-center rounded-full border border-gray-200 bg-white text-black hover:bg-gray-100 active:bg-gray-200 md:right-4 md:top-4"
                onClick={handleModalClose}
                variant="secondary"
                size="small"
                isCircular
              >
                <CloseIcon height="24" width="24" />
              </Button>
            </div>
            <div
              className="flex h-full w-full snap-x snap-mandatory flex-row overflow-x-scroll bg-black"
              onScroll={handleScroll}
            >
              {photoUrls.map((photoUri, index) => (
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
            <div className="absolute left-2 top-1/2 z-50 md:left-4">
              <Button
                aria-label="Previous image"
                onClick={handleBackClick}
                variant="secondary"
                isCircular
              >
                <BackIcon height="24" width="24" />
              </Button>
            </div>
            <div className="absolute right-2 top-1/2 z-50 md:right-4">
              <Button
                aria-label="Next image"
                variant="secondary"
                isCircular
                onClick={handleNextClick}
              >
                <NextIcon height="24" width="24" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
