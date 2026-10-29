// Cloudflare Worker: public proxy that keeps the Groq key off the browser.
const ALLOWED_ORIGINS = ['https://domvq.github.io']; // add a custom domain here if you use one
const MODEL = 'openai/gpt-oss-120b'; // supports Groq's built-in browser_search tool

const reply = (obj, status, cors) =>
  new Response(JSON.stringify(obj), { status, headers: { ...cors, 'content-type': 'application/json' } });

const groq = (body, env) => fetch('https://api.groq.com/openai/v1/chat/completions', {
  method: 'POST',
  headers: { 'content-type': 'application/json', 'authorization': 'Bearer ' + env.GROQ_API_KEY },
  body: JSON.stringify(body)
});

export default {
  async fetch(req, env) {
    const origin = req.headers.get('Origin') || '';
    const ok = ALLOWED_ORIGINS.includes(origin);
    const cors = {
      'Access-Control-Allow-Origin': ok ? origin : ALLOWED_ORIGINS[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'content-type',
      'Vary': 'Origin'
    };
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (req.method !== 'POST' || !ok) return reply({ error: { message: 'Not allowed.' } }, 403, cors);

    const { success } = await env.LIMITER.limit({ key: req.headers.get('CF-Connecting-IP') || 'unknown' });
    if (!success) return reply({ error: { message: 'Too many requests. Wait a minute and try again.' } }, 429, cors);

    if ((+req.headers.get('content-length') || 0) > 2e6) return reply({ error: { message: 'Request is too large.' } }, 413, cors);
    let b;
    try { b = await req.json(); } catch { return reply({ error: { message: 'Bad request.' } }, 400, cors); }
    if (!Array.isArray(b.messages) || b.messages.length > 40) return reply({ error: { message: 'Bad request.' } }, 400, cors);

    // Only these fields are forwarded, so visitors cannot pick the model or tools.
    const body = {
      model: MODEL,
      max_completion_tokens: Math.min(+b.max_tokens || 3000, 5000),
      temperature: 0.4,
      reasoning_effort: 'low',
      messages: [{ role: 'system', content: String(b.system || '').slice(0, 4000) }, ...b.messages]
    };
    if (b.search) { body.tools = [{ type: 'browser_search' }]; body.tool_choice = 'required'; }

    let r = await groq(body, env);
    // If the search request is rejected or too big for the free limits, answer without search.
    if (b.search && [400, 404, 413].includes(r.status)) {
      delete body.tools; delete body.tool_choice;
      r = await groq(body, env);
    }
    return new Response(r.body, { status: r.status, headers: { ...cors, 'content-type': 'application/json' } });
  }
};
