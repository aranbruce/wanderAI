import Backdrop from "@/components/backdrop";
import Button from "@/components/button";
import { AnimatePresence } from "framer-motion";
import { MotionDiv } from "./motion";
import posthog from "posthog-js";

const CARDSHARE_URL =
  "https://cardshare.ai/?utm_source=wanderai&utm_medium=referral&utm_campaign=sign_up_modal";

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
            className="shadow-heavy fixed bottom-0 left-1/2 z-50 flex h-fit max-h-screen w-full max-w-[calc(100%-48px)] transform flex-col items-stretch gap-4 overflow-hidden rounded-xl bg-white p-6 text-center text-pretty md:w-[440px]"
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
            <a
              href={CARDSHARE_URL}
              target="_blank"
              rel="noopener"
              onClick={() =>
                posthog.capture("cardshare_referral_clicked", {
                  location: "sign_up_modal",
                })
              }
              className="group flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-left outline-hidden transition hover:bg-gray-100 focus-visible:ring-[3px] focus-visible:ring-green-400/40"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-gray-800">
                  From the makers of WanderAI
                </span>
                <span className="text-sm font-medium">CardShare.ai</span>
                <span className="text-sm text-gray-800">
                  Group greeting cards, generated in seconds, signed in minutes
                </span>
              </div>
              <span
                aria-hidden="true"
                className="ml-auto shrink-0 text-gray-800 transition group-hover:translate-x-0.5"
              >
                →
              </span>
            </a>
          </MotionDiv>
        )}
      </AnimatePresence>
    </>
  );
}
