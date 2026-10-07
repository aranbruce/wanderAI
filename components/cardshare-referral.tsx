"use client";

import posthog from "posthog-js";

interface CardShareReferralProps {
  // Identifies the placement in UTM params and analytics, e.g. "sign_up_modal"
  location: string;
}

export default function CardShareReferral({
  location,
}: CardShareReferralProps) {
  const href = `https://cardshare.ai/?utm_source=wanderai&utm_medium=referral&utm_campaign=${location}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      onClick={() =>
        posthog.capture("cardshare_referral_clicked", { location })
      }
      className="group flex w-full items-center gap-3 rounded-lg border border-gray-200 p-3 text-left outline-hidden transition hover:bg-gray-100 focus-visible:ring-[3px] focus-visible:ring-green-400/40"
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
  );
}
