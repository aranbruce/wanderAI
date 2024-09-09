import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

import { generateId } from "ai";
import { tripSchema } from "../schema";

export async function GET(request: NextRequest): Promise<Response> {
  console.log("Received GET request for /api/trips/query");
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const tripId = searchParams.get("tripId");

  if (!tripId) {
    return NextResponse.json(
      { error: "Trip ID is missing" },
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  // Check for cached result
  const cached = await kv.get(tripId);
  if (!cached) {
    return NextResponse.json(
      { error: "No trip found" },
      {
        status: 404,
        headers: { "Content-Type": "text/plain" },
      },
    );
  }

  return NextResponse.json(cached, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: NextRequest): Promise<Response> {
  console.log("Received POST request for /api/trips/query");
  // create a new trip and store in kv store
  let requestData;
  try {
    requestData = await request.json();
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
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

  const tripId = generateId();
  await kv.set(tripId, { destination, duration, preferences });
  await kv.expire(tripId, 60 * 60 * 24 * 7); // 7 days

  return NextResponse.json({ tripId: tripId });
}
