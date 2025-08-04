import { google } from "@ai-sdk/google";
import { streamObject } from "ai";
import { NextRequest } from "next/server";
import { kv } from "@vercel/kv";
import { tripSchema, locationItemSchema } from "./schema";

export const maxDuration = 60;

async function fetchDestinationDetails(destination: string, sessionId: string) {
  try {
    console.log("Fetching destination details for:", destination);
    const response = await fetch(
      `https://api.mapbox.com/search/searchbox/v1/retrieve/${destination}?access_token=${process.env.MAPBOX_API_KEY}&session_token=${sessionId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Mapbox API error: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();

    if (!data.features?.[0]?.properties) {
      throw new Error("Invalid response structure from Mapbox API");
    }

    const properties = data.features[0].properties;
    const latitude = properties.coordinates.latitude;
    const longitude = properties.coordinates.longitude;
    const name = properties.name;
    const fullName =
      name +
      (properties.place_formatted ? `, ${properties.place_formatted}` : "");

    return { latitude, longitude, name, fullName };
  } catch (error) {
    console.error("Error fetching destination details:", error);
    throw new Error("Failed to fetch destination name and coordinates");
  }
}

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();
    const validationResult = tripSchema.safeParse(requestData);

    if (!validationResult.success) {
      const errors = validationResult.error.issues
        .map((err) => err.message)
        .join(", ");
      return Response.json(
        { error: `Validation failed: ${errors}` },
        { status: 400 },
      );
    }

    const { destination, preferences, sessionToken } = validationResult.data;
    let { duration } = validationResult.data;
    const sessionId = sessionToken || Math.random().toString(36).substring(2);

    // Limit duration to 2 days max
    if (duration > 2) duration = 2;

    console.log("Generating trip for:", { destination, duration, preferences });

    // Create cache key
    const key = `trip:${destination}:${duration}:${preferences.join(",")}`;

    const destinationDetails = await fetchDestinationDetails(
      destination,
      sessionId,
    );
    const { latitude, longitude, name, fullName } = destinationDetails;

    console.log("Starting to stream trip response...");

    const result = streamObject({
      model: google("gemini-2.5-flash"),
      output: "array",
      schema: locationItemSchema,
      maxRetries: 2,
      providerOptions: {
        google: { useSearchGrounding: true },
      },
      prompt: `Create a ${duration}-day travel itinerary for ${name}, ${fullName} (${latitude}, ${longitude}).
      
Preferences: ${preferences.join(", ")}

Requirements:
- ${duration * 3} locations total (morning, afternoon, evening for each day)
- Include current, up-to-date information
- Match the specified preferences
- Provide detailed 4-sentence descriptions
- Include coordinates, ratings, and price levels

Return an array of location objects with: id, coordinates {latitude, longitude}, day, timeOfDay, title, rating, priceLevel, description, isLoaded: true`,

      onFinish({ object, error }) {
        if (error) {
          console.error("Generation error:", error);
          return;
        }

        if (Array.isArray(object) && object.length > 0) {
          const wrappedObject = { locations: object };
          kv.set(key, wrappedObject);
          kv.expire(key, 60 * 60 * 24 * 7); // 7 days
          console.log(`Saved ${object.length} locations to cache`);
        }
      },
    });
    // console.log("result", result.toTextStreamResponse());
    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error generating trip:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to generate trip";
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
