export const dynamic = 'auto'
export const fetchCache = 'auto'
export const preferredRegion = 'auto'
export const maxDuration = 10

import { OpenAIApi, Configuration } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(req) {
  const { messages } = await req.json()
  try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        temperature: 0.2,
        messages
      });
      const responseText = completion.data.choices[0].message.content;
      return new Response(responseText, {status: 200});
  } catch (error) {
    console.log("Error:", error.message);
    return new Response(responseObject, {status: 400}, {statusText: "API call failed."});
  }
}