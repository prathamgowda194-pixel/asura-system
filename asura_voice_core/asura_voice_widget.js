/**
 * ==============================================================================
 * ASURA EMBEDDABLE VOICE RECEPTIONIST WIDGET
 * Drop-in 1-line script for any website built by Asura or external clients.
 * Zero-dependency, client-side Web Audio + Speech Recognition + Neural Speech.
 * ==============================================================================
 */

(function () {
  if (window.AsuraVoiceWidgetLoaded) return;
  window.AsuraVoiceWidgetLoaded = true;

  // Retrieve script configuration attributes
  const currentScript = document.currentScript || Array.from(document.querySelectorAll('script')).pop();
  const serverUrl = currentScript?.getAttribute('data-server') || 'http://localhost:8085';
  const personaId = currentScript?.getAttribute('data-persona') || 'dental-receptionist';
  const customTitle = currentScript?.getAttribute('data-title') || 'AI Voice Receptionist';
  const accentColor = currentScript?.getAttribute('data-color') || '#00f0ff';

  // Inject CSS styles
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    .asura-voice-fab {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: radial-gradient(circle at 30% 30%, #00f0ff, #0a1128 80%);
      box-shadow: 0 0 24px rgba(0, 240, 255, 0.4), inset 0 0 12px rgba(255, 255, 255, 0.6);
      cursor: pointer;
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      border: 2px solid rgba(0, 240, 255, 0.6);
    }
    .asura-voice-fab:hover {
      transform: scale(1.08) rotate(5deg);
      box-shadow: 0 0 35px rgba(0, 240, 255, 0.7);
    }
    .asura-voice-fab svg {
      width: 28px;
      height: 28px;
      fill: #ffffff;
      filter: drop-shadow(0 0 4px #00f0ff);
    }
    .asura-voice-pulse {
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      border: 2px solid rgba(0, 240, 255, 0.5);
      animation: asuraPulse 2s infinite ease-out;
    }
    @keyframes asuraPulse {
      0% { transform: scale(1); opacity: 0.8; }
      100% { transform: scale(1.4); opacity: 0; }
    }
    .asura-voice-modal {
      position: fixed;
      bottom: 100px;
      right: 24px;
      width: 360px;
      height: 520px;
      max-width: calc(100vw - 32px);
      background: rgba(10, 15, 30, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(0, 240, 255, 0.3);
      border-radius: 20px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 240, 255, 0.2);
      z-index: 999999;
      display: none;
      flex-direction: column;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #e2e8f0;
      animation: asuraSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes asuraSlideUp {
      from { opacity: 0; transform: translateY(20px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .asura-modal-header {
      padding: 16px 20px;
      background: rgba(15, 23, 42, 0.8);
      border-bottom: 1px solid rgba(0, 240, 255, 0.15);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .asura-modal-body {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .asura-chat-msg {
      max-width: 85%;
      padding: 10px 14px;
      border-radius: 14px;
      font-size: 13.5px;
      line-height: 1.45;
    }
    .asura-msg-agent {
      align-self: flex-start;
      background: rgba(30, 41, 59, 0.9);
      border: 1px solid rgba(0, 240, 255, 0.2);
      color: #f1f5f9;
      border-bottom-left-radius: 4px;
    }
    .asura-msg-user {
      align-self: flex-end;
      background: linear-gradient(135deg, #0284c7, #0369a1);
      color: #ffffff;
      border-bottom-right-radius: 4px;
    }
    .asura-orb-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px 0;
      position: relative;
    }
    .asura-visualizer-orb {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, #00f0ff, #3b82f6 50%, #050b1a 90%);
      box-shadow: 0 0 35px rgba(0, 240, 255, 0.5), inset 0 0 20px #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.25s ease;
      cursor: pointer;
    }
    .asura-orb-speaking {
      animation: asuraOrbPulse 1s infinite alternate ease-in-out;
      box-shadow: 0 0 50px rgba(0, 240, 255, 0.9), inset 0 0 30px #ffffff;
      transform: scale(1.1);
    }
    .asura-orb-listening {
      animation: asuraOrbListen 0.8s infinite alternate ease-in-out;
      background: radial-gradient(circle at 35% 35%, #10b981, #059669 50%, #022c22 90%);
      box-shadow: 0 0 45px rgba(16, 185, 129, 0.7);
    }
    @keyframes asuraOrbPulse {
      from { transform: scale(1); filter: hue-rotate(0deg); }
      to { transform: scale(1.15); filter: hue-rotate(40deg); }
    }
    @keyframes asuraOrbListen {
      from { transform: scale(0.95); }
      to { transform: scale(1.08); }
    }
    .asura-modal-footer {
      padding: 14px 16px;
      background: rgba(15, 23, 42, 0.9);
      border-top: 1px solid rgba(0, 240, 255, 0.15);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .asura-status-text {
      text-align: center;
      font-size: 11px;
      color: #94a3b8;
      letter-spacing: 0.5px;
      margin-top: 8px;
      font-family: monospace;
    }
    .asura-mic-btn {
      width: 100%;
      padding: 12px;
      border-radius: 12px;
      border: 1px solid rgba(0, 240, 255, 0.4);
      background: linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(14, 165, 233, 0.1));
      color: #00f0ff;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s;
    }
    .asura-mic-btn:hover {
      background: linear-gradient(135deg, rgba(0, 240, 255, 0.35), rgba(14, 165, 233, 0.25));
      box-shadow: 0 0 15px rgba(0, 240, 255, 0.3);
    }
    .asura-mic-btn.active {
      background: #ef4444;
      border-color: #f87171;
      color: #ffffff;
      animation: asuraPulse 1.5s infinite;
    }
  `;
  document.head.appendChild(styleEl);

  // Build Floating FAB Button
  const fab = document.createElement('div');
  fab.className = 'asura-voice-fab';
  fab.title = `Talk to ${customTitle}`;
  fab.innerHTML = `
    <div class="asura-voice-pulse"></div>
    <svg viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
  `;
  document.body.appendChild(fab);

  // Build Voice Modal
  const modal = document.createElement('div');
  modal.className = 'asura-voice-modal';
  modal.innerHTML = `
    <div class="asura-modal-header">
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="width:8px; height:8px; border-radius:50%; background:#00f0ff; box-shadow:0 0 8px #00f0ff;"></span>
        <div>
          <div style="font-weight:700; font-size:14px; color:#ffffff;">${customTitle}</div>
          <div style="font-size:10px; color:#38bdf8; font-family:monospace;">24/7 AUTONOMOUS RECEPTIONIST</div>
        </div>
      </div>
      <button id="asura-close-btn" style="background:none; border:none; color:#94a3b8; font-size:20px; cursor:pointer;">&times;</button>
    </div>

    <div class="asura-orb-container">
      <div class="asura-visualizer-orb" id="asura-orb">
        <svg style="width:36px; height:36px; fill:#ffffff;" viewBox="0 0 24 24">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
          <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
        </svg>
      </div>
      <div class="asura-status-text" id="asura-status">TAP MIC OR ORB TO SPEAK</div>
    </div>

    <div class="asura-modal-body" id="asura-chat-body">
      <div class="asura-chat-msg asura-msg-agent" id="asura-welcome-msg">
        Hello! How can I assist you with your appointment or questions today?
      </div>
    </div>

    <div class="asura-modal-footer">
      <button class="asura-mic-btn" id="asura-mic-toggle">
        <svg style="width:16px; height:16px; fill:currentColor;" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
        <span>Hold to Speak</span>
      </button>
    </div>
  `;
  document.body.appendChild(modal);

  // Widget Logic & State
  let isOpen = false;
  let isListening = false;
  let sessionId = 'web-' + Math.random().toString(36).substring(2, 9);
  const orb = modal.querySelector('#asura-orb');
  const statusEl = modal.querySelector('#asura-status');
  const chatBody = modal.querySelector('#asura-chat-body');
  const micBtn = modal.querySelector('#asura-mic-toggle');
  const closeBtn = modal.querySelector('#asura-close-btn');

  function toggleModal() {
    isOpen = !isOpen;
    modal.style.display = isOpen ? 'flex' : 'none';
  }

  fab.addEventListener('click', toggleModal);
  closeBtn.addEventListener('click', toggleModal);

  // Setup Browser Speech Recognition (100% Free, Zero Cost)
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;

  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      isListening = true;
      statusEl.textContent = 'LISTENING...';
      orb.className = 'asura-visualizer-orb asura-orb-listening';
      micBtn.classList.add('active');
      micBtn.querySelector('span').textContent = 'Listening...';
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      appendMessage(transcript, 'user');
      statusEl.textContent = 'PROCESSING...';
      orb.className = 'asura-visualizer-orb';
      await sendVoiceQuery(transcript);
    };

    recognition.onerror = (e) => {
      statusEl.textContent = 'MIC IDLE (TAP TO RETRY)';
      orb.className = 'asura-visualizer-orb';
      micBtn.classList.remove('active');
      micBtn.querySelector('span').textContent = 'Tap to Speak';
      isListening = false;
    };

    recognition.onend = () => {
      isListening = false;
      micBtn.classList.remove('active');
      micBtn.querySelector('span').textContent = 'Tap to Speak';
    };
  } else {
    statusEl.textContent = 'Speech recognition not supported in this browser.';
  }

  function toggleMic() {
    if (!recognition) {
      alert('Your browser does not support Speech Recognition. Please use Chrome, Edge, or Safari.');
      return;
    }
    if (isListening) {
      recognition.stop();
    } else {
      window.speechSynthesis.cancel();
      recognition.start();
    }
  }

  micBtn.addEventListener('click', toggleMic);
  orb.addEventListener('click', toggleMic);

  function appendMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `asura-chat-msg asura-msg-${sender}`;
    div.textContent = text;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  async function sendVoiceQuery(text) {
    try {
      const res = await fetch(`${serverUrl}/api/voice/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, personaId, text })
      });
      const data = await res.json();
      if (data.text) {
        appendMessage(data.text, 'agent');
        speakText(data.text);
      }
    } catch (err) {
      console.warn('Asura server offline, using local client brain fallback.');
      const localReply = `Thank you for asking! I have noted your inquiry regarding "${text}". Would you like me to book an appointment with our staff?`;
      appendMessage(localReply, 'agent');
      speakText(localReply);
    }
  }

  function speakText(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      statusEl.textContent = 'SPEAKING...';
      orb.className = 'asura-visualizer-orb asura-orb-speaking';
    };

    utterance.onend = () => {
      statusEl.textContent = 'READY (TAP MIC TO SPEAK)';
      orb.className = 'asura-visualizer-orb';
    };

    window.speechSynthesis.speak(utterance);
  }
})();
