import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { locationsSchema } from "./schema";
import { NextRequest } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const { destination, duration, preferences } = await request.json();
  console.log("Generating trip itinerary...");
  console.log("Destination: ", destination);
  console.log("Duration: ", duration);
  console.log("Preferences: ", preferences);

  const result = await streamObject({
    model: openai("gpt-4o-mini", {
      structuredOutputs: true,
    }),
    mode: "json",
    maxRetries: 0,
    system: `
        Plan a trip to ${destination} for ${duration} days. Include a variety of locations that match the following preferences: ${preferences.join(
          ", ",
        )}
        Select appropriate locations by matching the types to the preferences.
        Describe each location in detail using 2 sentences.
        Do not include the rating in the description.
        Do not include the location in the description.
        Do not use the same location more than once.
        Group locations that are located closely together on the same day.
        Provide the itinerary in the following format as valid JSON:
        """
        {
          "id": "id from Google",
          "location": "Location Name",
          "description": "Description of the location",
        }
        """`,
    prompt: "Generate the trip itinerary",
    schema: locationsSchema,
  });

  return result.toTextStreamResponse();
}
