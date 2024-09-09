"use client";

import Link from "next/link";
import Button from "@/components/button";
import Logo from "@/images/logo";

export default function Navigation() {
  return (
    <nav className="absolute top-0 z-40 flex w-full justify-center from-white px-3 py-2 transition-all duration-150 ease-in-out md:px-6">
      <div className="flex w-full items-center justify-between">
        <Link href="/" className="flex h-11 flex-row items-center">
          <Logo />
        </Link>
        <div className="flex gap-2">
          <Button href="/sign-in" size="small">
            Sign in
          </Button>
          <Button variant="secondary" href="/sign-up" size="small">
            Sign up
          </Button>
        </div>
      </div>
    </nav>
  );
}