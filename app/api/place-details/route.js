export const dynamic = 'auto'
export const fetchCache = 'auto'
export const preferredRegion = 'auto'
export const maxDuration = 60

export async function POST(req) {
  const body = await req.json();
  const id = body.id;
  try {
    // Call Google for places
    const googlePlacesDetailsResponse = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?key=${process.env.GOOGLE_PLACES_API_KEY}&place_id=${id}&fields=photos/photo_reference%2Crating%2Cgeometry/location`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'SameSite': 'Strict'
      },
    });
    const googlePlacesDetails = await googlePlacesDetailsResponse.json();
    return new Response(JSON.stringify(googlePlacesDetails), {status: 200});
  } catch (error) {
      console.log("Error:", error.message);
      return new Response(responseObject, {status: 400}, {statusText: "API call failed."});
  }
}
