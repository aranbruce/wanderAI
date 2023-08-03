import { NextResponse } from 'next/server'
 
export async function POST(req) {
  const body = await req.json();
  const textQuery = body.textQuery;

  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY,
      'X-Goog-FieldMask': 'places.displayName,places.types,places.rating,places.googleMapsUri,places.websiteUri,places.location,places.editorialSummary',
      'SameSite': 'Strict'
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
