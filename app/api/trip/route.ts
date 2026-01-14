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
        locations?: Array<z.infer<typeof locationItemSchema>>;
        elements?: Array<z.infer<typeof locationItemSchema>>;
      }>(key);
      if (cached) {
        // Handle both old format (locations) and new format (elements)
        const locationsArray = cached.elements || cached.locations;
        if (Array.isArray(locationsArray) && locationsArray.length > 0) {
          console.log(
            `Returning cached trip with ${locationsArray.length} locations`,
          );
          // Return cached data in the format expected by Output.array(): { elements: [...] }
          return Response.json({ elements: locationsArray }, { status: 200 });
        }
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
        // onFinish is called when streaming completes
        // We'll handle caching asynchronously after the response is sent
        console.log("Stream finished, will cache result if valid");
      },
    });

    // Handle caching asynchronously after response is sent
    // In AI SDK v6, Output.array() provides elementStream, but we can also access the full array
    // via result.object (Promise) or collect from elementStream
    (async () => {
      try {
        // In AI SDK v6, result.object should still be available as a Promise
        // that resolves to the full array when streaming completes
        type ResultWithObject = {
          object?: Promise<Array<z.infer<typeof locationItemSchema>>>;
          elementStream?: AsyncIterable<z.infer<typeof locationItemSchema>>;
        };

        const resultTyped = result as unknown as ResultWithObject;
        let locationsArray: Array<z.infer<typeof locationItemSchema>> | null =
          null;

        // Primary method: use result.object (should work in v6)
        if (resultTyped.object) {
          try {
            const obj = await resultTyped.object;
            if (Array.isArray(obj)) {
              locationsArray = obj;
              console.log(`Got ${obj.length} locations from result.object`);
            }
          } catch (objError) {
            console.warn("Error accessing result.object:", objError);
          }
        }

        // Fallback: collect from elementStream if object is not available
        if (!locationsArray && resultTyped.elementStream) {
          console.log("Collecting locations from elementStream...");
          const elements: Array<z.infer<typeof locationItemSchema>> = [];
          for await (const element of resultTyped.elementStream) {
            elements.push(element);
          }
          if (elements.length > 0) {
            locationsArray = elements;
            console.log(`Got ${elements.length} locations from elementStream`);
          }
        }

        if (locationsArray && locationsArray.length > 0) {
          // Validate the array against the schema
          const validationResult = z
            .array(locationItemSchema)
            .safeParse(locationsArray);

          if (validationResult.success) {
            // Store in the format that matches Output.array() response: { elements: [...] }
            const wrappedObject = { elements: validationResult.data };
            await kv.set(key, wrappedObject);
            await kv.expire(key, CACHE_TTL_SECONDS);
            console.log(
              `Saved ${validationResult.data.length} locations to cache with key: ${key}`,
            );
          } else {
            console.warn(
              "No locations to cache - validation failed:",
              validationResult.error.issues.map((i) => i.message).join(", "),
            );
            console.warn(
              "First few items for debugging:",
              JSON.stringify(locationsArray.slice(0, 2), null, 2),
            );
          }
        } else {
          console.warn(
            "No locations to cache - array is empty or invalid",
            locationsArray
              ? `Received: ${typeof locationsArray}, length: ${Array.isArray(locationsArray) ? locationsArray.length : "N/A"}`
              : "No data received from result.object or elementStream",
          );
        }
      } catch (error: unknown) {
        console.error("Error saving to cache:", error);
        if (error instanceof Error) {
          console.error("Error details:", error.message, error.stack);
        }
      }
    })();

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
