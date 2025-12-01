// app/api/ask/route.ts

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { prompt } = await req.json().catch(() => ({}));
  if (!prompt || typeof prompt !== "string") {
    return new Response(JSON.stringify({ error: "No prompt provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Temporary: just echo back
  return Response.json({ text: `Echo: ${prompt}` });
}
