import type { Context } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  const requestKey = req.headers.get("X-API-Key");
  const apiKey = Netlify.env.get("MY_API_KEY");
  if (requestKey === apiKey) {
    return new Response("Welcome!");
  }

  return new Response(`Sorry, no access for you. ${apiKey}`, { status: 401 });
}