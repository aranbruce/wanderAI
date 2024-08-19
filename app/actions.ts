"use server";

import { streamObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { createStreamableValue } from "ai/rsc";
import { z } from "zod";

interface GenerateTripItineraryProps {
  destination: string;
  duration: number;
  preferences: string[];
}

async function getPlacesFromGoogle({ destination, preferences }) {
  "use server";
  // Fetch google places data
  console.log("Getting places from Google Places...");
  let allPlacesData = [];
  try {
    if (preferences.length > 0) {
      // Get places from Google
      for (const preference of preferences) {
        // Call Google for each preference
        const googlePlacesResponse = await fetch(
          "https://places.googleapis.com/v1/places:searchText",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY,
              "X-Goog-FieldMask":
                "places.displayName,places.id,places.types,places.rating,places.googleMapsUri,places.websiteUri,places.location,places.editorialSummary",
              SameSite: "Strict",
            },
            body: JSON.stringify({
              textQuery: `${preference} places in ${destination}`,
              languageCode: "en",
              minRating: 4,
            }),
          },
        );
        const googlePlacesData = await googlePlacesResponse.json();
        allPlacesData.push(...googlePlacesData.places);
      }
    } else {
      // Call Google for places
      const googlePlacesResponse = await fetch(
        "https://places.googleapis.com/v1/places:searchText",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY,
            "X-Goog-FieldMask":
              "places.displayName,places.id,places.types,places.rating,places.location,places.editorialSummary",
            SameSite: "Strict",
          },
          body: JSON.stringify({
            textQuery: `places in ${destination}`,
            languageCode: "en",
            minRating: 4.5,
          }),
        },
      );
      const googlePlacesData = await googlePlacesResponse.json();
      allPlacesData.push(...googlePlacesData.places);
    }
    return allPlacesData;
  } catch (error) {
    console.log("Error:", error.message);
    throw new Error("API call failed.");
  }
}

async function getPlaceDetailsFromGoogle({ placeId }) {
  "use server";
  try {
    // Call Google for places
    const googlePlacesDetailsResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?key=${process.env.GOOGLE_PLACES_API_KEY}&place_id=${placeId}&fields=photos/photo_reference%2Crating%2Cgeometry/location`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          SameSite: "Strict",
        },
      },
    );
    const googlePlacesDetails = await googlePlacesDetailsResponse.json();
    return googlePlacesDetails;
  } catch (error) {
    console.log("Error:", error.message);
    throw new Error("API call failed.");
  }
}

export async function generateTripItinerary({
  destination,
  duration,
  preferences,
}: GenerateTripItineraryProps) {
  "use server";

  let googlePlacesResponseString = await getPlacesFromGoogle({
    destination,
    preferences,
  });

  for (let i = 0; i < googlePlacesResponseString.length; i++) {
    // add the response from getPlaceDetailsFromGoogle to googlePlacesResponseString
    const placeId = googlePlacesResponseString[i].id;
    const placeDetails = await getPlaceDetailsFromGoogle({ placeId });
    // console.log("placeDetails: ", placeDetails);
    googlePlacesResponseString[i] = {
      ...googlePlacesResponseString[i],
      ...placeDetails,
    };
  }

  const stream = createStreamableValue();

  (async () => {
    const { partialObjectStream } = await streamObject({
      model: openai("gpt-4o-mini", {
        structuredOutputs: true,
      }),
      mode: "json",
      maxRetries: 0,
      system: `Plan a trip to ${destination} for ${duration} days. Include a variety of locations that match the following preferences: ${preferences.join(
        ", ",
      )}
        Select appropriate locations by matching the types to the preferences.
        You can use some of the following locations from Google: ${googlePlacesResponseString}
        Use the id from Google for each location.
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
      schema: z.object({
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
              .describe(
                "The rating of the location, which is a number between 0 and 5",
              ),
            description: z.string().describe("The description of the location"),
            // photoReferences: z
            //   .array(z.string())
            //   .describe("The photo references of the location"),
          }),
        ),
      }),
    });

    for await (const partialObject of partialObjectStream) {
      stream.update(partialObject);
    }

    stream.done();
  })();

  return { object: stream.value };
}
