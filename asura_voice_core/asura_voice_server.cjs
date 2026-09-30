/**
 * ==============================================================================
 * ASURA VOICE SERVER (HTTP + Web Voice Bridge)
 * Provides real-time endpoints for Voice Receptionists & Embeddable Widgets
 * ==============================================================================
 */

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const AsuraVoiceEngine = require('./asura_voice_engine.cjs');

const PORT = process.env.VOICE_PORT || 8085;
const engine = new AsuraVoiceEngine();

const server = http.createServer(async (req, res) => {
  // Enable CORS for embeddable widgets across any website
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // 1. Return Available Personas
  if (req.method === 'GET' && pathname === '/api/voice/personas') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ personas: engine.personas }));
    return;
  }

  // 2. Return Booked Appointments List
  if (req.method === 'GET' && pathname === '/api/voice/bookings') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ bookings: engine.bookedAppointments }));
    return;
  }

  // 3. Process Conversational Voice Turn
  if (req.method === 'POST' && pathname === '/api/voice/chat') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const sessionId = payload.sessionId || 'session-' + Date.now();
        const personaId = payload.personaId || 'dental-receptionist';
        const userText = payload.text || 'Hello';

        // Ensure session has the correct persona
        const session = engine.getSession(sessionId);
        if (session.persona.id !== personaId) {
          session.persona = engine.getPersona(personaId);
        }

        const reply = await engine.generateResponse(sessionId, userText);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          sessionId,
          ...reply
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // 4. Standalone Embeddable Script Delivery
  if (req.method === 'GET' && pathname === '/embed/asura-voice-widget.js') {
    const widgetPath = path.join(__dirname, 'asura_voice_widget.js');
    if (fs.existsSync(widgetPath)) {
      res.writeHead(200, { 'Content-Type': 'application/javascript' });
      fs.createReadStream(widgetPath).pipe(res);
      return;
    }
  }

  // Fallback 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found', available: ['/api/voice/personas', '/api/voice/chat', '/api/voice/bookings', '/embed/asura-voice-widget.js'] }));
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`[ASURA-VOICE] Voice Receptionist Server listening on http://localhost:${PORT}`);
  });
}

module.exports = server;
