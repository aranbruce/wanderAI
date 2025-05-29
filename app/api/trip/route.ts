import { google, GoogleGenerativeAIProviderMetadata } from "@ai-sdk/google";
import { generateText, streamObject } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { kv } from "@vercel/kv";
import { locationsSchema, tripSchema } from "./schema";
import { openai } from "@ai-sdk/openai";

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
    const errorResponse = NextResponse.json(
      { error: `Validation failed: ${errors}` },
      { status: 400 },
    );
    return errorResponse;
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
      // model: openai.responses("gpt-4o-mini"),
      model: google("gemini-2.5-flash-preview-04-17", {
        useSearchGrounding: true,
      }),
      mode: "json",
      maxRetries: 2,
      prompt: `Plan a trip to ${name} ${fullName} near latitude: ${latitude} and longitude: ${longitude} for ${duration} days. Include a variety of locations that match the following preferences: ${preferences.join(
        ", ",
      )}
            Search the web and select appropriate locations by matching the type of location to the preferences.
            Do not include locations that do not match the preferences.
            
            Describe each location in detail using 4 sentences.
            Include a morning, afternoon, and evening location for each day.
            Do not include the rating in the description.
            Do not include the location in the description.
            Do not use the same location more than once.
            Group locations that are located closely together on the same day.
            Find the website URL of each location and include it in the description.
            Only return 1 location per time of day. For example if the duration is 3 days, only return 1 morning, 1 afternoon, and 1 evening location per day.
            Do not repeat locations.
            Include the latitude and longitude of each location.
            Make sure to search the web for the most up-to-date information.`,

      schema: locationsSchema,
      onFinish({ object, usage, providerMetadata, response, error }) {
        console.log("Generation finished");
        // Log errors if they occurred
        if (error) {
          console.error("Generation error:", error);
          return;
        }
        // Still save to KV as in your original code
        kv.set(key, object);
        kv.expire(key, 60 * 60 * 24 * 7); // 7 days
      },
    });

    // Get the streaming response
    const streamResponse = result.toTextStreamResponse();
    console.log("Stream response: ", streamResponse);

    // Create a new Response with the same body and status
    const response = new Response(streamResponse.body, {
      status: streamResponse.status,
      statusText: streamResponse.statusText,
      headers: streamResponse.headers,
    });

    // Set the cookie on the response
    response.headers.set(
      "Set-Cookie",
      `sessionid=${sessionId}; Path=/; HttpOnly; SameSite=Strict`,
    );

    return response;
  } catch (error) {
    console.error("Error: ", error);
    const errorResponse = NextResponse.json("Failed to fetch locations", {
      status: 500,
    });
    // Set cookie even in error case
    errorResponse.cookies.set("sessionid", sessionId);
    return errorResponse;
  }
}
