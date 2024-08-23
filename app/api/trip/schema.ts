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
      rating: z
        .number()
        // .optional()
        .describe("The rating of the location"),
      description: z.string().describe("The description of the location"),
      isLoaded: z.boolean().describe("A flag that is always true"),
      photoReferences: z.array(z.string()).describe("An empty array"),
    }),
  ),
});
