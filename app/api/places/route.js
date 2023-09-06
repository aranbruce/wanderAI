export const dynamic = 'auto'
export const fetchCache = 'auto'
export const preferredRegion = 'auto'
export const maxDuration = 60

export async function POST(req) {
  const body = await req.json();
  const destination = body.destination;
  const preferences = body.preferences;
  if (body.destination) {
    let allPlacesData = [];
    try {
      if (preferences.length > 0) {
        // Get places from Google
        for (const preference of preferences) {
          // Call Google for each preference
          const googlePlacesResponse = await fetch('https://places.googleapis.com/v1/places:searchText', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY,
              'X-Goog-FieldMask': 'places.displayName,places.id,places.types,places.rating,places.googleMapsUri,places.websiteUri,places.location,places.editorialSummary',
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
      }
      else {
        // Call Google for places
        const googlePlacesResponse = await fetch('https://places.googleapis.com/v1/places:searchText', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY,
            'X-Goog-FieldMask': 'places.displayName,places.id,places.types,places.rating,places.location,places.editorialSummary',
            'SameSite': 'Strict'
          },
          body: JSON.stringify({
            "textQuery": `places in ${destination}`,
            "languageCode": "en",
            "minRating": 4.5,
          }),
        });
        const googlePlacesData = await googlePlacesResponse.json();
        allPlacesData.push(...googlePlacesData.places);
      }
      return new Response(JSON.stringify(allPlacesData), {status: 200});
    } catch (error) {
      console.log("Error:", error.message);
      return new Response(responseObject, {status: 400}, {statusText: "API call failed."});
    }
  }
  else {
    return new Response(responseObject, {status: 400}, {statusText: "No destination provided."});
  }
}
