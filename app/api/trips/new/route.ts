import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

import { generateId } from "ai";
import { tripSchema } from "../schema";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  console.log("POST /api/trips/new");
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
