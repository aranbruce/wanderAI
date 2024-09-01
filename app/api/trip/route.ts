import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

import { locationsSchema, tripSchema } from "./schema";

// Allow streaming responses up to 120 seconds on edge runtime
export const maxDuration = 120;
export const runtime = "edge";

type TripAdvisorLocation = {
  location_id: string;
  name: string;
  description: string;
  web_url?: string;
  address_obj: {
    street1: string;
    street2: string;
    city: string;
    state: string;
    country: string;
    postalcode: string;
    address_string: string;
  };
  ancestors: any[];
  latitude: number;
  longitude: number;
  timezone: string;
  email: string;
  phone: string;
  website: string;
  write_review: string;
  ranking_data: {
    geo_location_id: string;
    ranking_string: string;
    geo_location_name: string;
    ranking_out_of: number;
    ranking: number;
  };
  rating?: number;
  rating_image_url: string;
  num_reviews: number;
  review_rating_count: object;
  subratings: object;
  photo_count: number;
  see_all_photos: string;
  price_level?: "$" | "$$" | "$$$" | "$$$$";
  hours: object;
  photoUrls?: string[];
};

export async function POST(request: NextRequest) {
  let requestData;
  try {
    requestData = await request.json();
  } catch (error) {
    throw new Error("Invalid JSON payload");
  }

  const validationResult = tripSchema.safeParse(requestData);

  if (!validationResult.success) {
    const errors = validationResult.error.errors
      .map((err) => err.message)
      .join(", ");
    return NextResponse.json(
      { error: `Validation failed: ${errors}` },
      { status: 400 },
    );
  }

  let { destination, duration, preferences } = validationResult.data;
  console.log("Generating trip itinerary...");
  console.log("Destination: ", destination);
  console.log("Duration: ", duration);
  console.log("Preferences: ", preferences);

  const destinationDetails = await fetchDestinationDetails();

  const { latitude, longitude, name, fullName } = destinationDetails;

  if (duration > 2) {
    duration = 2;
  }

  // Create a cache key
  const key = `trip:${destination}:${duration}:${preferences.join(",")}`;

  // Check for cached result
  const cached = await kv.get(key);
  if (cached != null) {
    return new Response(JSON.stringify(cached), {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  async function fetchDestinationDetails() {
    // get latitude and longitude from the destination
    const sessionToken = Math.random().toString(36).substring(2, 15);

    const response = await fetch(
      `https://api.mapbox.com/search/searchbox/v1/retrieve/${destination}?access_token=${process.env.MAPBOX_API_KEY}&session_token=${sessionToken}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();
    const latitude = data.features[0].properties.coordinates.latitude;

    const longitude = data.features[0].properties.coordinates.longitude;
    const name = data.features[0].properties.name;
    const fullName =
      name + data.features[0].properties.place_formatted
        ? `, ${data.features[0].properties.place_formatted}`
        : "";

    return {
      latitude,
      longitude,
      name,
      fullName,
    };
  }

  async function fetchTripAdvisorLocationIds(
    query: string,
    latitude: number | null,
    longitude: number | null,
    category: string | null,
  ) {
    try {
      const url = new URL(
        `https://api.content.tripadvisor.com/api/v1/location/search?key=${process.env.TRIPADVISOR_API_KEY}&searchQuery=${query}&language=en`,
      );
      if (latitude && longitude) {
        url.searchParams.append("latLong", `${latitude},${longitude}`);
      }
      if (category) {
        url.searchParams.append("category", category);
      }

      // Make a request to the TripAdvisor API
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      const data = result.data;
      const locations = data.map((location: any) => {
        return {
          location_id: location.location_id,
        };
      });
      return locations;
    } catch (error) {
      console.log("Error: ", error);
      throw new Error("Internal server error");
    }
  }

  async function fetchTripAdvisorLocationDetails(locationId: any) {
    try {
      // Get details for each location
      const url = new URL(
        `https://api.content.tripadvisor.com/api/v1/location/${locationId}/details?language=en&key=${process.env.TRIPADVISOR_API_KEY}`,
      );
      const locationResponse = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip",
        },
      });
      const locationResult = await locationResponse.json();
      if (!locationResponse.ok) {
        throw new Error(`HTTP error! status: ${locationResponse.status}`);
      }
      return locationResult;
    } catch (error) {
      console.log("Error: ", error);
      throw new Error("Internal server error");
    }
  }

  async function fetchTripAdvisorLocationPhotos(locationId: string) {
    try {
      const url = new URL(
        `https://api.content.tripadvisor.com/api/v1/location/${locationId}/photos?key=${process.env.TRIPADVISOR_API_KEY}&language=en`,
      );
      const locationPhotosResponse = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip",
        },
      });
      if (!locationPhotosResponse.ok) {
        throw new Error(`HTTP error! status: ${locationPhotosResponse.status}`);
      }
      const locationPhotosResult = await locationPhotosResponse.json();
      const data = locationPhotosResult.data;
      let photoUrls = [];
      for (let item of data) {
        let originalImage = item.images.original;
        photoUrls.push(originalImage.url);
      }
      return photoUrls;
    } catch (error) {
      // this line causes issues
      return { error: "Internal server error" };
    }
  }

  async function fetchTripAdvisorLocationDetailsAndPhotos(locationId: string) {
    try {
      // Fetch details and photos separately to handle errors individually
      const locationDetailsPromise =
        fetchTripAdvisorLocationDetails(locationId);
      const locationPhotosPromise = fetchTripAdvisorLocationPhotos(locationId);

      const locationDetails = await locationDetailsPromise.catch((error) => {
        console.error("Error fetching location details: ", error);
        return null; // or some default value
      });

      const locationPhotos = await locationPhotosPromise.catch((error) => {
        console.error("Error fetching location photos: ", error);
        return []; // or some default value
      });

      return {
        ...locationDetails,
        photoUrls: locationPhotos,
      };
    } catch (error) {
      console.error("Error: ", error);
      throw new Error("Internal server error");
    }
  }

  async function fetchTripAdvisorLocations(preference: string | undefined) {
    const query = `Places to visit in ${fullName}${preference ? ` for ${preference}` : ""}`;
    const categories = ["attractions", "restaurants", "geos"];
    // get the location Ids
    let locationIds = [];
    for (let category of categories) {
      const ids = await fetchTripAdvisorLocationIds(
        query,
        latitude,
        longitude,
        category,
      );
      locationIds = locationIds.concat(ids);
    }

    // Create a promise for each location to fetch its details and photos in parallel
    const locationPromises = locationIds.map((locationId: any) =>
      fetchTripAdvisorLocationDetailsAndPhotos(locationId.location_id),
    );

    // Wait for all promises to resolve
    const locations = await Promise.all(locationPromises);
    return locations;
  }
  // for each preference, get the locations
  async function fetchAllTripAdvisorLocations(
    preferences: string[] | undefined,
  ) {
    if (preferences.length === 0) {
      let tripAdvisorLocations = await fetchTripAdvisorLocations(undefined);
      return tripAdvisorLocations;
    } else {
      let tripAdvisorLocations = await Promise.all(
        preferences.map((preference) => fetchTripAdvisorLocations(preference)),
      );
      return tripAdvisorLocations;
    }
  }

  let tripAdvisorLocations = await fetchAllTripAdvisorLocations(preferences);

  // map the locations to the required format
  tripAdvisorLocations = tripAdvisorLocations.flat().map((location: any) => {
    return {
      location_id: location.location_id,
      name: location.name,
      description: location.description,
      tripAdvisorUrl: location.web_url,
      // address_obj: location.address_obj,
      latitude: location.latitude,
      longitude: location.longitude,
      // timezone: location.timezone,
      // email: location.email,
      // phone: location.phone,
      websiteUrl: location.website,
      // ranking_data: location.ranking_data,
      rating: location.rating,
      reviewCount: location.num_reviews,
      // review_rating_count: location.review_rating_count,
      // photo_count: location.photo_count,
      // see_all_photos: location.see_all_photos,
      priceLevel: location.price_level,
      // hours: location.hours,
      photoUrls: location.photoUrls,
    };
  });

  console.log("TripAdvisor locations: ", tripAdvisorLocations);

  const result = await streamObject({
    model: openai("gpt-4o-mini", {
      structuredOutputs: true,
    }),

    mode: "json",
    maxRetries: 0,
    system: `
        Plan a trip to ${fullName} for ${duration} days. Include a variety of locations that match the following preferences: ${preferences.join(
          ", ",
        )}
        Select appropriate locations by matching the type of location to the preferences.
        Do not include locations that do not match the preferences.
        Use some of the following locations from TripAdvisor:
        """
        ${JSON.stringify(tripAdvisorLocations)}
        """ 
        Only use locations provided by TripAdvisor.
        Describe each location in detail using 2 sentences.
        Do not include the rating in the description.
        Do not include the location in the description.
        Do not use the same location more than once.
        Group locations that are located closely together on the same day.
        Only return 1 location per time of day. For example if the duration is 3 days, only return 1 morning, 1 afternoon, and 1 evening location per day.
        Do not repeat locations.
        Make sure the id you return matches the id from TripAdvisor for that location.
        Try to provide as many photoUrls as possible for each location.
        Provide the itinerary in the following format as valid JSON:
        """
        [
          {
            id: "unique identifier for the location matching the id from TripAdvisor",
            "coordinates": {
              "latitude": 0.0,
              "longitude": 0.0
            },
            "day": "Day number",
            "timeOfDay": "morning, afternoon, or evening",
            "title": "Location Name",
            "rating": "Rating of the location between 1 and 5 to 1 decimal place",
            "reviewCount": "Number of reviews for the location from TripAdvisor",
            "tripadvisorUrl": "The URL of the location on TripAdvisor",
            "websiteUrl": "The URL of the location's website, if available",
            "priceLevel": "$, $$, $$$, or $$$$" (the priceLevel field from TripAdvisor),
            "description": "Description of the location",
            "photoUrls": ["URLs of the photos of the location from TripAdvisor"],
            "isLoaded": true,
          }
        ]
        """
        `,
    prompt: "Generate the trip itinerary",
    schema: locationsSchema,
    async onFinish({ object }) {
      await kv.set(key, object);
      await kv.expire(key, 60 * 60 * 24 * 7); // 7 days
    },
  });

  return result.toTextStreamResponse();
}
