import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("sessionid");

  const sessionId = sessionCookie
    ? sessionCookie.value
    : Math.random().toString(36).substring(2);
  const sessionToken = sessionId;

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const placeString = searchParams.get("placeString");

  const types = ["place", "locality", "neighborhood"];

  if (!process.env.MAPBOX_API_KEY) {
    return NextResponse.json({ error: "API key is missing." }, { status: 500 });
  }

  if (!placeString) {
    return NextResponse.json(
      { error: "Place string is missing." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `https://api.mapbox.com/search/searchbox/v1/suggest?q=${placeString}&access_token=${process.env.MAPBOX_API_KEY}&language=en&limit=5&session_token=${sessionToken}&types=${types.join(
        ",",
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Mapbox Suggest API error: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.suggestions) {
      const emptyResponse = NextResponse.json([]);
      // Set the cookie in the response
      emptyResponse.cookies.set("sessionid", sessionId);
      return emptyResponse;
    }

    const suggestions = data.suggestions.map((prediction) => {
      return {
        name: prediction.name,
        fullName: `${prediction.name}${prediction.place_formatted ? `, ${prediction.place_formatted}` : ""}`,
        mapboxId: prediction.mapbox_id,
        address: prediction.full_address,
      };
    });

    // Create response with the suggestions data
    const nextResponse = NextResponse.json(suggestions);

    // Set the cookie in the response
    nextResponse.cookies.set("sessionid", sessionId);

    return nextResponse;
  } catch (error) {
    console.error("Error:", error.message);
    const errorResponse = NextResponse.json(
      { error: "API call failed." },
      { status: 500 },
    );
    // Still set the cookie even in case of error
    errorResponse.cookies.set("sessionid", sessionId);
    return errorResponse;
  }
}
