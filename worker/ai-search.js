// Cloudflare Worker: AI Dental Search proxy for dr-ahmed-amer's portfolio.
// Secret: GEMINI_KEY (set via dashboard, never in code). No other secrets.
// Free tier only: 100k req/day on workers.dev. Per-IP throttle is best-effort (per-isolate memory).

const ALLOWED_ORIGINS = [
  "https://dr-ahmed-amer.github.io",
  "https://dr-ahmed-amer.surge.sh",
];
const RATE_LIMIT_PER_MIN = 10;
const buckets = new Map(); // ip -> {count, reset}

function cors(origin) {
  const ok = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": ok,
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function limited(ip) {
  const now = Date.now();
  let b = buckets.get(ip);
  if (!b || now > b.reset) { b = { count: 0, reset: now + 60000 }; buckets.set(ip, b); }
  b.count++;
  return b.count > RATE_LIMIT_PER_MIN;
}

const SYSTEM = `You are the dental education assistant on Dr. Ahmed Amer's dental portfolio website (a dentist in Egypt).
Answer dental questions briefly (max 120 words), in simple language, in the same language as the question (Egyptian Arabic if Arabic).
Be conservative: give general education, never a diagnosis, and always end advising to see a dentist for examination.
Do not prescribe medications or dosages. For emergencies (facial swelling, trouble breathing/swallowing, uncontrolled bleeding), say to seek urgent care immediately.`;

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const url = new URL(request.url);

    if (request.method === "OPTIONS") return new Response(null, { headers: cors(origin) });

    if (url.pathname === "/status") {
      return Response.json({ gemini: !!env.GEMINI_KEY, model: "gemini-2.5-flash" }, { headers: cors(origin) });
    }

    if (url.pathname !== "/ask" || request.method !== "POST") {
      return Response.json({ error: "not found" }, { status: 404, headers: cors(origin) });
    }

    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    if (limited(ip)) {
      return Response.json({ error: "rate_limited" }, { status: 429, headers: cors(origin) });
    }

    if (!env.GEMINI_KEY) {
      return Response.json({ error: "ai_not_configured" }, { status: 503, headers: cors(origin) });
    }

    let q = "";
    try { q = ((await request.json()).q || "").toString().slice(0, 600); } catch (e) {}
    if (!q.trim()) return Response.json({ error: "empty_query" }, { status: 400, headers: cors(origin) });

    const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + env.GEMINI_KEY;
    const payload = {
      system_instruction: { parts: [{ text: SYSTEM }] },
      contents: [{ parts: [{ text: q }] }],
      generationConfig: { maxOutputTokens: 400, temperature: 0.3 },
      safetySettings: [
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      ],
    };

    try {
      const r = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) return Response.json({ error: "upstream_" + r.status }, { status: 502, headers: cors(origin) });
      const data = await r.json();
      const answer = (((data.candidates || [])[0] || {}).content || {}).parts || [];
      const text = answer.map(p => p.text || "").join("").trim();
      if (!text) return Response.json({ error: "empty_answer" }, { status: 502, headers: cors(origin) });
      return Response.json({ answer: text }, { headers: cors(origin) });
    } catch (e) {
      return Response.json({ error: "upstream_error" }, { status: 502, headers: cors(origin) });
    }
  },
};
