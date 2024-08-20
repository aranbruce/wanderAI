import Button from "@/components/button";
import Backdrop from "@/components/backdrop";
import { motion } from "framer-motion";

interface SignUpModalProps {
  setIsSignUpModalOpen: (isOpen: boolean) => void;
  isSignUpModalOpen: boolean;
}

export default function SignUpModal({
  setIsSignUpModalOpen,
  isSignUpModalOpen,
}: SignUpModalProps) {
  function handleModalClose() {
    setIsSignUpModalOpen(!isSignUpModalOpen);
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
        className="shadow-heavy fixed bottom-0 left-1/2 z-50 flex h-fit max-h-screen w-full max-w-[calc(100%-48px)] -translate-x-1/2 translate-y-1/2 transform flex-col items-stretch gap-4 overflow-hidden text-pretty rounded-xl bg-white p-6 text-center md:bottom-1/2 md:w-[440px] md:translate-y-1/2"
      >
        <h3 className="text-lg">Create an account to read more and refine</h3>
        <p className="text-center text-gray-800">
          Sign up now to read the full itinerary or refine it further
        </p>
        <div className="flex flex-col gap-4">
          <Button href="/sign-up">Sign up</Button>
        </div>
      </motion.div>
    </Backdrop>
  );
}
