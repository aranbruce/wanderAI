import { openai } from "@ai-sdk/openai";

import { streamObject } from "ai";
import { locationsSchema } from "./schema";
import { NextRequest } from "next/server";

// Allow streaming responses up to 120 seconds on edge runtime
export const maxDuration = 120;
export const runtime = "edge";

export async function POST(request: NextRequest) {
  let { destination, duration, preferences } = await request.json();

  console.log("Generating trip itinerary...");
  console.log("Destination: ", destination);
  console.log("Duration: ", duration);
  console.log("Preferences: ", preferences);

  if (!destination || !duration || !preferences) {
    throw new Error("Missing required fields.");
  }
  if (duration > 2) {
    duration = 2;
  }

  async function getPlacesFromGoogle({ destination, preferences }) {
    console.log("Getting places from Google Places...");
    let allPlacesData = [];
    try {
      const fetchPlaces = async (query) => {
        const response = await fetch(
          "https://places.googleapis.com/v1/places:searchText",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY,
              "X-Goog-FieldMask": "places.id",
            },
            body: JSON.stringify({
              textQuery: query,
              languageCode: "en",
              minRating: 4.5,
            }),
          },
        );
        if (!response.ok) {
          throw new Error(`Google Places API error: ${response.statusText}`);
        }
        return response.json();
      };

      if (preferences.length > 0) {
        const placePromises = preferences.map((preference) => {
          const query = `${preference} places in ${destination}`;
          return fetchPlaces(query);
        });

        const allGooglePlacesData = await Promise.all(placePromises);

        for (const googlePlacesData of allGooglePlacesData) {
          if (googlePlacesData.places) {
            allPlacesData.push(...googlePlacesData.places);
          }
        }
      } else {
        const query = `places in ${destination}`;
        const googlePlacesData = await fetchPlaces(query);
        if (googlePlacesData.places) {
          allPlacesData.push(...googlePlacesData.places);
        }
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
      const response = await fetch(
        `https://places.googleapis.com/v1/places/${placeId}`,

        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY,
            "X-Goog-FieldMask":
              "id,types,formattedAddress,location,rating,googleMapsUri,websiteUri,userRatingCount,displayName.text,editorialSummary,userRatingCount,allowsDogs,priceLevel,servesBrunch,servesLunch,servesDinner,servesVegetarianFood",
            // "X-Goog-FieldMask": "*",
            // accessibilityOptions
            // currentOpeningHours
            // regularOpeningHours
            // reviews
          },
        },
      );
      if (!response.ok) {
        throw new Error(
          `Google Places Details API error: ${response.statusText}`,
        );
      }
      const placeDetails = await response.json();
      return placeDetails;
    } catch (error) {
      console.log("Error:", error.message, error);
      throw new Error("API call failed.");
    }
  }

  let googlePlacesResponseString = await getPlacesFromGoogle({
    destination,
    preferences,
  });

  const placeDetailsPromises = googlePlacesResponseString.map((place) =>
    getPlaceDetailsFromGoogle({ placeId: place.id }),
  );

  const placeDetailsArray = await Promise.all(placeDetailsPromises);

  for (let i = 0; i < googlePlacesResponseString.length; i++) {
    googlePlacesResponseString[i] = {
      ...googlePlacesResponseString[i],
      ...placeDetailsArray[i],
    };
  }

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
        Use some of the following locations from Google: 
        """
        ${JSON.stringify(googlePlacesResponseString)}
        """
        Describe each location in detail using 2 sentences.
        Do not include the rating in the description.
        Do not include the location in the description.
        Do not use the same location more than once.
        Group locations that are located closely together on the same day.
        Only return 1 location per time of day. For example if the duration is 3 days, only return 1 morning, 1 afternoon, and 1 evening location per day.
        Provide the itinerary in the following format as valid JSON:
        """
        [
          {
            id: "unique identifier",
            "coordinates": {
              "latitude": 0.0,
              "longitude": 0.0
            },
            "day": "Day number",
            "timeOfDay": "morning, afternoon, or evening",
            "title": "Location Name",
            "rating": "Rating of the location between 1 and 5 to 1 decimal place",
            "reviewCount": "Number of reviews (the userRatingCount) from Google",
            "googleMapsUri": "Google Maps URL (googleMapsUri) and not the websiteUri",
            "priceLevel": "$, $$, $$$, or $$$$" (the priceLevel field from Google),
            "description": "Description of the location",
            "photoReferences": [],
            "isLoaded": true,
          }
        ]
        """
        Do not repeat locations.
        `,
    prompt: "Generate the trip itinerary",
    schema: locationsSchema,
  });

  return result.toTextStreamResponse();
}
