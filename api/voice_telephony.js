/**
 * ==============================================================================
 * ASURA / PIXNOVA TELEPHONY WEBHOOK (TWILIO / TELNYX / SIP)
 * Allows any caller to dial an actual PSTN telephone number and talk to Nova!
 * Operating Cost: Free Trial / $0 Serverless on Vercel
 * ==============================================================================
 */

export default async function handler(req, res) {
  // Support both GET and POST from Twilio/Telnyx
  const query = req.query || {};
  const step = query.step || 'start';

  // Read spoken speech result from caller's phone if present
  let callerSpeech = req.body?.SpeechResult || req.query?.SpeechResult || '';

  // Initial Call Greeting
  if (step === 'start' || !callerSpeech) {
    const greetingTwiML = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Gather input="speech" action="/api/voice_telephony?step=process" method="POST" speechTimeout="auto" bargeIn="true">
        <Say voice="Polly.Joanna-Neural">
            Hello and welcome to PixNova! I'm Nova, your 24/7 AI voice receptionist. We build high-converting websites and deploy intelligent AI voice agents that answer calls for businesses around the clock. Are you looking to build a new website, deploy an AI voice receptionist, or explore our full growth bundle today?
        </Say>
    </Gather>
    <Redirect>/api/voice_telephony?step=listen</Redirect>
</Response>`;

    res.setHeader('Content-Type', 'text/xml');
    res.status(200).send(greetingTwiML);
    return;
  }

  // Process Caller Speech with Groq LPU Core (<150ms)
  const GROQ_KEY = process.env.GROQ_API_KEY || "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";
  let aiReply = "I can certainly help you with that at PixNova! Would you like me to book a 15-minute discovery call with our founder to review your project?";

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + GROQ_KEY
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are Nova, the 24/7 AI voice receptionist for PixNova Digital & AI Agency on a live telephone call.
PixNova packages: Custom Website ($499, 48-72h turnaround), 24/7 AI Voice Receptionist ($799 setup + $199/mo), Full Growth Bundle ($1,199).
CRITICAL RULES FOR TELEPHONY:
1. Speak in a completely natural, warm, human conversational tone.
2. Keep responses very brief (1 to 2 short sentences). No bullet points or long essays.
3. Be consultative, enthusiastic, and offer to book a 15-minute strategy call.`
          },
          {
            role: "user",
            content: callerSpeech
          }
        ],
        temperature: 0.35,
        max_tokens: 120
      })
    });

    if (groqRes.ok) {
      const data = await groqRes.json();
      if (data.choices?.[0]?.message?.content) {
        aiReply = data.choices[0].message.content.trim();
      }
    }
  } catch (err) {
    console.error("Groq telephony error:", err);
  }

  // Escape special XML characters in response
  const sanitizedReply = aiReply
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

  // Return conversational loop with barge-in enabled!
  const responseTwiML = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Gather input="speech" action="/api/voice_telephony?step=process" method="POST" speechTimeout="auto" bargeIn="true">
        <Say voice="Polly.Joanna-Neural">
            ${sanitizedReply}
        </Say>
    </Gather>
    <Redirect>/api/voice_telephony?step=listen</Redirect>
</Response>`;

  res.setHeader('Content-Type', 'text/xml');
  res.status(200).send(responseTwiML);
}
