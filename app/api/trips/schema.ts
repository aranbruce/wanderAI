import { z } from "zod";

export const locationsSchema = z.object({
  locations: z.array(
    z.object({
      id: z.string().describe("The id of the location"),
      coordinates: z.object({
        latitude: z.number().describe("The latitude of the location"),
        longitude: z.number().describe("The longitude of the location"),
      }),
      day: z.number().describe("The day of the trip"),
      timeOfDay: z
        .enum(["morning", "afternoon", "evening"])
        .describe("The time of day"),
      title: z.string().describe("The title of the location"),
      rating: z.number().describe("The rating of the location"),
      reviewCount: z.number().describe("The number of reviews of the location"),
      tripadvisorUrl: z
        .string()
        .describe("The URL of the location on TripAdvisor"),
      websiteUrl: z
        .string()
        .describe("The URL of the location's website, if available"),
      priceLevel: z
        .enum(["$", "$$", "$$$", "$$$$"])
        .describe(
          "The price level of the location indicated by the priceLevel field from Google",
        ),
      description: z.string().describe("The description of the location"),
      photoUrls: z
        .array(z.string())
        .describe("The URLs of the photos of the location from TripAdvisor"),

      isLoaded: z.boolean().describe("A flag that is always true"),
    }),
  ),
});

export const tripSchema = z.object({
  // destination: z.string().min(1, "Destination is required"),
  destination: z.object({
    name: z.string().min(1, "Destination is required"),
    fullName: z.string().min(1, "Destination is required"),
    mapboxId: z.string().min(1, "Destination is required"),
  }),
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
        "Relaxing",
        "Pet friendly",
        "Child friendly",
        "LGBTQ+ friendly",
        "Vegetarian",
        "Vegan",
        "Nightlife",
      ]),
    )
    .optional(),
  trip: z.any().optional(),
});
