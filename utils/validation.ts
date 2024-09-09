// utils/validation.ts

import { Destination } from "@/components/search-input";

export interface ValidationErrors {
  destinationError: string | null;
  durationError: string | null;
}

export function validateForm(
  destination: Destination | null,
  duration: number | null,
): ValidationErrors {
  let destinationError: string | null = null;
  let durationError: string | null = null;

  if (!destination) {
    destinationError = "Enter a destination";
  }

  const durationNumber = Number(duration);
  if (!duration || durationNumber === 0) {
    durationError = "Enter a valid duration";
  } else if (durationNumber > 14) {
    durationError = "Maximum duration is 14 days";
  } else if (durationNumber < 1) {
    durationError = "Minimum duration is 1 day";
  }

  return { destinationError, durationError };
}
