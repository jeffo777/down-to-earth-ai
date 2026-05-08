/**
 * Vercel Serverless Function — /api/deepgram-token
 * 
 * Returns a Deepgram API key for browser-based voice agent sessions.
 * The browser uses this with Sec-WebSocket-Protocol to authenticate
 * the WebSocket connection to Deepgram's Voice Agent API.
 * 
 * Security notes:
 * - CORS-restricted to our domain only
 * - The API key is exposed to the browser, but this is the documented
 *   approach for client-side WebSocket connections per Deepgram docs.
 * - Consider creating a scoped, limited API key for this purpose.
 * 
 * Environment variable required:
 *   DEEPGRAM_API_KEY — your Deepgram API key (set in Vercel dashboard)
 */

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS — restrict to your domain in production
  const allowedOrigins = [
    'https://downtoearthai.co.uk',
    'https://www.downtoearthai.co.uk',
    'http://localhost:4321',  // Astro dev server
    'http://localhost:3000',
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) {
    console.error('DEEPGRAM_API_KEY environment variable is not set');
    return res.status(500).json({ error: 'Voice service not configured' });
  }

  // Return the API key directly — the browser will pass it via
  // Sec-WebSocket-Protocol header as documented by Deepgram.
  return res.status(200).json({ token: apiKey });
}
