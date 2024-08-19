import { z } from "zod";

// define a schema for the notifications
export const locationsSchema = z.object({
  locations: z.array(
    z.object({
      coordinates: z.object({
        latitude: z.number().describe("The latitude of the location"),
        longitude: z.number().describe("The longitude of the location"),
      }),
      day: z.number().describe("The day of the trip"),
      timeOfDay: z
        .enum(["morning", "afternoon", "evening"])
        .describe("The time of day"),
      title: z.string().describe("The title of the location"),
      rating: z
        .number()
        // .optional()
        .describe("The rating of the location"),
      description: z.string().describe("The description of the location"),

      // photoReferences: z
      //   .array(z.string())
      //   .describe("The photo references of the location"),
    }),
  ),
});
