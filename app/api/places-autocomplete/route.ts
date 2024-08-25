import { NextRequest } from "next/server";
import { text } from "stream/consumers";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const placeString = searchParams.get("placeString");

  console.log("placeString: ", placeString);

  if (!process.env.GOOGLE_PLACES_API_KEY) {
    return new Response(JSON.stringify({ error: "API key is missing." }), {
      status: 500,
    });
  }

  if (!placeString) {
    return new Response(JSON.stringify({ error: "Place string is missing." }), {
      status: 400,
    });
  }

  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places:autocomplete?fields=*`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY,
          // "X-Goog-FieldMask": "placeId",
        },
        body: JSON.stringify({
          input: placeString,
          includedPrimaryTypes: [
            // "administrative_area_level_1",
            // "administrative_area_level_2",
            // "administrative_area_level_3",
            "administrative_area_level_4",
            "administrative_area_level_5",
            "administrative_area_level_6",
            "administrative_area_level_7",
            "locality",
          ],
          languageCode: "en",
        }),
      },
    );

    if (!response.ok) {
      throw new Error(
        `Google Places Details API error: ${response.statusText}`,
      );
    }

    const data = await response.json();
    if (!data.suggestions) {
      return new Response(JSON.stringify([]), {
        status: 200,
      });
    }
    const suggestions = data.suggestions.map((prediction) => {
      return {
        place: prediction.placePrediction.place,
        placeId: prediction.placePrediction.placeId,
        text: prediction.placePrediction.text.text,
      };
    });
    return new Response(JSON.stringify(suggestions));
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(JSON.stringify({ error: "API call failed." }), {
      status: 500,
    });
  }
}
