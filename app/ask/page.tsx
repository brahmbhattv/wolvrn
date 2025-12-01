// app/ask/page.tsx
"use client";

import { useState } from "react";

export default function AskPage() {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    setAnswer(null);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setAnswer(data.text);
    } catch (e: any) {
      setErr(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0A1A44] text-white">
      <div className="w-full max-w-xl space-y-4">
        <h1 className="text-3xl font-semibold">Wolvrn.ai — Ask</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            className="w-full rounded-lg p-3 text-black"
            placeholder="Type a prompt…"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="rounded-lg px-4 py-2 bg-[#FFB400] text-black disabled:opacity-60"
          >
            {loading ? "Thinking…" : "Send"}
          </button>
        </form>

        {err && <p className="text-red-300">Error: {err}</p>}
        {answer && (
          <div className="rounded-lg bg-black/30 p-4">
            <p className="text-lg">{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}
