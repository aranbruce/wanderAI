
import { OpenAIApi, Configuration } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(req) {
  const body = await req.json();
  if (body.prompt !== undefined) {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: 'system',
          content: 
            `You are an assistant that creates trip itineraries to users using the present tense.
            Provide an activity for the morning, afternoon and evening of each day of the trip.
            Describe each itinerary item in detail using 3 sentences.
            When mentioning places to eat or drink use specific locations where you can.
            Try to group locations that are located closely together on the same day.
            Only provide the itinerary as a valid JSON object for the first 2 days.
            Format the text in the following JSON format:
            [
              {
                "morning": {
                  "location: "location name",
                  "description": "Description of morning itinerary"
                  "longitude": "longitude coordinate",
                  "latitude": "longitude latitude",
                  "rating": "rating",
                },
                "afternoon":{
                  "location: "location name",
                  "description": "Description of afternoon itinerary",
                  "longitude": -97.7431,
                  "latitude": 30.2672.
                  "rating": "rating"
                },
                "evening": {
                  "location: "location name",
                  "description": Description of evening itinerary",
                  "longitude": -97.7431,
                  "latitude": 30.2672,
                  "rating": "rating"
                },
                {
                  "morning": {
                    "location: "location name",
                    "description": "Description of morning itinerary",
                    "longitude": -97.7431,
                    "latitude": 30.2672,
                    "rating": "rating"
                  },
                  "afternoon":{
                    "location: "location name",
                    "description": "Description of afternoon itinerary",
                    "longitude": -97.7431,
                    "latitude": 30.2672,
                    "rating": "rating"
                  },
                  "evening": {
                    "location: "location name",
                    "description": Description of evening itinerary",
                    "longitude": -97.7431,
                    "latitude": 30.2672,
                    "rating": "rating"
                  } 
                }
              }
            ]`
        },
        {
          role: 'user',
          content: `${body.prompt}`
        }
      ],
      max_tokens: 700,
      temperature: 0.3,
    });
  const responseText = completion.data.choices[0].message.content;
  console.log(responseText)
  return new Response(responseText, {status: 200});
  } 
  else {
    return new Response(responseObject, {status: 400}, {statusText: "No prompt provided."});
  }
}