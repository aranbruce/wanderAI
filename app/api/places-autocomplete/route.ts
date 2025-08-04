import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const placeString = searchParams.get("placeString");
  const sessionToken = searchParams.get("sessionToken");

  // Fallback to generating a session token if not provided (e.g., direct API calls)
  if (!sessionToken) {
    console.warn("No session token provided, generating fallback token");
  }
  const sessionId = sessionToken || Math.random().toString(36).substring(2);

  console.log("Session Token: ", sessionId);

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
      `https://api.mapbox.com/search/searchbox/v1/suggest?q=${placeString}&access_token=${process.env.MAPBOX_API_KEY}&language=en&limit=5&session_token=${sessionId}&types=${types.join(
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
      return NextResponse.json([]);
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
    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("Error:", error.message);
    return NextResponse.json({ error: "API call failed." }, { status: 500 });
  }
}
