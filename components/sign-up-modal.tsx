import Backdrop from "@/components/backdrop";
import Button from "@/components/button";
import { AnimatePresence } from "framer-motion";
import { MotionDiv } from "./motion";

interface SignUpModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}

export default function SignUpModal({
  isModalOpen,
  setIsModalOpen,
}: SignUpModalProps) {
  function handleModalClose() {
    setIsModalOpen(false);
  }

  return (
    <>
      <Backdrop onClick={handleModalClose} isModalOpen={isModalOpen} />
      <AnimatePresence>
        {isModalOpen && (
          <MotionDiv
            key="sign-up-modal"
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
            className="fixed bottom-0 left-1/2 z-50 flex h-fit max-h-screen w-full max-w-[calc(100%-48px)] -translate-x-1/2 translate-y-1/2 transform flex-col items-stretch gap-4 overflow-hidden text-pretty rounded-xl bg-white p-6 text-center shadow-heavy md:bottom-1/2 md:w-[440px] md:translate-y-1/2"
          >
            <h3 className="text-lg">
              Create an account to read more and refine
            </h3>
            <p className="text-center text-gray-800">
              Sign up now to read the full itinerary or refine it further
            </p>
            <div className="flex flex-col gap-4">
              <Button href="/sign-up">Sign up</Button>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </>
  );
}
