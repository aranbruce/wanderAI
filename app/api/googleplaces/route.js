import { NextResponse } from 'next/server'
 
export async function POST(req) {
  const body = await req.json();
  console.log("body:", body);
  const textQuery = body.textQuery;

  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY,
      'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.priceLevel,places.rating,places.googleMapsUri,places.websiteUri,places.location,places.editorialSummary',
      // 'X-Goog-FieldMask': '*',
    },
    body: JSON.stringify({
      "textQuery": textQuery,
      "languageCode": "en",
      "minRating": 4,
    })
    })
  
  const data = await res.json()
  
  return NextResponse.json(data)
}
