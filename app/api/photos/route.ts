import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const placeId = searchParams.get("placeId");

  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?fields=photos`,

      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY,
        },
      },
    );
    if (!response.ok) {
      throw new Error(
        `Google Places Details API error: ${response.statusText}`,
      );
    }

    const data = await response.json();
    const photosToProcess = data.photos.slice(0, 10);

    const photoURLs: string[] = [];
    for (const photo of photosToProcess) {
      try {
        const photoResponse = await fetch(
          `https://places.googleapis.com/v1/${photo.name}/media?maxHeightPx=1600&skipHttpRedirect=true`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY,
            },
          },
        );
        if (!photoResponse.ok) {
          throw new Error(
            `Google Places Photo API error: ${photoResponse.statusText}`,
          );
        }
        const data = await photoResponse.json();
        const photoUri = data.photoUri;
        photoURLs.push(photoUri);
      } catch (error) {
        console.log("Error:", error.message);
        throw new Error("API call failed.");
      }
    }
    return new Response(JSON.stringify(photoURLs));
  } catch (error) {
    console.log("Error:", error.message);
    return new Response(JSON.stringify({ error: "API call failed." }), {
      status: 500,
    });
  }
}
