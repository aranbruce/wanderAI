"use client";

import Link from "next/link";
import Button from "@/components/button";
import Image from "next/image";
import useScrollHandler from "@/hooks/useScrollHandler";

interface NavigationProps {
  hideButton?: boolean;
}

const Navigation = ({ hideButton }: NavigationProps) => {
  const scrolled = useScrollHandler();

  return (
    <nav
      className={`fixed top-0 z-30 flex w-full justify-center px-3 py-2 transition-all duration-150 ease-in-out md:px-6 ${scrolled && "bg-white shadow-sm"}`}
    >
      <div className="flex w-full items-center justify-between">
        <Link href="/" className="h-8">
          <Image
            src="./logo.svg"
            alt="WanderAI Logo"
            width={146}
            height={30}
            priority
          />
        </Link>
        {!hideButton && (
          <Button href="/sign-up" size="small">
            Sign up
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
