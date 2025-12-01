// app/api/ask/route.ts

const SYSTEM_PROMPT = `
You are Wolvrn.ai, a friendly, sharp study assistant for Bellevue High School students.
Answer clearly and concisely. If a question is about school, classes, or study strategy,
be extra helpful and specific.
`.trim();

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "Missing OPENAI_API_KEY on the server" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  let prompt: string | undefined;

  try {
    const body = await req.json();
    prompt = body?.prompt;
  } catch {
    // ignore, handled below
  }

  if (!prompt || typeof prompt !== "string") {
    return new Response(JSON.stringify({ error: "No prompt provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI error:", errorText);
      return new Response(
        JSON.stringify({ error: "OpenAI API error", detail: errorText }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    const text =
      data.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I couldn't generate an answer.";

    return Response.json({ text });
  } catch (err) {
    console.error("Server error talking to OpenAI:", err);
    return new Response(
      JSON.stringify({ error: "Server error while calling OpenAI" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
