export const config = { runtime: 'edge' }

// Sliding window: max 5 submissions per IP per 10 minutes.
const LIMIT = 5
const WINDOW_MS = 10 * 60 * 1000

// In-memory store — shared across requests on the same Edge instance.
// Good enough for a portfolio contact form; not a distributed counter.
const hits = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (timestamps.length >= LIMIT) return true
  timestamps.push(now)
  hits.set(ip, timestamps)
  return false
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  if (isRateLimited(ip)) {
    return new Response(JSON.stringify({ error: 'Too many requests' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json', 'Retry-After': '600' },
    })
  }

  const endpoint = process.env.FORM_ENDPOINT ?? process.env.VITE_FORM_ENDPOINT
  if (!endpoint) {
    return new Response(JSON.stringify({ error: 'Form endpoint not configured' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let body: string
  try {
    body = await req.text()
    JSON.parse(body) // validate it's JSON before forwarding
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const upstream = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body,
  })

  const upstreamBody = await upstream.text()
  return new Response(upstreamBody, {
    status: upstream.status,
    headers: { 'Content-Type': 'application/json' },
  })
}
