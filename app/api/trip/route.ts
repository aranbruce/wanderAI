import { google } from "@ai-sdk/google";
import { streamText, Output } from "ai";
import { NextRequest } from "next/server";
import { kv } from "@vercel/kv";
import { tripSchema, locationItemSchema } from "./schema";
import { z } from "zod";

export const maxDuration = 60;

// Constants
const CACHE_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days
const MAX_TRIP_DURATION = 2;
const LOCATIONS_PER_DAY = 3;

async function fetchDestinationDetails(
  destination: string,
  sessionId: string,
): Promise<{
  latitude: number;
  longitude: number;
  name: string;
  fullName: string;
}> {
  const mapboxApiKey = process.env.MAPBOX_API_KEY;
  if (!mapboxApiKey) {
    throw new Error("MAPBOX_API_KEY environment variable is not set");
  }

  try {
    console.log("Fetching destination details for:", destination);
    const response = await fetch(
      `https://api.mapbox.com/search/searchbox/v1/retrieve/${destination}?access_token=${mapboxApiKey}&session_token=${sessionId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      throw new Error(`Mapbox API error: ${response.status} ${errorText}`);
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
    if (error instanceof Error) {
      throw error; // Preserve original error message
    }
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
    const { duration: requestedDuration } = validationResult.data;
    const sessionId = sessionToken || Math.random().toString(36).substring(2);

    // Limit duration to max allowed
    const duration = Math.min(requestedDuration, MAX_TRIP_DURATION);

    console.log("Generating trip for:", { destination, duration, preferences });

    // Create cache key - normalize preferences array for consistency
    const normalizedPreferences = (preferences || []).sort().join(",");
    const key = `trip:${destination}:${duration}:${normalizedPreferences}`;

    // Check cache first to avoid API calls
    try {
      const cached = await kv.get<{
        locations: Array<z.infer<typeof locationItemSchema>>;
      }>(key);
      if (
        cached &&
        Array.isArray(cached.locations) &&
        cached.locations.length > 0
      ) {
        console.log(
          `Returning cached trip with ${cached.locations.length} locations`,
        );
        // Return cached data as a stream-compatible response
        return Response.json({ locations: cached.locations }, { status: 200 });
      }
    } catch (error) {
      console.warn("Error checking cache, proceeding with API call:", error);
    }

    const destinationDetails = await fetchDestinationDetails(
      destination,
      sessionId,
    );
    const { latitude, longitude, name, fullName } = destinationDetails;

    console.log("Starting to stream trip response...");

    const totalLocations = duration * LOCATIONS_PER_DAY;
    const preferencesText =
      preferences && preferences.length > 0
        ? preferences.join(", ")
        : "general travel preferences";

    const result = streamText({
      // model: google("gemini-3-flash-preview"),
      model: "google/gemini-3-flash-preview",
      output: Output.array({ element: locationItemSchema }),
      tools: {
        google_maps: google.tools.googleMaps({}),
        google_search: google.tools.googleSearch({}),
      },
      providerOptions: {
        google: {
          retrievalConfig: {
            latLng: { latitude: latitude, longitude: longitude },
          },
        },
      },
      maxRetries: 1,
      prompt: `Create a ${duration}-day travel itinerary for ${name}, ${fullName} (${latitude}, ${longitude}).
      
Preferences: ${preferencesText}

Requirements:
- ${totalLocations} locations total (morning, afternoon, evening for each day)
- Include current, up-to-date information
- Match the specified preferences
- Provide detailed 4-sentence descriptions
- Include coordinates, ratings, and price levels

Return an array of location objects with: id, coordinates {latitude, longitude}, day, timeOfDay, title, rating, priceLevel, description, isLoaded: true`,

      onError: ({ error }) => {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error("Error during streaming:", {
          error: errorMessage,
          destination,
          duration,
          timestamp: new Date().toISOString(),
        });
      },
      onFinish: async () => {
        try {
          // Access the object from the stream result for structured output
          // When using Output.array(), result.object is a Promise that resolves to the array
          // TypeScript doesn't infer the object property correctly, so we use type assertion
          type ResultWithObject = {
            object: Promise<Array<z.infer<typeof locationItemSchema>>>;
          };
          const object = await (result as unknown as ResultWithObject).object;

          if (Array.isArray(object) && object.length > 0) {
            const wrappedObject = { locations: object };
            await kv.set(key, wrappedObject);
            await kv.expire(key, CACHE_TTL_SECONDS);
            console.log(
              `Saved ${object.length} locations to cache with key: ${key}`,
            );
          } else {
            console.warn("No locations to cache - array is empty or invalid");
          }
        } catch (error: unknown) {
          console.error("Error saving to cache:", error);
        }
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error generating trip:", error);
    return Response.json(
      {
        error: "Failed to generate trip. Please try again.",
      },
      { status: 500 },
    );
  }
}
