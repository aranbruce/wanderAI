"use client";
import { useState } from "react";

import Logo from "@/images/logo";
import Input from "@/components/input";
import Link from "next/link";
import Button from "./button";
import CloseIcon from "@/images/icons/close-icon";

export default function RefineNavigation() {
  const [isFullScreen, setIsFullScreen] = useState(false);

  function handleInputClick() {
    setIsFullScreen(true);
  }

  function handleCloseClick() {
    setIsFullScreen(false);
  }

  return (
    <nav
      className={`absolute left-0 right-0 top-0 z-40 flex flex-col items-start px-4 py-2 md:left-96 lg:left-[420px] ${
        isFullScreen ? "h-screen w-screen bg-white" : ""
      }`}
    >
      <div className="flex w-full flex-row items-center gap-4 transition">
        <Link
          href="/"
          className={`transition ${isFullScreen ? "hidden" : "display"}`}
        >
          <Logo fullLogo={false} width={32} />
        </Link>
        <Button variant="secondary" onClick={handleInputClick}>
          Refine your search
        </Button>
        {isFullScreen && (
          <Button
            size="small"
            variant="tertiary"
            iconOnly
            onClick={handleCloseClick}
          >
            <CloseIcon />
          </Button>
        )}
      </div>
    </nav>
  );
}
