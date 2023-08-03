
import { OpenAIApi, Configuration } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const dynamic = 'auto'
export const fetchCache = 'auto'
export const runtime = 'edge'
export const preferredRegion = 'auto'
export const maxDuration = 30

export async function POST(req) {
  const body = await req.json();
  const destination = body.destination;
  const duration = body.duration;
  const preferences = body.preferences;
  const allPlacesDataString = body.allPlacesDataString;
  if (body.destination !== undefined && body.duration !== undefined) {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-16k",
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content: 
            `Plan a max 2 day trip to ${destination} for ${duration} days using the following data:
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
                },
                {
                  "morning": {
                    "location: "location name",
                    "description": "Description of morning itinerary",
                    "latitude": "latitude coordinate",
                    "longitude": "longitude coordinate",
                    "rating": "rating"
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
                    "latitude": "latitude coordinate",
                    "longitude": "longitude coordinate",
                    "rating": "rating"
                  } 
                }
              }
            ]"""`
        },
        // {
        //   role: 'user',
        //   content: `Plan me a trip to ${destination} for ${duration} days using the following information:
        //   Include activities that match the following preferences: ${preferences.join(', ')}
        //   Use the following${googlePlacesDataString} data in your response.`
        // }
      ],
      max_tokens: 800,
      temperature: 0.3,
    });
  const responseText = completion.data.choices[0].message.content;
  return new Response(responseText, {status: 200});
  } 
  else {
    return new Response(responseObject, {status: 400}, {statusText: "No prompt provided."});
  }
}