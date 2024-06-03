// export const dynamic = 'auto'
// export const fetchCache = 'auto'
// export const preferredRegion = 'auto'
// export const maxDuration = 20

// use edge runtime
export const runtime = 'edge'

// OpenAI imports
import OpenAI from 'openai';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const { messages } = await req.json()
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.2,
      messages,
      response_format: {"type": 'json_object'},
    });
    const responseObject = await response.choices[0].message.content;
    return new Response(responseObject, {status: 200});
  } catch (error) {
  console.log("Error:", error.message);
  return new Response(responseObject, {status: 400}, {statusText: "API call failed."});
  }
}
