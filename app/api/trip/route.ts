import { openai } from "@ai-sdk/openai";

import { streamObject } from "ai";
import { locationsSchema } from "./schema";
import { NextRequest } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const { destination, duration, preferences } = await request.json();
  console.log("Generating trip itinerary...");
  console.log("Destination: ", destination);
  console.log("Duration: ", duration);
  console.log("Preferences: ", preferences);

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
              "X-Goog-FieldMask":
                "places.displayName,places.id,places.types,places.rating,places.googleMapsUri,places.websiteUri,places.location,places.editorialSummary",
            },
            body: JSON.stringify({
              textQuery: query,
              languageCode: "en",
              minRating: 4,
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
        `https://maps.googleapis.com/maps/api/place/details/json?key=${process.env.GOOGLE_PLACES_API_KEY}&place_id=${placeId}&fields=photos/photo_reference,rating,geometry/location`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) {
        throw new Error(
          `Google Places Details API error: ${response.statusText}`,
        );
      }
      return response.json();
    } catch (error) {
      console.log("Error:", error.message);
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
    model: openai("gpt-4o-2024-08-06", {
      // model: openai("gpt-4o-mini", {
      structuredOutputs: true,
    }),
    // model: anthropic("claude-3-5-sonnet-20240620", {
    //   cacheControl: true,
    // }),
    // model: vertex("gemini-1.5-pro-latest", {
    //   useSearchGrounding: true,
    // }),

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
            "description": "Description of the location",
            "rating": "Rating of the location between 1 and 5 to 1 decimal place",
            "photoReferences": [
              {
                "photoRef": "Photo reference string supplied by Google Places API"
              }
            ]
          }
        ]
        """
        Proved as many photoRef values per location as can be found for that id in the locations from Google.
        Ensure the photoRefs match the location supplied in the locations from Google.
        `,
    prompt: "Generate the trip itinerary",
    schema: locationsSchema,
  });

  return result.toTextStreamResponse();
}
