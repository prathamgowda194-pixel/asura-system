/**
 * ==============================================================================
 * ASURA VOICE ENGINE (Open Source Conversational Voice Core)
 * Connects STT -> LLM (Gemini / Ollama / Fallback) -> Function Calling -> TTS
 * Operating Cost: $0.00 / Zero Cost Architecture
 * ==============================================================================
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

class AsuraVoiceEngine {
  constructor(personasPath = path.join(__dirname, 'voice_personas.json')) {
    this.personasPath = personasPath;
    this.loadPersonas();
    this.activeSessions = new Map();
    this.bookedAppointments = [];
  }

  loadPersonas() {
    try {
      const data = fs.readFileSync(this.personasPath, 'utf8');
      this.personas = JSON.parse(data).personas;
      console.log(`[ASURA-VOICE] Loaded ${this.personas.length} business personas.`);
    } catch (err) {
      console.error('[ASURA-VOICE] Error loading personas:', err.message);
      this.personas = [];
    }
  }

  getPersona(personaId) {
    return this.personas.find(p => p.id === personaId) || this.personas[0];
  }

  createSession(sessionId, personaId = 'dental-receptionist') {
    const persona = this.getPersona(personaId);
    const session = {
      id: sessionId,
      persona: persona,
      history: [
        {
          role: 'system',
          content: `${persona.systemPrompt}\n\nBUSINESS INFO:\nName: ${persona.businessName}\nHours: ${persona.operatingHours}\nServices: ${JSON.stringify(persona.services)}\nFAQs: ${JSON.stringify(persona.faq)}\n\nCRITICAL CONVERSATIONAL RULES:\n1. Keep every response under 3 sentences so it sounds natural when spoken.\n2. When booking, ask for: 1) preferred day/time, 2) full name, and 3) phone number.\n3. When you have all 3, confirm the booking and say you have reserved the slot.`
        },
        {
          role: 'assistant',
          content: persona.greeting
        }
      ],
      createdAt: Date.now()
    };
    this.activeSessions.set(sessionId, session);
    return session;
  }

  getSession(sessionId) {
    return this.activeSessions.get(sessionId) || this.createSession(sessionId);
  }

  /**
   * Execute business receptionist tools (Booking, FAQ, Pricing)
   */
  executeTools(userText, persona) {
    const textLower = userText.toLowerCase();

    // 1. Check Appointment Booking Intent
    const bookingMatch = textLower.match(/(book|schedule|appointment|reserve|slot|come in|visit)/i);
    const timeMatch = textLower.match(/(tomorrow|today|monday|tuesday|wednesday|thursday|friday|saturday|sunday|\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
    
    // Check if phone or name is present
    const phoneMatch = textLower.match(/(\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})/);
    
    if (bookingMatch && timeMatch) {
      const newBooking = {
        bookingId: 'BK-' + Math.floor(100000 + Math.random() * 900000),
        business: persona.businessName,
        dateQuery: timeMatch[0],
        timestamp: new Date().toISOString(),
        status: 'CONFIRMED'
      };
      this.bookedAppointments.push(newBooking);
      return {
        toolCalled: 'book_appointment',
        result: newBooking
      };
    }

    // 2. Pricing / Services lookup
    if (textLower.includes('how much') || textLower.includes('price') || textLower.includes('cost') || textLower.includes('rate')) {
      return {
        toolCalled: 'lookup_pricing',
        result: persona.services
      };
    }

    // 3. Operating hours / Location
    if (textLower.includes('hour') || textLower.includes('open') || textLower.includes('close') || textLower.includes('located') || textLower.includes('address')) {
      return {
        toolCalled: 'lookup_hours_location',
        result: { hours: persona.operatingHours, location: persona.faq.location || 'Central Plaza' }
      };
    }

    return null;
  }

  /**
   * Primary LLM Dispatcher: Checks Gemini API Key -> Ollama Local (Free) -> Fast Fallback
   */
  async generateResponse(sessionId, userSpeechText) {
    const session = this.getSession(sessionId);
    const persona = session.persona;

    // Append user utterance to history
    session.history.push({ role: 'user', content: userSpeechText });

    // Check for tool execution
    const toolExec = this.executeTools(userSpeechText, persona);

    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    let replyText = '';

    if (geminiKey && geminiKey.length > 10 && !geminiKey.includes('DEV_DEMO')) {
      // 1. Google Gemini 1.5 Flash (Free Tier: 15 RPM, zero cost)
      try {
        replyText = await this.callGemini(session.history, geminiKey);
      } catch (e) {
        console.warn('[ASURA-VOICE] Gemini call failed, trying local Ollama:', e.message);
      }
    }

    if (!replyText) {
      // 2. Local Ollama (100% Free, Offline)
      try {
        replyText = await this.callOllama(session.history);
      } catch (e) {
        // Fallback to high-speed deterministic receptionist brain
        replyText = this.fallbackBrain(userSpeechText, persona, toolExec);
      }
    }

    // Fallback if still empty
    if (!replyText) {
      replyText = this.fallbackBrain(userSpeechText, persona, toolExec);
    }

    session.history.push({ role: 'assistant', content: replyText });
    return {
      text: replyText,
      persona: persona.name,
      business: persona.businessName,
      voice: persona.voiceName,
      tool: toolExec
    };
  }

  /**
   * Fast Gemini 1.5 Flash Cloud API call (Free Tier)
   */
  callGemini(messages, apiKey) {
    return new Promise((resolve, reject) => {
      const systemInstruction = messages.find(m => m.role === 'system')?.content || '';
      const chatContents = messages.filter(m => m.role !== 'system').map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const payload = JSON.stringify({
        contents: chatContents,
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 150
        }
      });

      const req = https.request({
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        },
        timeout: 5000
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) resolve(text.trim());
            else reject(new Error('Invalid Gemini structure: ' + data));
          } catch (err) {
            reject(err);
          }
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Gemini request timeout'));
      });
      req.write(payload);
      req.end();
    });
  }

  /**
   * Local Ollama API call (http://127.0.0.1:11434) - 100% Free & Private
   */
  callOllama(messages, model = 'llama3.1:8b') {
    return new Promise((resolve, reject) => {
      const payload = JSON.stringify({
        model: model,
        messages: messages,
        stream: false,
        options: { temperature: 0.3, num_predict: 120 }
      });

      const req = http.request({
        hostname: '127.0.0.1',
        port: 11434,
        path: '/api/chat',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        },
        timeout: 4000
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (parsed.message?.content) resolve(parsed.message.content.trim());
            else reject(new Error('No Ollama reply'));
          } catch (err) {
            reject(err);
          }
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Ollama connection timeout'));
      });
      req.write(payload);
      req.end();
    });
  }

  /**
   * Zero-Failure Deterministic Fallback Brain
   */
  fallbackBrain(userText, persona, toolExec) {
    const textLower = userText.toLowerCase();

    if (toolExec && toolExec.toolCalled === 'book_appointment') {
      return `Perfect! I have reserved that appointment for ${toolExec.result.dateQuery} under confirmation reference ${toolExec.result.bookingId}. May I get your full name and best mobile number for our calendar reminder?`;
    }

    if (toolExec && toolExec.toolCalled === 'lookup_pricing') {
      const sample = persona.services.slice(0, 2).map(s => `${s.name} is ${s.price}`).join(', and ');
      return `Our most common options are: ${sample}. Would you like me to book a convenient time for you to come in?`;
    }

    if (toolExec && toolExec.toolCalled === 'lookup_hours_location') {
      return `Our operating hours are: ${persona.operatingHours}. Does morning or afternoon work better for you?`;
    }

    if (textLower.includes('hello') || textLower.includes('hi') || textLower.includes('hey')) {
      return `Hello! How can I help you today at ${persona.businessName}? Are you looking to schedule an appointment or ask about our services?`;
    }

    if (textLower.includes('insurance')) {
      return persona.faq.insurance || `Yes, we accept all major PPO insurance plans. What provider are you currently with?`;
    }

    return `I can certainly help you with that at ${persona.businessName}. Would you like to schedule an appointment, or can I answer any specific questions about our procedures and pricing?`;
  }
}

module.exports = AsuraVoiceEngine;

if (require.main === module) {
  const engine = new AsuraVoiceEngine();
  console.log('[TEST] Voice Engine initialized successfully.');
  engine.generateResponse('test-session', 'Hi, how much does a cleaning cost and can I come tomorrow at 2 PM?')
    .then(res => console.log('\n[AGENT REPLY]:', res))
    .catch(err => console.error(err));
}
