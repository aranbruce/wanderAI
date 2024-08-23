import Image from "next/image";

import Button from "@/components/button";
import Backdrop from "@/components/backdrop";
import { motion } from "framer-motion";

interface ImageModalProps {
  setIsModalOpen: (isOpen: boolean) => void;
  isModalOpen: boolean;
  selectedPhotoUri?: string;
}

export default function ImageModal({
  setIsModalOpen,
  isModalOpen,
  selectedPhotoUri,
}: ImageModalProps) {
  function handleModalClose() {
    setIsModalOpen(!isModalOpen);
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
        className="fixed bottom-0 left-1/2 z-50 flex h-full max-h-[calc(100%-24px)] w-full max-w-[calc(100%-24px)] -translate-x-1/2 translate-y-1/2 transform flex-col items-stretch gap-4 overflow-hidden text-pretty rounded-xl bg-white p-6 text-center shadow-heavy md:bottom-1/2 md:w-[960px] md:translate-y-1/2"
      >
        <Button
          className="absolute right-2 top-2 z-50 flex h-10 w-10 flex-col items-center justify-center rounded-full border border-gray-200 bg-white text-black hover:bg-gray-100 active:bg-gray-200 md:right-4 md:top-4"
          onClick={() => setIsModalOpen(false)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 7L17 17M7 17L17 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>

        <Image
          fill={true}
          key={selectedPhotoUri}
          src={selectedPhotoUri}
          alt="Location image"
          className="h-full w-full min-w-[120px] rounded-xl bg-gray-300 object-cover"
          onClick={() => setIsModalOpen(true)}
        />
      </motion.div>
    </Backdrop>
  );
}
