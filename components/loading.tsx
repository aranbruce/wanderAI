"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import LogoIcon from "@/images/icons/logo-icon";

export default function Loading() {
  const [activeTextIndex, setActiveTextIndex] = useState(0);

  const animationTime = 3.5;

  useEffect(() => {
    const interval = setInterval(() => {
      activeTextIndex === 2
        ? setActiveTextIndex(0)
        : setActiveTextIndex(activeTextIndex + 1);
    }, animationTime * 1000);
    return () => clearInterval(interval);
  }, [activeTextIndex]);

  const animation = {
    opacity: [0, 1, 0],
    transition: {
      duration: animationTime,
      times: [0, 0.8, 1],
      repeat: Infinity,
    },
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex w-full flex-col items-center gap-4">
        <LogoIcon height="120" width="120" />
        {activeTextIndex === 0 ? (
          <motion.div className="opacity-0" animate={animation}>
            <h4>Searching the internet for locations</h4>
          </motion.div>
        ) : activeTextIndex === 1 ? (
          <motion.div className="opacity-0" animate={animation}>
            <h4>Checking them for suitability</h4>
          </motion.div>
        ) : activeTextIndex === 2 ? (
          <motion.div className="opacity-0" animate={animation}>
            <h4>Creating your trip itinerary</h4>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}
