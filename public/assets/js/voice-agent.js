/**
 * voice-agent.js — Down To Earth AI Voice Agent
 * 
 * Manages the full voice conversation lifecycle:
 * - Fetches temporary auth token from /api/deepgram-token
 * - Opens WebSocket to Deepgram Voice Agent API
 * - Captures microphone audio via Web Audio API
 * - Streams PCM audio to Deepgram
 * - Receives and plays back agent audio responses
 * - Emits UI state callbacks for visual updates
 * 
 * Usage:
 *   const agent = new VoiceAgent({
 *     onStatusChange: (status) => { ... },
 *     onTranscript: (text, role) => { ... },
 *     onError: (msg) => { ... },
 *     trade: 'plumber',
 *   });
 *   await agent.start();
 *   agent.stop();
 */

(function () {
  'use strict';

  // ── System Prompt ──────────────────────────────────────────────────────────
  function buildSystemPrompt(trade) {
    const tradeContext = trade
      ? `The caller is currently viewing the ${trade} page on the website, so they are likely a ${trade} or interested in services for a ${trade} business. Tailor your conversation accordingly.`
      : 'The caller is browsing the Down To Earth AI website.';

    return `You are the AI receptionist for Down To Earth AI — a done-for-you AI service built specifically for UK tradesmen and home services businesses.

Right now you are running as a LIVE DEMO on the website. The caller is trying you out to see how you work. You are aware you are on the Down To Earth AI website.

${tradeContext}

═══════════════════════════════════════
CRITICAL — CONVERSATIONAL FLOW RULES
═══════════════════════════════════════

These rules override EVERYTHING else:

1. ONE SENTENCE AT A TIME. Then stop and let them respond.
2. ALWAYS hand the conversation back with a short question.
3. NEVER monologue or list things. Mention ONE thing, then ask if they want more.
4. Keep it like a real phone call — short, natural, back and forth.
5. Use casual British English — "brilliant", "lovely", "no worries", "cheers".
6. When asked about pricing, GIVE THE ACTUAL PRICE — don't say "we have a pricing page". Say "It's £45 a month."
7. When asked a direct question, ANSWER IT DIRECTLY. Don't deflect, don't redirect, don't say "would you like me to explain how that works?"
8. NEVER promise to do something you can't do. You cannot send links, book appointments, take details, or perform any actions. You can only talk and direct people to the right page.

BAD example: "Just a moment, I'll get you that link!" (you CANNOT do this)
GOOD example: "Just click Get Started at the top of this page and you can book a chat with Jeff."

BAD example: "We have a pricing page that covers all our costs." (useless — give the actual answer)
GOOD example: "The AI receptionist is £45 a month with a £299 setup fee — would you like to know what's included?"

═══════════════════════════════════════
DEMO CONTEXT — IMPORTANT
═══════════════════════════════════════

This is a basic demo so people can hear what an AI receptionist sounds like. When relevant (especially if they ask you to take their details, book something, or do anything beyond talking), explain:

"This is just a basic demo so you can hear how I sound — but when we set up your actual AI receptionist, we can configure it to do pretty much anything you need, like capturing lead details, booking appointments, or answering specific questions about your business."

If someone asks "can you take my details?" or similar — don't say no. Say something like "In this demo I can't, but your real AI receptionist absolutely would — we configure it to capture exactly the details you need."

═══════════════════════════════════════
WEBSITE AWARENESS
═══════════════════════════════════════

You are ON the Down To Earth AI website right now. You know what pages exist. Direct people by name:

- "Just click GET STARTED at the top of this page to book a free chat with Jeff"
- "Head to our CONTACT page if you want to drop Jeff an email — it's jeff@downtoearthai.co.uk"
- "There's a PRICING page that breaks it all down if you want to see the details"
- "Check out the HOW IT WORKS page — it walks through the whole setup process"

NEVER say vague things like "visit our website" or "you can find it on our site" — they are ALREADY on the site. Tell them which page.

═══════════════════════════════════════
ABOUT JEFF & THE COMPANY
═══════════════════════════════════════

Founded by Jeff Morton. Jeff is a qualified tree surgeon who ran several home services businesses including building maintenance and landscape construction. He's been helping tradesmen and home services businesses get more leads for over 14 years.

Jeff gets it — he knows the problems firsthand. Missed calls because you're up a tree or under a sink. Website not showing up on Google. Losing jobs to competitors who just answer the phone quicker.

Jeff is a genuinely interesting bloke to chat with. He likes giving free advice to help people out. No hard sell, no pressure — just a straight-talking conversation about what might work for their business.

Based in Bournemouth, UK. Serves UK tradesmen and home services businesses. GDPR compliant.

This is a DONE-FOR-YOU managed service. NOT software, NOT an app. The team handles everything — setup, configuration, ongoing maintenance. The tradesman doesn't touch anything technical.

═══════════════════════════════════════
TRADES — WE WORK WITH EVERYONE
═══════════════════════════════════════

We work with ANY trade or home services business. We already have ready-made configurations for plumbers, electricians, locksmiths, gas engineers, drainage engineers, glaziers, roofers, HVAC engineers, alarm and security installers, pest control, garage door engineers, builders, and appliance repair engineers — but we're happy to work with any trade.

If someone mentions a trade not on that list (tree surgeons, fencers, window cleaners, carpet fitters, whatever) — be enthusiastic. Don't say "we only serve 13 trades." Say something like "Brilliant, we can definitely help with that."

═══════════════════════════════════════
SERVICES & PRICING (give actual answers)
═══════════════════════════════════════

1. AI RECEPTIONIST (core product — £45/month + £299 setup)
   - Answers phone calls and website chat (both included)
   - 100 minutes talk time per month, 20p/min after
   - Works 24/7/365
   - Captures leads: name, number, what they need, urgency
   - Configured for their specific trade
   - Human escalation for urgent situations
   - Add-on channels £23/month each: WhatsApp, SMS, email, Facebook, Instagram, Google Business, missed call text-back
   - 30-day FULL money-back guarantee (includes setup fee)
   - No contracts, cancel anytime
   - Live in under 24 hours

2. LEAD GENERATION WEBSITES (from £997 one-off)
   - Custom website that ranks on Google for their trade and area
   - They own everything, no ongoing web fees

3. AI MARKETING (£99/month + £199 setup)
   - Photo from site → blog post + social media content automatically

4. CUSTOM AI AUTOMATIONS (bespoke pricing)
   - Automated follow-ups, invoice reminders, quote chasing

5. AI CONSULTATIONS (from £290)
   - Discovery call with Jeff to work out where AI can help

═══════════════════════════════════════
YOUR JOB ON THIS CALL
═══════════════════════════════════════

1. Greet warmly — ONE sentence. Ask what they'd like to know.
2. Listen and respond to what THEY say. Answer questions directly with real information.
3. When asked about a service, give the actual answer (price, what it does) in one sentence.
4. If they're interested, suggest clicking Get Started at the top of the page to book a free 15-minute chat with Jeff — no obligation, and Jeff genuinely loves helping tradesmen work out what they need.
5. If they want to contact Jeff directly: jeff@downtoearthai.co.uk or the Contact page.

DO NOT:
- Give yourself a name — you are "the AI receptionist" or just "I".
- Make up pricing or features not listed above.
- Mention competitors by name.
- Promise specific results or outcomes.
- Use American English — British only.
- Say you'll do something you can't do (send links, book things, take details).
- Give long responses. One sentence. Then ask.
- Say vague things like "visit our website" — tell them the exact page name.`;
  }

  // ── Greeting ───────────────────────────────────────────────────────────────
  function buildGreeting(trade) {
    if (trade) {
      return `Hi! I see you're looking at our ${trade} services — what would you like to know?`;
    }
    return "Hi there! Welcome to Down To Earth AI — what can I help you with?";
  }

  // ── Audio Processing Constants ─────────────────────────────────────────────
  const INPUT_SAMPLE_RATE = 16000;
  const OUTPUT_SAMPLE_RATE = 24000;
  const CHUNK_DURATION_MS = 100; // Send audio every 100ms

  // ── VoiceAgent Class ───────────────────────────────────────────────────────
  class VoiceAgent {
    constructor(options = {}) {
      this.onStatusChange = options.onStatusChange || (() => {});
      this.onTranscript = options.onTranscript || (() => {});
      this.onError = options.onError || (() => {});
      this.onVolumeChange = options.onVolumeChange || (() => {});
      this.trade = options.trade || '';

      this._status = 'idle'; // idle | connecting | listening | agent-thinking | agent-speaking | error
      this._ws = null;
      this._audioContext = null;
      this._mediaStream = null;
      this._sourceNode = null;
      this._processorNode = null;
      this._playbackQueue = [];
      this._isPlaying = false;
      this._idleTimer = null;
      this._idleTimeoutMs = 30000; // 30s idle timeout
    }

    get status() {
      return this._status;
    }

    // ── Public API ─────────────────────────────────────────────────────────
    async start() {
      console.log('[VoiceAgent] start() called, current status:', this._status);
      if (this._status !== 'idle' && this._status !== 'error') {
        console.warn('[VoiceAgent] Cannot start — status is', this._status, '(must be idle or error)');
        return;
      }
      this._setStatus('connecting');

      try {
        // 1. Get temporary token
        console.log('[VoiceAgent] Step 1: Fetching token...');
        const token = await this._fetchToken();
        if (!token) throw new Error('Could not obtain voice session token');
        console.log('[VoiceAgent] Step 1 OK: Token received (length:', token.length, ')');

        // 2. Get microphone access
        console.log('[VoiceAgent] Step 2: Requesting microphone...');
        await this._setupMicrophone();
        console.log('[VoiceAgent] Step 2 OK: Microphone active');

        // 3. Connect to Deepgram
        console.log('[VoiceAgent] Step 3: Connecting WebSocket...');
        await this._connectWebSocket(token);
        console.log('[VoiceAgent] Step 3 OK: WebSocket connected');
      } catch (err) {
        console.error('[VoiceAgent] Start error:', err);
        this._handleError(err.message || 'Could not start voice session');
      }
    }

    stop() {
      console.log('[VoiceAgent] stop() called');
      this._cleanup();
      this._setStatus('idle');
    }

    // ── Token Fetching ─────────────────────────────────────────────────────
    async _fetchToken() {
      try {
        console.log('[VoiceAgent] Fetching token from /api/deepgram-token...');
        const resp = await fetch('/api/deepgram-token', { method: 'POST' });
        console.log('[VoiceAgent] Token response status:', resp.status);
        if (!resp.ok) {
          const data = await resp.json().catch(() => ({}));
          console.error('[VoiceAgent] Token error body:', data);
          throw new Error(data.error || `Token request failed (${resp.status})`);
        }
        const data = await resp.json();
        console.log('[VoiceAgent] Token data keys:', Object.keys(data));
        return data.token;
      } catch (err) {
        throw new Error('Could not connect to voice service: ' + err.message);
      }
    }

    // ── Microphone Setup ───────────────────────────────────────────────────
    async _setupMicrophone() {
      try {
        this._mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            sampleRate: INPUT_SAMPLE_RATE,
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
      } catch (err) {
        if (err.name === 'NotAllowedError') {
          throw new Error('Microphone permission denied. Please allow microphone access to use voice chat.');
        }
        throw new Error('Could not access microphone: ' + err.message);
      }

      // Create AudioContext for input processing
      this._audioContext = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: INPUT_SAMPLE_RATE,
      });

      this._sourceNode = this._audioContext.createMediaStreamSource(this._mediaStream);

      // Use ScriptProcessorNode (wider browser support than AudioWorklet)
      const bufferSize = Math.round(INPUT_SAMPLE_RATE * CHUNK_DURATION_MS / 1000);
      // Round to nearest power of 2 for ScriptProcessor
      const roundedBuffer = Math.pow(2, Math.ceil(Math.log2(bufferSize)));
      this._processorNode = this._audioContext.createScriptProcessor(
        Math.min(roundedBuffer, 4096), 1, 1
      );

      this._processorNode.onaudioprocess = (e) => {
        if (this._status !== 'listening') return;
        const float32 = e.inputBuffer.getChannelData(0);

        // Calculate volume for UI animation
        let sum = 0;
        for (let i = 0; i < float32.length; i++) sum += float32[i] * float32[i];
        const rms = Math.sqrt(sum / float32.length);
        this.onVolumeChange(Math.min(rms * 5, 1)); // Normalise to 0-1

        // Convert float32 to int16 PCM
        const int16 = new Int16Array(float32.length);
        for (let i = 0; i < float32.length; i++) {
          const s = Math.max(-1, Math.min(1, float32[i]));
          int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }

        // Send to Deepgram
        if (this._ws && this._ws.readyState === WebSocket.OPEN) {
          this._ws.send(int16.buffer);
        }
      };

      this._sourceNode.connect(this._processorNode);
      this._processorNode.connect(this._audioContext.destination);
    }

    // ── WebSocket Connection ───────────────────────────────────────────────
    async _connectWebSocket(token) {
      return new Promise((resolve, reject) => {
        const url = 'wss://agent.deepgram.com/v1/agent/converse';
        this._ws = new WebSocket(url, ['token', token]);

        const connectTimeout = setTimeout(() => {
          reject(new Error('Connection timed out'));
          this._cleanup();
        }, 10000);

        this._ws.onopen = () => {
          clearTimeout(connectTimeout);
          console.log('[VoiceAgent] WebSocket opened successfully');
          // Send settings configuration
          this._sendSettings();
          resolve();
        };

        this._ws.onmessage = (event) => {
          if (event.data instanceof Blob) {
            // Binary = agent audio
            console.log('[VoiceAgent] Received audio blob, size:', event.data.size);
            this._handleAudioBlob(event.data);
          } else {
            // JSON = control message
            try {
              const msg = JSON.parse(event.data);
              console.log('[VoiceAgent] Received message:', msg.type, msg);
              this._handleMessage(msg);
            } catch (e) {
              console.warn('[VoiceAgent] Non-JSON message:', event.data);
            }
          }
        };

        this._ws.onerror = (err) => {
          clearTimeout(connectTimeout);
          console.error('[VoiceAgent] WebSocket error event:', err);
          reject(new Error('Connection error'));
        };

        this._ws.onclose = (event) => {
          clearTimeout(connectTimeout);
          console.log('[VoiceAgent] WebSocket closed — code:', event.code, 'reason:', event.reason, 'wasClean:', event.wasClean);
          if (this._status !== 'idle') {
            this._cleanup();
            this._setStatus('idle');
          }
        };
      });
    }

    // ── Send Settings ──────────────────────────────────────────────────────
    _sendSettings() {
      const settings = {
        type: 'Settings',
        audio: {
          input: {
            encoding: 'linear16',
            sample_rate: INPUT_SAMPLE_RATE,
          },
          output: {
            encoding: 'linear16',
            sample_rate: OUTPUT_SAMPLE_RATE,
            container: 'none',
          },
        },
        agent: {
          language: 'en',
          listen: {
            provider: {
              type: 'deepgram',
              model: 'nova-3',
            },
          },
          think: {
            provider: {
              type: 'open_ai',
              model: 'gpt-4o-mini',
            },
            prompt: buildSystemPrompt(this.trade),
          },
          speak: {
            provider: {
              type: 'deepgram',
              model: 'aura-2-pandora-en',
            },
          },
          greeting: buildGreeting(this.trade),
        },
      };

      console.log('[VoiceAgent] Sending Settings message:', JSON.stringify(settings, null, 2));
      if (this._ws && this._ws.readyState === WebSocket.OPEN) {
        this._ws.send(JSON.stringify(settings));
        console.log('[VoiceAgent] Settings sent OK');
      } else {
        console.error('[VoiceAgent] Cannot send Settings — WebSocket not open, readyState:', this._ws?.readyState);
      }
    }

    // ── Handle Control Messages ────────────────────────────────────────────
    _handleMessage(msg) {
      switch (msg.type) {
        case 'Welcome':
          // Connection established
          break;

        case 'SettingsApplied':
          this._setStatus('listening');
          this._resetIdleTimer();
          break;

        case 'ConversationText':
          if (msg.role === 'user') {
            this.onTranscript(msg.content, 'user');
            this._resetIdleTimer();
          } else if (msg.role === 'assistant') {
            this.onTranscript(msg.content, 'agent');
          }
          break;

        case 'UserStartedSpeaking':
          this._resetIdleTimer();
          // Stop any currently playing agent audio
          this._stopPlayback();
          this._setStatus('listening');
          break;

        case 'AgentThinking':
          this._setStatus('agent-thinking');
          break;

        case 'AgentStartedSpeaking':
          this._setStatus('agent-speaking');
          break;

        case 'AgentAudioDone':
          this._setStatus('listening');
          this._resetIdleTimer();
          break;

        case 'Error':
          console.error('[VoiceAgent] API error:', msg);
          this._handleError('The voice service encountered an error. Please try again.');
          break;

        default:
          // Ignore unknown message types
          break;
      }
    }

    // ── Audio Playback ─────────────────────────────────────────────────────
    _handleAudioBlob(blob) {
      blob.arrayBuffer().then((buffer) => {
        try {
          // Create playback AudioContext if needed
          if (!this._playbackContext) {
            this._playbackContext = new (window.AudioContext || window.webkitAudioContext)({
              sampleRate: OUTPUT_SAMPLE_RATE,
            });
            this._nextPlayTime = 0;
          }

          // Convert Int16 PCM to Float32
          const int16 = new Int16Array(buffer);
          const float32 = new Float32Array(int16.length);
          for (let i = 0; i < int16.length; i++) {
            float32[i] = int16[i] / 32768;
          }

          // Create audio buffer
          const audioBuffer = this._playbackContext.createBuffer(1, float32.length, OUTPUT_SAMPLE_RATE);
          audioBuffer.getChannelData(0).set(float32);

          const source = this._playbackContext.createBufferSource();
          source.buffer = audioBuffer;
          source.playbackRate.value = 1.1; // Slightly faster/brighter voice
          source.connect(this._playbackContext.destination);

          // Schedule gapless playback — each chunk starts exactly when the previous ends
          const now = this._playbackContext.currentTime;
          const startTime = Math.max(now, this._nextPlayTime);
          source.start(startTime);
          this._nextPlayTime = startTime + (audioBuffer.duration / 1.1);

          // Track active source for barge-in (user starts talking)
          this._activeSources = this._activeSources || [];
          this._activeSources.push(source);
          source.onended = () => {
            const idx = this._activeSources.indexOf(source);
            if (idx > -1) this._activeSources.splice(idx, 1);
          };
        } catch (err) {
          console.error('[VoiceAgent] Playback error:', err);
        }
      });
    }

    _stopPlayback() {
      // Stop all currently scheduled/playing audio sources
      if (this._activeSources) {
        this._activeSources.forEach(s => { try { s.stop(); } catch (e) { /* ignore */ } });
        this._activeSources = [];
      }
      this._nextPlayTime = 0;
    }

    // ── Idle Timer ─────────────────────────────────────────────────────────
    _resetIdleTimer() {
      clearTimeout(this._idleTimer);
      this._idleTimer = setTimeout(() => {
        if (this._status === 'listening') {
          this.stop();
        }
      }, this._idleTimeoutMs);
    }

    // ── Status Management ──────────────────────────────────────────────────
    _setStatus(status) {
      if (this._status === status) return;
      console.log('[VoiceAgent] Status change:', this._status, '→', status);
      this._status = status;
      this.onStatusChange(status);
    }

    _handleError(message) {
      this._cleanup();
      this._setStatus('error');
      this.onError(message);
    }

    // ── Cleanup ────────────────────────────────────────────────────────────
    _cleanup() {
      clearTimeout(this._idleTimer);

      // Close WebSocket
      if (this._ws) {
        try { this._ws.close(); } catch (e) { /* ignore */ }
        this._ws = null;
      }

      // Stop microphone
      if (this._mediaStream) {
        this._mediaStream.getTracks().forEach(t => t.stop());
        this._mediaStream = null;
      }

      // Disconnect audio nodes
      if (this._processorNode) {
        try { this._processorNode.disconnect(); } catch (e) { /* ignore */ }
        this._processorNode = null;
      }
      if (this._sourceNode) {
        try { this._sourceNode.disconnect(); } catch (e) { /* ignore */ }
        this._sourceNode = null;
      }

      // Close audio contexts
      if (this._audioContext && this._audioContext.state !== 'closed') {
        try { this._audioContext.close(); } catch (e) { /* ignore */ }
        this._audioContext = null;
      }
      if (this._playbackContext && this._playbackContext.state !== 'closed') {
        try { this._playbackContext.close(); } catch (e) { /* ignore */ }
        this._playbackContext = null;
      }

      // Clear playback queue
      this._stopPlayback();
    }
  }

  // ── Expose globally ──────────────────────────────────────────────────────
  window.VoiceAgent = VoiceAgent;
})();
