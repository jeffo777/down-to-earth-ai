/**
 * Site-wide configuration flags.
 * 
 * ACTIVATION INSTRUCTIONS:
 * 1. Set your DEEPGRAM_API_KEY in Vercel environment variables
 * 2. Change aiActive to true below and rebuild
 * 3. The hero + widget "Call me" buttons will open live voice sessions
 *    powered by Deepgram Voice Agent API
 * 4. The "Chat with me" buttons will link to /get-started until
 *    text chat is separately configured
 */
export const SITE_CONFIG = {
  /** Set to true when Deepgram Voice Agent is configured and ready */
  aiActive: true,

  /** Voice AI provider — 'deepgram' for now, could be 'livekit' in future */
  voiceProvider: 'deepgram',
};
