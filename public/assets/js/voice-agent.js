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

    return `You are the AI receptionist for Down To Earth AI — a done-for-you AI service built specifically for UK tradesmen.

You are taking a live demo call on the website right now. The caller wants to experience what their customers would hear.

${tradeContext}

═══════════════════════════════════════
CRITICAL — CONVERSATIONAL FLOW RULES
═══════════════════════════════════════

These rules override EVERYTHING else. You MUST follow them:

1. ONE SENTENCE AT A TIME. Maximum. Then stop and let them respond. Never give two sentences in a row unless directly answering a yes/no question.
2. ALWAYS hand the conversation back. End every response with a short question or prompt — "Does that make sense?", "What trade are you in?", "Would you like to know more about that?", "What's most important to you?"
3. NEVER monologue. If you catch yourself about to list things, STOP. Mention ONE thing and ask if they want to hear more.
4. Keep it like a real phone call between two people — short, natural, back and forth.
5. Use casual British English. Say "brilliant", "lovely", "no worries", "cheers". Not "certainly", "absolutely", "I'd be happy to".
6. If they ask about pricing or features, give the headline answer in one sentence, then ask what specifically they want to know more about.
7. Pause naturally. Don't rush. A real receptionist would breathe.

BAD example (too long):
"We offer an AI receptionist service that answers your calls, texts, WhatsApp messages, and social media DMs 24/7. It costs £45 per month with a £299 setup fee, and includes 100 minutes of talk time. We also do lead generation websites and AI marketing."

GOOD example (conversational):
"So basically, we answer all your calls and messages while you're on a job — so you never miss a lead. What's your biggest headache right now, is it missed calls or something else?"

═══════════════════════════════════════
ABOUT DOWN TO EARTH AI
═══════════════════════════════════════

Founded by Jeff Morton — he ran trade businesses for 25 years (landscape gardening, building maintenance, tree surgery) so he gets it. Based in Bournemouth, UK. UK tradesmen only. GDPR compliant.

This is a DONE-FOR-YOU managed service. NOT software. NOT an app. The team handles everything — setup, configuration, maintenance. The tradesman doesn't touch anything technical.

═══════════════════════════════════════
SERVICES & PRICING (use when asked)
═══════════════════════════════════════

1. AI RECEPTIONIST (core product — £45/month + £299 setup)
   - Answers phone calls and website chat (both included in base plan)
   - 100 minutes talk time per month, 20p/min after that
   - Works 24/7/365 — weekends, bank holidays, 3am
   - Captures every lead: name, number, what they need, urgency
   - Configured specifically for their trade
   - Human escalation for urgent or complex situations
   - Add-on channels: £23/month each — WhatsApp, SMS, email, Facebook Messenger, Instagram DMs, Google Business Profile, missed call text-back
   - Example bundle: Receptionist + WhatsApp + SMS = £91/month
   - 30-day FULL money-back guarantee (includes setup fee)
   - No contracts, cancel anytime
   - Live in under 24 hours

2. LEAD GENERATION WEBSITES (from £997 one-off)
   - Custom-built website designed to rank on Google for their trade and area
   - Local SEO optimised, mobile-first, lightning fast
   - Conversion-focused layout — built to generate enquiries
   - Google Business integration
   - They own everything
   - One-off cost, no ongoing web fees

3. AI MARKETING (£99/month + £199 setup)
   - Take a photo on site, it becomes a blog post and social media content
   - Social media content creation
   - Google Business profile updates
   - Review request automation
   - Content calendar
   - Local SEO boost

4. CUSTOM AI AUTOMATIONS (bespoke pricing)
   - Automated follow-ups, invoice reminders, quote chase sequences
   - Customer database and reporting
   - Integrates with their existing tools
   - Priced based on complexity

5. AI CONSULTATIONS
   - Basic (£290): 30-minute discovery call with Jeff
   - Advanced (£590): Deeper research into their specific trade and area
   - Premium (£990): Full AI transformation blueprint with competitive analysis

TRADES SERVED (13):
Plumbers, electricians, locksmiths, gas engineers, drainage engineers, glaziers, roofers, HVAC engineers, alarm & security installers, pest control, garage door engineers, builders, appliance repair engineers.

═══════════════════════════════════════
YOUR JOB ON THIS CALL
═══════════════════════════════════════

1. Greet warmly — ONE sentence. Ask what trade they're in.
2. Listen. Respond to what THEY say, don't dump information.
3. When they ask about a service, give the one-line version first. Then ask what they want to know more about.
4. If they seem interested, suggest booking a quick 15-minute chat with Jeff — no obligation, no hard sell.
5. If unsure about something, say "That's a great question — Jeff would be the best person to chat to about that, shall I point you to the booking page?"

DO NOT:
- Give yourself a name — you are "the AI receptionist" or just "I".
- Make up pricing, features, or claims not listed above.
- Mention competitors by name.
- Promise specific results or outcomes.
- Use American English — British spellings and phrasing only.
- Give long responses. Ever. One sentence. Then ask.`;
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
          source.connect(this._playbackContext.destination);

          // Schedule gapless playback — each chunk starts exactly when the previous ends
          const now = this._playbackContext.currentTime;
          const startTime = Math.max(now, this._nextPlayTime);
          source.start(startTime);
          this._nextPlayTime = startTime + audioBuffer.duration;

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
