import { google, GoogleGenerativeAIProviderMetadata } from "@ai-sdk/google";
import { streamObject } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { kv } from "@vercel/kv";
import { locationsSchema, tripSchema } from "./schema";

// Allow streaming responses up to 120 seconds on edge runtime
export const maxDuration = 120;
export const runtime = "edge";

export async function POST(request: NextRequest) {
  let requestData;
  try {
    requestData = await request.json();
  } catch (error) {
    throw new Error("Invalid JSON payload");
  }

  const validationResult = tripSchema.safeParse(requestData);

  if (!validationResult.success) {
    const errors = validationResult.error.errors
      .map((err) => err.message)
      .join(", ");
    return NextResponse.json(
      { error: `Validation failed: ${errors}` },
      { status: 400 },
    );
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("sessionid");
  const sessionId = sessionCookie
    ? sessionCookie.value
    : Math.random().toString(36).substring(2);

  let { destination, duration, preferences } = validationResult.data;
  console.log("Generating trip itinerary...");
  console.log("Destination: ", destination);
  console.log("Duration: ", duration);
  console.log("Preferences: ", preferences);

  if (duration > 2) {
    duration = 2;
  }

  // Create a cache key
  const key = `trip:${destination}:${duration}:${preferences.join(",")}`;

  // Check for cached result
  const cached = await kv.get(key);
  // if (cached != null) {
  //   return new Response(JSON.stringify(cached), {
  //     status: 200,
  //     headers: { "Content-Type": "text/plain" },
  //   });
  // }

  const destinationDetails = await fetchDestinationDetails();

  const { latitude, longitude, name, fullName } = destinationDetails;

  console.log("Destination details: ", destinationDetails);

  async function fetchDestinationDetails() {
    // get latitude and longitude from the destination
    const sessionToken = sessionId;
    try {
      const response = await fetch(
        `https://api.mapbox.com/search/searchbox/v1/retrieve/${destination}?access_token=${process.env.MAPBOX_API_KEY}&session_token=${sessionToken}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();
      const latitude = data.features[0].properties.coordinates.latitude;

      const longitude = data.features[0].properties.coordinates.longitude;
      const name = data.features[0].properties.name;
      const fullName =
        name + data.features[0].properties.place_formatted
          ? `, ${data.features[0].properties.place_formatted}`
          : "";

      return {
        latitude,
        longitude,
        name,
        fullName,
      };
    } catch (error) {
      console.log("Error: ", error);
      throw new Error("Failed to fetch destination name and coordinates");
    }
  }

  try {
    const result = streamObject({
      model: google("gemini-2.5-pro-exp-03-25", {
        // model: google("gemini-2.0-flash-001", {
        useSearchGrounding: true,
        structuredOutputs: true,
      }),

      // mode: "json",
      maxRetries: 0,
      system: `
        Plan a trip to ${name} ${fullName} near latitude: ${latitude} and longitude: ${longitude} for ${duration} days. Include a variety of locations that match the following preferences: ${preferences.join(
          ", ",
        )}
        Select appropriate locations by matching the type of location to the preferences.
        Do not include locations that do not match the preferences.
        
        Only use locations provided by TripAdvisor.
        Describe each location in detail using 2 sentences.
        Do not include the rating in the description.
        Do not include the location in the description.
        Do not use the same location more than once.
        Group locations that are located closely together on the same day.
        Only return 1 location per time of day. For example if the duration is 3 days, only return 1 morning, 1 afternoon, and 1 evening location per day.
        Do not repeat locations.
        Make sure the id you return matches the id from TripAdvisor for that location.
        Try to provide as many photoUrls as possible for each location.
        Provide the itinerary as valid JSON:
        `,
      prompt: "Generate the trip itinerary",
      schema: locationsSchema,
      onFinish({ object, usage, providerMetadata, response, error }) {
        // Log errors if they occurred
        if (error) {
          console.error("Generation error:", error);
          return;
        }
        // Log metadata
        console.log("Token usage:", usage);

        if (response) {
          console.log("Response ID:", response.id);
          console.log("Model used:", response.modelId);
          console.log("Timestamp:", response.timestamp);
        }

        if (providerMetadata) {
          const metadata = providerMetadata?.google as unknown as
            | GoogleGenerativeAIProviderMetadata
            | undefined;
          const groundingMetadata = metadata?.groundingMetadata;
          const safetyRatings = metadata?.safetyRatings;
          console.log("Grounding metadata:", groundingMetadata);
          console.log("Safety ratings:", safetyRatings);
        }

        // Still save to KV as in your original code
        kv.set(key, object);
        kv.expire(key, 60 * 60 * 24 * 7); // 7 days
      },
    });
    // console.log(result.providerMetadata);

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json("Failed to fetch locations", { status: 500 });
  }
}
