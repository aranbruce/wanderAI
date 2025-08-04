import { z } from "zod";

// Simplified location schema for array output
export const locationItemSchema = z.object({
  id: z.string(),
  coordinates: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  day: z.number(),
  timeOfDay: z.enum(["morning", "afternoon", "evening"]),
  title: z.string(),
  rating: z.number(),
  priceLevel: z.enum(["$", "$$", "$$$", "$$$$"]),
  description: z.string(),
  isLoaded: z.boolean(),
});

export const locationsSchema = z.object({
  locations: z.array(locationItemSchema),
});

export const tripSchema = z.object({
  destination: z.string().min(1, "Destination is required"),
  duration: z
    .number()
    .min(1, "Duration must be at least 1 day")
    .max(14, "Duration cannot exceed 14 days"),
  preferences: z
    .array(
      z.enum([
        "Food",
        "Culture",
        "Outdoors",
        "Indoors",
        "Active",
        "Relaxation",
        "Pet friendly",
        "Child friendly",
        "Vegetarian",
        "Vegan",
        "Nightlife",
      ]),
    )
    .optional(),
  sessionToken: z.string().optional(),
});
