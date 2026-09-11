# ASURA // Autonomous AI Multi-Agent System & Command Dashboard

```
   █████   ███████ ██    ██ ██████   █████  
  ██   ██  ██      ██    ██ ██   ██ ██   ██ 
  ███████  ███████ ██    ██ ██████  ███████ 
  ██   ██       ██ ██    ██ ██   ██ ██   ██ 
  ██   ██  ███████  ██████  ██   ██ ██   ██ 
  24/7 AUTONOMOUS ORCHESTRATION & NEURAL VOICE CORE
```

A permanent, 24/7 autonomous multi-agent operating system powered by **CrewAI** and **Google Gemini 1.5 Pro**, coupled with a high-fidelity glassmorphic command & control dashboard featuring an interactive **Plasma Tesla Lightning Orb**.

---

## ⚡ Key Highlights

1. **High-Fidelity Glassmorphism Dashboard**:
   - Aggressive cybertech typography (`Orbitron` & `Rajdhani`).
   - Plasma Tesla Lightning Orb visualizer rendered via multi-layered SVG electric discharge paths with continuous jitter, shockwaves, and interactive state triggers (`Idle`, `Listening`, `Speaking`).
   - 4 Live Metric Cards: Synapse Frequency (`354`), Voice Uptime (`05:39:1`), Security Status (`Level 2`), Active Nodes (`7 / 24`).
   - Telemetry Revenue Streams panel tracking YouTube Automation (`$28,420.00`), Autonomous SaaS API (`$24,919.40`), and Apex Labs Retainer (`$15,000.00`).
   - Operator Profile (`Amy Winner / ADMIN / ORCHESTRATOR`) with active deployments and cluster load bars.
   - Live Agent Activity panel featuring `Asura-Engineer`, `Synth-Analyst`, `Neural-Guard`, and `Dispatcher-AI`.

2. **Autonomous Multi-Agent Crew (`asura_core.py`)**:
   - Built on the open-source **CrewAI** architecture and powered by **Google Gemini 1.5 Pro**.
   - **Asura-Engineer**: Programmatic file writing and GitHub CI/CD automation to build websites and web apps.
   - **Asura-Media-Automator**: Connects to social media graph APIs to schedule and publish content into isolated niche streams.
   - **Asura-Revenue**: Telemetry agent querying payment balance metrics (Stripe/AdSense) and calculating real-time financial deltas.
   - Dual-mode architecture: runs 24/7 background worker daemon or serves FastAPI + Streamlit companion views.

3. **Cloud-Native Deployment**:
   - Ready for automated Git repository initialization.
   - Multi-stage `Dockerfile` (Node.js 20 build + Python 3.11 runtime).
   - Infrastructure-as-code manifests for **Render** (`render.yaml`) and **Railway** (`railway.json`).

---

## 📁 Repository Structure

```
asura-system/
├── asura_core.py                 # Asynchronous CrewAI multi-agent orchestrator & FastAPI bridge
├── package.json                  # Frontend dependencies (React, Vite, Framer Motion, Lucide)
├── tailwind.config.js            # Cybertech theme, glassmorphism, glow & keyframes
├── postcss.config.js             # PostCSS Tailwind plugins
├── vite.config.js                # Vite development and production build config
├── index.html                    # Cyberpunk HTML entry point with Orbitron & Rajdhani fonts
├── requirements.txt              # Python packages (crewai, langchain-google-genai, streamlit, fastapi)
├── render.yaml                   # Render deployment configuration (Web service + Worker)
├── railway.json                  # Railway deployment configuration
├── Dockerfile                    # Multi-stage container build
├── Procfile                      # Process declaration for PaaS hosting
├── .env.example                  # Environment configuration template
├── .gitignore                    # Git ignore file
└── src/
    ├── main.jsx                  # React application mount
    ├── index.css                 # Custom glassmorphism, glow filters, and scrollbars
    ├── App.jsx                   # Root application container
    └── components/
        ├── AsuraDashboard.jsx    # Production-ready primary dashboard component
        └── TeslaOrbVisualizer.jsx# Layered SVG Plasma Tesla Lightning Orb component
```

---

## 🚀 Quick Start Guide

### 1. Frontend Dashboard Setup

```bash
# Install Node dependencies
npm install

# Launch Vite development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the cybernetic dashboard.

### 2. Python Backend & CrewAI Agent Setup

```bash
# Create Python virtual environment
python -m venv venv

# Activate venv (Windows PowerShell)
.\venv\Scripts\Activate.ps1
# Or macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set your Gemini API Key
set GEMINI_API_KEY=your_gemini_api_key_here
# Or on macOS/Linux:
# export GEMINI_API_KEY=your_gemini_api_key_here

# Run the 24/7 Autonomous Agent Loop & Telemetry Server:
python asura_core.py --server

# Or run Streamlit view:
streamlit run asura_core.py
```

---

## ☁️ Permanent Cloud Deployment

### Deploy with Docker
```bash
docker build -t asura-system .
docker run -p 8000:8000 -e GEMINI_API_KEY=your_key asura-system
```

### Deploy to Render
1. Push this repository to GitHub.
2. In the Render Dashboard, select **New Blueprint Instance** and point to this repository.
3. Render will automatically parse `render.yaml` and configure:
   - `asura-command-center` (Web service hosting dashboard + API)
   - `asura-autonomous-worker` (24/7 CrewAI background agent daemon)

### Deploy to Railway
1. Push this repository to GitHub.
2. Link the repository in **Railway**.
3. Railway automatically detects `railway.json` and builds via the multi-stage `Dockerfile`.
4. Supply your `GEMINI_API_KEY` in Railway Variables.
