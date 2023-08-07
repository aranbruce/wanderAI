export const dynamic = 'auto'
export const fetchCache = 'auto'
export const preferredRegion = 'auto'
export const maxDuration = 60

import { OpenAIApi, Configuration } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(req) {
  const body = await req.json();
  const destination = body.destination;
  const duration = body.duration;
  const preferences = body.preferences;
  if (body.destination !== undefined && body.duration !== undefined) {
    let allPlacesData = [];
    try {
      for (const preference of preferences) {
        // Call Google for each preference
        console.log("Getting places from Google Places...");
        const googlePlacesResponse = await fetch('https://places.googleapis.com/v1/places:searchText', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY,
            'X-Goog-FieldMask': 'places.displayName,places.types,places.rating,places.googleMapsUri,places.websiteUri,places.location,places.editorialSummary',
            'SameSite': 'Strict'
          },
          body: JSON.stringify({
            "textQuery": `${preference} places in ${destination}`,
            "languageCode": "en",
            "minRating": 4,
          }),
        });
        const googlePlacesData = await googlePlacesResponse.json();
        allPlacesData.push(...googlePlacesData.places);
      }
      const allPlacesDataString = JSON.stringify(allPlacesData);
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo-16k",
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content: 
              `Plan a trip to ${destination} for ${duration} days using the following data:
              ${allPlacesDataString}. Include a variety of activities that match the following preferences: ${preferences.join(', ')}
              Select appropriate locations by matching the types to the preferences.
              Describe each itinerary item in detail using 3 sentences.
              Group locations that are located closely together on the same day.
              Provide the itinerary in the following JSON format:
              """[
                {
                  "morning": {
                    "location: "location name",
                    "description": "Description of morning itinerary"
                    "latitude": "latitude coordinate",
                    "longitude": "longitude coordinate",
                    "rating": "rating",
                  },
                  "afternoon":{
                    "location: "location name",
                    "description": "Description of afternoon itinerary",
                    "latitude": "latitude coordinate",
                    "longitude": "longitude coordinate",
                    "rating": "rating"
                  },
                  "evening": {
                    "location: "location name",
                    "description": Description of evening itinerary",
                    "latitude": "longitude latitude",
                    "longitude": "longitude coordinate",
                    "rating": "rating"
                  }
                }
              ]"""`
          },
        ],
      });
      const responseText = completion.data.choices[0].message.content;
      return new Response(responseText, {status: 200});
    } catch (error) {
      console.log("Error:", error.message);
      return new Response(responseObject, {status: 400}, {statusText: "API call failed."});
    }
  } else {
    return new Response(responseObject, {status: 400}, {statusText: "No itinerary details provided."});
  }
}