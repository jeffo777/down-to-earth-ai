/**
 * Vercel Serverless Function — /api/deepgram-token
 * 
 * Creates short-lived Deepgram API tokens for browser-based voice agent sessions.
 * This keeps the main API key secure on the server while giving the browser
 * a temporary token that expires after 60 seconds.
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

  try {
    // Request a temporary token from Deepgram (TTL: 60 seconds)
    const response = await fetch('https://api.deepgram.com/v1/auth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        time_to_live_in_seconds: 60,
        scopes: ['agent'],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Deepgram token error:', response.status, errorText);
      return res.status(502).json({ error: 'Failed to create voice session' });
    }

    const data = await response.json();
    return res.status(200).json({ token: data.token || data.key });
  } catch (err) {
    console.error('Token generation error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
