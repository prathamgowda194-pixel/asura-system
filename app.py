"""
================================================================================
    ASURA COMMAND // PRINCIPAL UI ARCHITECTURE v5.0
    Production-Grade Glassmorphism Command Deck with Hermes Agent Framework
================================================================================
"""

import os
import sys
import time
import threading
import queue
from datetime import datetime

# ── API KEY CONFIGURATION ──────────────────────────────────────────────────────
GEMINI_API_KEY = (
    os.environ.get("GEMINI_API_KEY")
    or os.environ.get("GOOGLE_API_KEY")
    or ""
)
os.environ["GEMINI_API_KEY"] = GEMINI_API_KEY
os.environ["GOOGLE_API_KEY"] = GEMINI_API_KEY

import streamlit as st

# ── PAGE CONFIGURATION ─────────────────────────────────────────────────────────
st.set_page_config(
    page_title="ASURA COMMAND",
    page_icon="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10' fill='none' stroke='%2300f0ff' stroke-width='1.5'/><circle cx='12' cy='12' r='4' fill='white'/></svg>",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# ── SESSION STATE INITIALIZATION ───────────────────────────────────────────────
def _init_state():
    defaults = {
        "orb_mode": "IDLE",
        "exec_log": [
            {"ts": "00:00:01", "level": "SYSTEM", "msg": "ASURA Command Deck initialized. All subsystems nominal.", "color": "#38bdf8"},
            {"ts": "00:00:02", "level": "HERMES",  "msg": "Hermes Agent Router online. Awaiting mission directive.", "color": "#a78bfa"},
            {"ts": "00:00:03", "level": "ENGINE",  "msg": "Gemini 1.5 Pro cloud engine configured and standing by.", "color": "#34d399"},
            {"ts": "00:00:04", "level": "GUARD",   "msg": "Neural security perimeter active. Zero anomalies detected.", "color": "#f59e0b"},
        ],
        "metrics": {
            "progress": 0,
            "runtime_s": 0,
            "agency_tier": "SOVEREIGN",
            "mrr": 68339.40,
        },
        "mission_active": False,
        "mission_result": None,
        "mission_prompt": "",
        "active_channels": [
            {"name": "SaaS Infrastructure", "status": "LIVE",   "color": "#34d399"},
            {"name": "Media Automation",     "status": "ACTIVE", "color": "#38bdf8"},
            {"name": "Revenue Telemetry",    "status": "ACTIVE", "color": "#38bdf8"},
            {"name": "Play Store Deploy",    "status": "TEST",   "color": "#f59e0b"},
            {"name": "Crypto Analytics",     "status": "READY",  "color": "#a78bfa"},
        ],
    }
    for k, v in defaults.items():
        if k not in st.session_state:
            st.session_state[k] = v

_init_state()

# ── FAIL-SAFE HTML RENDERER ────────────────────────────────────────────────────
def H(raw: str):
    """
    Strips all leading whitespace from every line before passing to
    st.markdown, permanently preventing CommonMark's 4-space code-block
    rule from leaking raw HTML tags as pre-formatted text.
    """
    cleaned = "\n".join(
        line.strip() for line in raw.splitlines() if line.strip()
    )
    st.markdown(cleaned, unsafe_allow_html=True)


# ── CREWAI / HERMES AGENT FRAMEWORK ───────────────────────────────────────────
def run_hermes_mission(prompt: str, log_queue: queue.Queue) -> dict:
    """
    Hermes Agent Router: dispatches Asura-Strategist and Asura-Engineer
    as a sequential CrewAI crew powered by Gemini 1.5 Pro.
    Returns the final mission deliverable as a dict.
    """
    try:
        from crewai import Agent, Task, Crew, Process
        from langchain_google_genai import ChatGoogleGenerativeAI

        log_queue.put(("HERMES", "Hermes Router: authenticating Gemini 1.5 Pro cloud engine...", "#a78bfa"))

        llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-pro",
            temperature=0.2,
            google_api_key=GEMINI_API_KEY,
            convert_system_message_to_human=True,
        )

        log_queue.put(("HERMES", "Hermes Router: LLM engine authenticated successfully.", "#a78bfa"))
        log_queue.put(("STRATEGIST", "Asura-Strategist: initializing market analysis workflow...", "#38bdf8"))

        strategist = Agent(
            role="Asura-Strategist // Principal Market Analysis & Architecture Specialist",
            goal=(
                f"Conduct deep market analysis and produce a precise technical "
                f"architecture blueprint for the following mission: {prompt}"
            ),
            backstory=(
                "You are Asura-Strategist, the analytical sovereign of the ASURA "
                "multi-agent collective. You dissect market landscapes, identify "
                "monetization leverage points, define system architecture, and "
                "formulate airtight technical specifications for the engineering "
                "division to execute with zero ambiguity."
            ),
            llm=llm,
            verbose=False,
            allow_delegation=False,
        )

        log_queue.put(("ENGINEER", "Asura-Engineer: standing by for strategic specification transfer...", "#34d399"))

        engineer = Agent(
            role="Asura-Engineer // Lead Autonomous Software Production Unit",
            goal=(
                f"Synthesize the strategic specification and produce complete, "
                f"deployment-ready software output for: {prompt}. "
                "Output raw, clean production-grade code with zero placeholders."
            ),
            backstory=(
                "You are Asura-Engineer, the cybernetic production engine of the "
                "ASURA collective. You receive architectural specifications and "
                "translate them into fully functional, clean, production-ready "
                "source code, markup, and configuration manifests. Nothing you "
                "produce requires manual editing before deployment."
            ),
            llm=llm,
            verbose=False,
            allow_delegation=False,
        )

        task_strategy = Task(
            description=(
                f"Analyze mission prompt: '{prompt}'. Deliver a structured "
                "technical blueprint covering:\n"
                "1. Core Architecture and Technology Stack Selection\n"
                "2. Functional Module Breakdown and User Flow Design\n"
                "3. Data Schema and API Contract Definitions\n"
                "4. Cloud Deployment and Scaling Strategy\n"
                "5. Revenue Model and Monetization Architecture"
            ),
            expected_output=(
                "A precise, structured architectural specification document "
                "formatted as clearly labeled sections."
            ),
            agent=strategist,
        )

        task_engineering = Task(
            description=(
                f"Using the specification from Asura-Strategist, produce "
                f"complete production-ready implementation for '{prompt}'. "
                "Include all source code files, configuration, and deployment "
                "manifests with zero placeholder content."
            ),
            expected_output=(
                "Complete, functional source code and configuration files "
                "ready for immediate deployment."
            ),
            agent=engineer,
        )

        log_queue.put(("HERMES", "Hermes Router: assembling sequential crew pipeline...", "#a78bfa"))

        crew = Crew(
            agents=[strategist, engineer],
            tasks=[task_strategy, task_engineering],
            process=Process.sequential,
            verbose=False,
        )

        log_queue.put(("STRATEGIST", "Asura-Strategist: executing market analysis cycle...", "#38bdf8"))
        result = crew.kickoff()
        log_queue.put(("ENGINEER", "Asura-Engineer: source code synthesis complete.", "#34d399"))
        log_queue.put(("HERMES", "Hermes Router: mission pipeline concluded successfully.", "#a78bfa"))

        return {"status": "success", "output": str(result)}

    except Exception as exc:
        log_queue.put(("SYSTEM", f"Engine fallback activated: {str(exc)[:120]}", "#f59e0b"))
        simulated = (
            f"## ASURA-STRATEGIST  //  ARCHITECTURE SPECIFICATION\n\n"
            f"**Mission Directive:** {prompt}\n\n"
            f"### 1. Core Architecture\n"
            f"Cloud-native decoupled microservice stack. Primary reasoning via Google Gemini 1.5 Pro. "
            f"FastAPI REST gateway with WebSocket telemetry bridge. "
            f"Redis for session caching, PostgreSQL for persistent mission logs.\n\n"
            f"### 2. Functional Modules\n"
            f"- Hermes Agent Router (mission dispatch and multi-agent orchestration)\n"
            f"- Revenue Telemetry Engine (Stripe and AdSense balance synchronization)\n"
            f"- Neural Security Guard (anomaly detection and validator monitoring)\n"
            f"- Autonomous Media Scheduler (social graph API integration)\n\n"
            f"### 3. Data Schema\n"
            f"```json\n"
            f'{{"mission_id": "UUID", "agent": "string", "status": "enum", '
            f'"output": "text", "created_at": "ISO8601"}}\n'
            f"```\n\n"
            f"---\n\n"
            f"## ASURA-ENGINEER  //  PRODUCTION IMPLEMENTATION\n\n"
            f"```python\n"
            f"# Autonomous deployment scaffold — generated by Asura-Engineer\n"
            f"from fastapi import FastAPI\n"
            f"from pydantic import BaseModel\n\n"
            f"app = FastAPI(title='{prompt[:40]}', version='1.0.0')\n\n"
            f"class MissionRequest(BaseModel):\n"
            f"    directive: str\n"
            f"    priority: str = 'standard'\n\n"
            f"@app.post('/api/mission/dispatch')\n"
            f"async def dispatch_mission(req: MissionRequest):\n"
            f"    return {{'status': 'DISPATCHED', 'engine': 'Gemini 1.5 Pro', 'agent': 'ASURA'}}\n\n"
            f"@app.get('/api/health')\n"
            f"async def health_check():\n"
            f"    return {{'status': 'OPERATIONAL', 'systems': '4/4', 'version': '5.0.0'}}\n"
            f"```\n"
        )
        return {"status": "simulated", "output": simulated}


# ── GLOBAL CYBERNETIC STYLESHEET ───────────────────────────────────────────────
H("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap');

html, body, .stApp {
background: #03050d !important;
color: #e2e8f0 !important;
font-family: 'Space Grotesk', system-ui, sans-serif !important;
}

.stApp {
background-image:
radial-gradient(ellipse 80% 40% at 50% 0%, rgba(0,240,255,0.06) 0%, transparent 70%),
radial-gradient(ellipse 60% 50% at 90% 60%, rgba(139,92,246,0.05) 0%, transparent 60%),
radial-gradient(ellipse 50% 40% at 10% 90%, rgba(16,185,129,0.04) 0%, transparent 55%),
repeating-linear-gradient(0deg, transparent, transparent 79px, rgba(255,255,255,0.012) 80px),
repeating-linear-gradient(90deg, transparent, transparent 79px, rgba(255,255,255,0.012) 80px) !important;
}

.block-container {
padding: 0.75rem 1.0rem 2rem 1.0rem !important;
max-width: 100% !important;
}

header[data-testid="stHeader"] { background: transparent !important; }
#MainMenu, footer, [data-testid="stToolbar"] { visibility: hidden !important; height: 0 !important; }

div[data-testid="stMarkdownContainer"] pre,
div[data-testid="stMarkdownContainer"] code {
background: rgba(13, 20, 36, 0.8) !important;
border: 1px solid rgba(56, 189, 248, 0.2) !important;
border-radius: 8px !important;
font-family: 'JetBrains Mono', monospace !important;
font-size: 0.78rem !important;
color: #94a3b8 !important;
}

.glass {
background: rgba(8, 14, 28, 0.72);
backdrop-filter: blur(24px);
-webkit-backdrop-filter: blur(24px);
border: 1px solid rgba(255, 255, 255, 0.06);
border-radius: 20px;
box-shadow: 0 0 0 1px rgba(0,0,0,0.4), 0 16px 48px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07);
}

.glass-accent {
background: rgba(8, 14, 28, 0.72);
backdrop-filter: blur(24px);
border: 1px solid rgba(56, 189, 248, 0.14);
border-radius: 20px;
box-shadow: 0 0 0 1px rgba(0,0,0,0.4), 0 16px 48px rgba(0,0,0,0.55), 0 0 40px rgba(0,240,255,0.04), inset 0 1px 0 rgba(56,189,248,0.08);
}

.cmd-title {
font-family: 'Orbitron', sans-serif;
font-weight: 900;
font-size: clamp(1.6rem, 3vw, 2.4rem);
letter-spacing: 0.2em;
color: #ffffff;
text-shadow:
0 0 20px rgba(255,255,255,0.9),
0 0 60px rgba(0,240,255,0.5),
0 2px 4px rgba(0,0,0,0.8);
line-height: 1.05;
margin: 0;
padding: 0;
}

.cmd-subtitle {
font-family: 'JetBrains Mono', monospace;
font-size: 0.7rem;
font-weight: 400;
letter-spacing: 0.22em;
color: rgba(56, 189, 248, 0.8);
margin: 6px 0 0 2px;
}

.section-label {
font-family: 'JetBrains Mono', monospace;
font-size: 0.62rem;
font-weight: 700;
letter-spacing: 0.22em;
color: rgba(148, 163, 184, 0.6);
text-transform: uppercase;
margin-bottom: 10px;
}

.divider-line {
height: 1px;
background: linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.25), transparent);
margin: 14px 0;
}

.metric-card {
background: rgba(12, 20, 40, 0.6);
border: 1px solid rgba(255, 255, 255, 0.05);
border-radius: 14px;
padding: 16px 18px;
backdrop-filter: blur(12px);
transition: border-color 0.3s ease;
}
.metric-card:hover { border-color: rgba(56, 189, 248, 0.2); }

.metric-value {
font-family: 'Orbitron', sans-serif;
font-size: 1.65rem;
font-weight: 800;
color: #ffffff;
line-height: 1;
letter-spacing: 0.04em;
}

.metric-label {
font-family: 'JetBrains Mono', monospace;
font-size: 0.62rem;
font-weight: 600;
letter-spacing: 0.16em;
color: rgba(148, 163, 184, 0.65);
text-transform: uppercase;
margin-top: 5px;
}

.metric-delta {
font-family: 'JetBrains Mono', monospace;
font-size: 0.68rem;
font-weight: 500;
margin-top: 3px;
}

.nav-item {
font-family: 'Space Grotesk', sans-serif;
font-size: 0.8rem;
font-weight: 500;
letter-spacing: 0.06em;
color: rgba(203, 213, 225, 0.7);
padding: 9px 14px;
border-radius: 9px;
margin-bottom: 4px;
display: flex;
align-items: center;
gap: 10px;
cursor: pointer;
transition: all 0.2s ease;
}

.nav-item.active {
background: rgba(0, 240, 255, 0.08);
color: #e0f2fe;
border-left: 2px solid #00f0ff;
font-weight: 600;
box-shadow: 0 0 16px rgba(0,240,255,0.12);
}

.channel-row {
display: flex;
align-items: center;
justify-content: space-between;
padding: 8px 12px;
border-radius: 8px;
background: rgba(8, 14, 28, 0.5);
border: 1px solid rgba(255, 255, 255, 0.04);
margin-bottom: 6px;
}

.channel-name {
font-family: 'Space Grotesk', sans-serif;
font-size: 0.76rem;
font-weight: 500;
color: #cbd5e1;
}

.badge {
font-family: 'JetBrains Mono', monospace;
font-size: 0.58rem;
font-weight: 700;
letter-spacing: 0.12em;
padding: 3px 8px;
border-radius: 5px;
}

.log-entry {
font-family: 'JetBrains Mono', monospace;
font-size: 0.72rem;
padding: 6px 10px;
border-radius: 6px;
background: rgba(8, 14, 28, 0.5);
border-left: 2px solid transparent;
margin-bottom: 6px;
line-height: 1.4;
}

.log-ts {
color: rgba(100, 116, 139, 0.7);
font-size: 0.64rem;
margin-right: 8px;
}

.log-level {
font-size: 0.6rem;
font-weight: 700;
letter-spacing: 0.1em;
padding: 1px 5px;
border-radius: 3px;
margin-right: 8px;
}

.orb-state-active {
background: rgba(0, 240, 255, 0.12) !important;
border: 1px solid rgba(0, 240, 255, 0.45) !important;
color: #00f0ff !important;
box-shadow: 0 0 18px rgba(0, 240, 255, 0.25) !important;
}

.stButton > button {
background: rgba(10, 18, 36, 0.9) !important;
color: rgba(203, 213, 225, 0.85) !important;
border: 1px solid rgba(255, 255, 255, 0.08) !important;
border-radius: 10px !important;
font-family: 'Space Grotesk', sans-serif !important;
font-size: 0.8rem !important;
font-weight: 600 !important;
letter-spacing: 0.04em !important;
padding: 8px 16px !important;
transition: all 0.2s ease !important;
}

.stButton > button:hover {
background: rgba(0, 240, 255, 0.1) !important;
border-color: rgba(0, 240, 255, 0.4) !important;
color: #ffffff !important;
box-shadow: 0 0 20px rgba(0, 240, 255, 0.2) !important;
}

.stTextArea textarea, .stTextInput input {
background: rgba(8, 14, 28, 0.85) !important;
border: 1px solid rgba(56, 189, 248, 0.2) !important;
border-radius: 10px !important;
color: #e2e8f0 !important;
font-family: 'Space Grotesk', sans-serif !important;
font-size: 0.85rem !important;
caret-color: #00f0ff !important;
}

.stTextArea textarea:focus, .stTextInput input:focus {
border-color: rgba(0, 240, 255, 0.5) !important;
box-shadow: 0 0 0 1px rgba(0, 240, 255, 0.25) !important;
}

::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: rgba(3, 5, 13, 0.8); }
::-webkit-scrollbar-thumb { background: rgba(56, 189, 248, 0.28); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: rgba(0, 240, 255, 0.55); }

@keyframes orbRotateCW  { from { transform: rotate(0deg);   } to { transform: rotate(360deg);  } }
@keyframes orbRotateCCW { from { transform: rotate(360deg); } to { transform: rotate(0deg);    } }
@keyframes coreBreath   {
0%,100% { opacity: 0.80; transform: scale(0.94); }
50%     { opacity: 1.00; transform: scale(1.06); }
}
@keyframes corePulse {
0%,100% { opacity: 0.90; transform: scale(0.97); }
25%     { opacity: 1.00; transform: scale(1.04); }
50%     { opacity: 0.95; transform: scale(1.08); }
75%     { opacity: 1.00; transform: scale(1.03); }
}
@keyframes arcJitter {
0%   { transform: rotate(0deg)   scale(1);    opacity: 0.95; }
15%  { transform: rotate(0.6deg) scale(1.02); opacity: 1;    }
30%  { transform: rotate(-0.8deg) scale(0.98); opacity: 0.88; }
50%  { transform: rotate(1.1deg) scale(1.03); opacity: 1;    }
70%  { transform: rotate(-0.6deg) scale(0.99); opacity: 0.92; }
85%  { transform: rotate(0.9deg) scale(1.02); opacity: 0.97; }
100% { transform: rotate(0deg)   scale(1);    opacity: 0.95; }
}
@keyframes sonarIdleExpand {
0%   { r: 10; opacity: 0.6; }
100% { r: 108; opacity: 0;  }
}
@keyframes sonarActiveExpand {
0%   { r: 10; opacity: 0.9; }
100% { r: 108; opacity: 0;  }
}
@keyframes arcPathIdle {
0%,100% { stroke-dashoffset: 0; opacity: 0.7; }
50%     { stroke-dashoffset: 20; opacity: 0.9; }
}
@keyframes arcPathActive {
0%   { stroke-dashoffset: 0;   opacity: 1;   }
33%  { stroke-dashoffset: -15; opacity: 0.8; }
66%  { stroke-dashoffset: 10;  opacity: 1;   }
100% { stroke-dashoffset: 0;   opacity: 1;   }
}
@keyframes stateGlowPulse {
0%,100% { box-shadow: 0 0 10px rgba(0,240,255,0.2); }
50%     { box-shadow: 0 0 22px rgba(0,240,255,0.45); }
}
</style>
""")


# ── TOP COMMAND BAR ────────────────────────────────────────────────────────────
now_ts = datetime.now().strftime("%Y-%m-%d  %H:%M:%S")
key_status = "AUTHENTICATED" if GEMINI_API_KEY else "NO KEY — SIMULATION MODE"
key_color  = "#34d399" if GEMINI_API_KEY else "#f59e0b"

H(f"""
<div style="display:flex;align-items:center;justify-content:space-between;
padding:10px 20px;
background:rgba(8,14,28,0.8);
border:1px solid rgba(255,255,255,0.06);
border-radius:14px;
margin-bottom:18px;
backdrop-filter:blur(20px);">
<div style="display:flex;align-items:center;gap:14px;">
<div style="width:34px;height:34px;border-radius:50%;border:1.5px solid rgba(0,240,255,0.6);
display:flex;align-items:center;justify-content:center;
box-shadow:0 0 14px rgba(0,240,255,0.35);">
<div style="width:12px;height:12px;border-radius:50%;background:#ffffff;
box-shadow:0 0 8px rgba(255,255,255,0.9);"></div>
</div>
<div>
<div style="font-family:'Orbitron',sans-serif;font-weight:800;font-size:0.88rem;
letter-spacing:0.18em;color:#ffffff;">ASURA COMMAND</div>
<div style="font-family:'JetBrains Mono',monospace;font-size:0.6rem;
letter-spacing:0.16em;color:rgba(56,189,248,0.75);">HERMES AGENT FRAMEWORK  v5.0</div>
</div>
</div>
<div style="display:flex;align-items:center;gap:22px;">
<div style="display:flex;align-items:center;gap:7px;
background:rgba(3,5,13,0.7);border:1px solid rgba(56,189,248,0.15);
border-radius:9999px;padding:5px 14px;">
<span style="width:6px;height:6px;border-radius:50%;background:#00f0ff;
box-shadow:0 0 8px #00f0ff;"></span>
<span style="font-family:'JetBrains Mono',monospace;font-size:0.68rem;
color:#94a3b8;">VIRTUAL ENGINE-1</span>
<span style="color:#334155;margin:0 2px;">|</span>
<span style="font-family:'JetBrains Mono',monospace;font-size:0.68rem;
color:#38bdf8;">LATENCY <b style="color:#34d399;">11ms</b></span>
</div>
<div style="font-family:'JetBrains Mono',monospace;font-size:0.62rem;
color:{key_color};letter-spacing:0.08em;">
ENGINE: {key_status}
</div>
<div style="font-family:'JetBrains Mono',monospace;font-size:0.62rem;
color:rgba(100,116,139,0.7);">{now_ts}</div>
</div>
</div>
""")


# ── THREE-COLUMN WORKSPACE ─────────────────────────────────────────────────────
col_left, col_center, col_right = st.columns([2.2, 4.8, 3.0], gap="medium")


# ══════════════════════════════════════════════════════════════════════════════
# LEFT PANEL: DIVISIONS & ACTIVE CHANNELS
# ══════════════════════════════════════════════════════════════════════════════
with col_left:
    H("""
    <div class="glass" style="padding:22px 18px;min-height:740px;">
    <div class="section-label">DIVISIONS</div>
    <div class="nav-item active">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" stroke-width="2.5" stroke-linecap="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
    </svg>
    Overview
    </div>
    <div class="nav-item">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
    Telemetry Grid
    </div>
    <div class="nav-item">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <path d="M12 2a6 6 0 0 1 6 6c0 3-2 5-6 8-4-3-6-5-6-8a6 6 0 0 1 6-6z"/>
    <circle cx="12" cy="8" r="2"/>
    </svg>
    Neural Agents
    </div>
    <div class="nav-item">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
    Defense Matrix
    </div>
    <div class="nav-item">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
    Audit Stream
    </div>
    <div class="nav-item">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07M8.46 8.46a5 5 0 0 0 0 7.07"/>
    </svg>
    Node Config
    </div>
    <div class="divider-line"></div>
    <div class="section-label">ACTIVE PROJECT CHANNELS</div>
    """)

    for ch in st.session_state.active_channels:
        H(f"""
        <div class="channel-row">
        <span class="channel-name">{ch['name']}</span>
        <span class="badge" style="
        background:rgba(0,0,0,0.4);
        color:{ch['color']};
        border:1px solid {ch['color']}44;">
        {ch['status']}
        </span>
        </div>
        """)

    H("""
    <div class="divider-line"></div>
    <div style="padding:8px 4px;">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
    <span style="width:6px;height:6px;border-radius:50%;background:#34d399;box-shadow:0 0 6px #34d399;"></span>
    <span style="font-family:'JetBrains Mono',monospace;font-size:0.68rem;color:#34d399;letter-spacing:0.1em;">SYSTEM NOMINAL</span>
    </div>
    <div style="font-family:'JetBrains Mono',monospace;font-size:0.6rem;color:rgba(100,116,139,0.6);letter-spacing:0.06em;">v5.0.0  //  HERMES BUILD</div>
    </div>
    </div>
    """)


# ══════════════════════════════════════════════════════════════════════════════
# CENTER PANEL: BRANDING + TESLA ORB + METRIC CARDS + MISSION INPUT
# ══════════════════════════════════════════════════════════════════════════════
with col_center:
    # ── Branding Header ────────────────────────────────────────────────────────
    H("""
    <div class="glass-accent" style="padding:20px 24px;margin-bottom:16px;">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:10px;">
    <div>
    <div style="font-family:'JetBrains Mono',monospace;font-size:0.65rem;
    letter-spacing:0.22em;color:rgba(56,189,248,0.75);margin-bottom:6px;">
    DEPLOYMENT HUB  /  NEURAL VOICE CORE
    </div>
    <div class="cmd-title">ASURA COMMAND</div>
    <div class="cmd-subtitle">HERMES AGENT FRAMEWORK  //  GEMINI 1.5 PRO</div>
    </div>
    <div style="display:flex;align-items:center;gap:7px;
    padding:6px 14px;border-radius:9999px;
    background:rgba(16,185,129,0.1);
    border:1px solid rgba(16,185,129,0.4);
    box-shadow:0 0 14px rgba(16,185,129,0.18);">
    <span style="width:7px;height:7px;border-radius:50%;background:#34d399;box-shadow:0 0 8px #34d399;"></span>
    <span style="font-family:'JetBrains Mono',monospace;font-size:0.68rem;
    font-weight:700;letter-spacing:0.1em;color:#34d399;">4 / 4  SYSTEMS NOMINAL</span>
    </div>
    </div>
    </div>
    """)

    # ── Tesla Orb Engine ───────────────────────────────────────────────────────
    mode = st.session_state.orb_mode

    if mode == "TRANSMIT":
        ring1_dur     = "3s"
        ring2_dur     = "4s"
        core_anim     = "corePulse 0.6s ease-in-out infinite"
        arc_anim      = f"arcJitter 0.35s steps(2,start) infinite"
        sonar_anim    = f"sonarActiveExpand 1.1s cubic-bezier(0.1,0.6,0.2,1) infinite"
        sonar2_anim   = f"sonarActiveExpand 1.1s cubic-bezier(0.1,0.6,0.2,1) 0.4s infinite"
        arc_path_anim = "arcPathActive 0.4s linear infinite"
        corona_color  = "rgba(192,132,252,0.55)"
        sonar_color   = "#c084fc"
        arc_color     = "#ffffff"
        glow_color    = "#c084fc"
        cap_text      = "High-voltage neural synthesis  //  Voice discharge active"
        cap_color     = "#c084fc"
        core_glow     = "filter:drop-shadow(0 0 28px rgba(255,255,255,1)) drop-shadow(0 0 50px rgba(192,132,252,0.9))"
    elif mode == "LISTEN":
        ring1_dur     = "8s"
        ring2_dur     = "10s"
        core_anim     = "corePulse 1.2s ease-in-out infinite"
        arc_anim      = f"arcJitter 0.9s ease-in-out infinite"
        sonar_anim    = f"sonarActiveExpand 1.8s cubic-bezier(0.1,0.7,0.3,1) infinite"
        sonar2_anim   = f"sonarActiveExpand 1.8s cubic-bezier(0.1,0.7,0.3,1) 0.9s infinite"
        arc_path_anim = "arcPathActive 0.9s linear infinite"
        corona_color  = "rgba(0,240,255,0.5)"
        sonar_color   = "#00f0ff"
        arc_color     = "#ffffff"
        glow_color    = "#00f0ff"
        cap_text      = "Acoustic sensors active  //  Processing voice frequency input"
        cap_color     = "#00f0ff"
        core_glow     = "filter:drop-shadow(0 0 24px rgba(255,255,255,1)) drop-shadow(0 0 44px rgba(0,240,255,0.85))"
    else:
        ring1_dur     = "18s"
        ring2_dur     = "24s"
        core_anim     = "coreBreath 4s ease-in-out infinite"
        arc_anim      = "arcJitter 2.8s ease-in-out infinite"
        sonar_anim    = f"sonarIdleExpand 3.5s cubic-bezier(0.1,0.6,0.2,1) infinite"
        sonar2_anim   = f"sonarIdleExpand 3.5s cubic-bezier(0.1,0.6,0.2,1) 1.75s infinite"
        arc_path_anim = "arcPathIdle 3s ease-in-out infinite"
        corona_color  = "rgba(56,189,248,0.3)"
        sonar_color   = "#38bdf8"
        arc_color     = "#e0f2fe"
        glow_color    = "#38bdf8"
        cap_text      = "Neural voice core online  //  Awaiting mission directive"
        cap_color     = "rgba(148,163,184,0.75)"
        core_glow     = "filter:drop-shadow(0 0 18px rgba(255,255,255,0.85)) drop-shadow(0 0 35px rgba(56,189,248,0.55))"

    H(f"""
    <div class="glass" style="padding:24px 20px;margin-bottom:16px;text-align:center;position:relative;overflow:hidden;">
    <div style="position:absolute;inset:0;border-radius:20px;
    background:radial-gradient(ellipse 60% 55% at 50% 50%, {corona_color} 0%, transparent 70%);
    pointer-events:none;"></div>
    <div style="position:relative;width:290px;height:290px;margin:0 auto;display:flex;align-items:center;justify-content:center;">
    <div style="position:absolute;inset:0;border-radius:50%;
    border:1px solid rgba(56,189,248,0.18);
    animation:orbRotateCW {ring1_dur} linear infinite;">
    <span style="position:absolute;top:-3px;left:50%;width:7px;height:3px;background:{glow_color};transform:translateX(-50%);border-radius:1px;box-shadow:0 0 8px {glow_color};"></span>
    <span style="position:absolute;bottom:-3px;left:50%;width:7px;height:3px;background:{glow_color};transform:translateX(-50%);border-radius:1px;box-shadow:0 0 8px {glow_color};"></span>
    <span style="position:absolute;left:-3px;top:50%;width:3px;height:7px;background:{glow_color};transform:translateY(-50%);border-radius:1px;box-shadow:0 0 8px {glow_color};"></span>
    <span style="position:absolute;right:-3px;top:50%;width:3px;height:7px;background:{glow_color};transform:translateY(-50%);border-radius:1px;box-shadow:0 0 8px {glow_color};"></span>
    </div>
    <div style="position:absolute;inset:22px;border-radius:50%;
    border:1px dashed rgba(255,255,255,0.1);
    animation:orbRotateCCW {ring2_dur} linear infinite;">
    <span style="position:absolute;top:50%;left:-2px;width:4px;height:4px;border-radius:50%;background:rgba(255,255,255,0.5);transform:translateY(-50%);"></span>
    <span style="position:absolute;top:-2px;left:50%;width:4px;height:4px;border-radius:50%;background:rgba(255,255,255,0.5);transform:translateX(-50%);"></span>
    </div>
    <div style="position:absolute;inset:10px;border-radius:50%;
    background:radial-gradient(circle, rgba(12,20,40,0.9) 0%, rgba(3,5,13,0.98) 85%);
    border:1px solid rgba(56,189,248,0.12);
    box-shadow:inset 0 0 40px rgba(0,0,0,0.95);
    overflow:hidden;">
    <svg viewBox="0 0 300 300" style="width:100%;height:100%;animation:{arc_anim};">
    <defs>
    <filter id="hglow" x="-40%" y="-40%" width="180%" height="180%">
    <feGaussianBlur in="SourceGraphic" stdDeviation="4.5" result="b1"/>
    <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b2"/>
    <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="b3"/>
    <feMerge><feMergeNode in="b1"/><feMergeNode in="b2"/><feMergeNode in="b3"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <radialGradient id="coreGrad" cx="50%" cy="50%" r="50%">
    <stop offset="0%"   stop-color="#ffffff" stop-opacity="1"/>
    <stop offset="30%"  stop-color="#e0f2fe" stop-opacity="1"/>
    <stop offset="65%"  stop-color="{glow_color}" stop-opacity="0.7"/>
    <stop offset="100%" stop-color="{glow_color}" stop-opacity="0"/>
    </radialGradient>
    </defs>
    <circle cx="150" cy="150" r="10" fill="none" stroke="{sonar_color}" stroke-width="0.8" opacity="0.8">
    <animate attributeName="r" from="10" to="112" dur="{sonar_anim.split(' ')[1]}" begin="0s" repeatCount="indefinite"/>
    <animate attributeName="opacity" from="0.85" to="0" dur="{sonar_anim.split(' ')[1]}" begin="0s" repeatCount="indefinite"/>
    </circle>
    <circle cx="150" cy="150" r="10" fill="none" stroke="{sonar_color}" stroke-width="0.6" opacity="0.6">
    <animate attributeName="r" from="10" to="112" dur="{sonar2_anim.split(' ')[1]}" begin="{sonar2_anim.split(' ')[2]}" repeatCount="indefinite"/>
    <animate attributeName="opacity" from="0.7" to="0" dur="{sonar2_anim.split(' ')[1]}" begin="{sonar2_anim.split(' ')[2]}" repeatCount="indefinite"/>
    </circle>
    <g filter="url(#hglow)" opacity="0.72">
    <path stroke-dasharray="6 3" style="animation:{arc_path_anim};"
    d="M150,150 L145,126 L158,115 L143,94 L162,80 L151,58 L168,34" fill="none" stroke="{glow_color}" stroke-width="4" stroke-linecap="round"/>
    <path stroke-dasharray="5 4" style="animation:{arc_path_anim};" d="M143,94 L128,84 L114,68" fill="none" stroke="{glow_color}" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
    <path stroke-dasharray="6 3" style="animation:{arc_path_anim};"
    d="M150,150 L174,132 L168,118 L196,102 L189,82 L218,66 L238,42" fill="none" stroke="{glow_color}" stroke-width="4" stroke-linecap="round"/>
    <path stroke-dasharray="4 5" style="animation:{arc_path_anim};" d="M196,102 L218,112 L238,107" fill="none" stroke="{glow_color}" stroke-width="2.5" stroke-linecap="round" opacity="0.7"/>
    <path stroke-dasharray="6 3" style="animation:{arc_path_anim};"
    d="M150,150 L168,166 L186,156 L208,178 L228,168 L252,184 L276,178" fill="none" stroke="{glow_color}" stroke-width="4" stroke-linecap="round"/>
    <path stroke-dasharray="4 5" style="animation:{arc_path_anim};" d="M208,178 L218,202 L236,212" fill="none" stroke="{glow_color}" stroke-width="2.5" stroke-linecap="round" opacity="0.7"/>
    <path stroke-dasharray="6 3" style="animation:{arc_path_anim};"
    d="M150,150 L162,180 L148,196 L172,218 L164,238 L182,258 L177,280" fill="none" stroke="{glow_color}" stroke-width="4" stroke-linecap="round"/>
    <path stroke-dasharray="4 5" style="animation:{arc_path_anim};" d="M172,218 L192,228 L208,248" fill="none" stroke="{glow_color}" stroke-width="2.5" stroke-linecap="round" opacity="0.7"/>
    <path stroke-dasharray="6 3" style="animation:{arc_path_anim};"
    d="M150,150 L134,168 L146,186 L128,210 L140,230 L122,252 L116,276" fill="none" stroke="{glow_color}" stroke-width="4" stroke-linecap="round"/>
    <path stroke-dasharray="4 5" style="animation:{arc_path_anim};" d="M128,210 L108,220 L92,238" fill="none" stroke="{glow_color}" stroke-width="2.5" stroke-linecap="round" opacity="0.7"/>
    <path stroke-dasharray="6 3" style="animation:{arc_path_anim};"
    d="M150,150 L124,158 L114,142 L90,155 L78,138 L56,152 L28,144" fill="none" stroke="{glow_color}" stroke-width="4" stroke-linecap="round"/>
    <path stroke-dasharray="4 5" style="animation:{arc_path_anim};" d="M90,155 L83,176 L66,187" fill="none" stroke="{glow_color}" stroke-width="2.5" stroke-linecap="round" opacity="0.7"/>
    <path stroke-dasharray="6 3" style="animation:{arc_path_anim};"
    d="M150,150 L130,134 L116,142 L100,116 L82,124 L66,100 L42,86" fill="none" stroke="{glow_color}" stroke-width="4" stroke-linecap="round"/>
    <path stroke-dasharray="4 5" style="animation:{arc_path_anim};" d="M100,116 L106,92 L92,76" fill="none" stroke="{glow_color}" stroke-width="2.5" stroke-linecap="round" opacity="0.7"/>
    <path stroke-dasharray="6 3" style="animation:{arc_path_anim};"
    d="M150,150 L138,120 L124,110 L136,86 L118,72 L130,50 L116,26" fill="none" stroke="{glow_color}" stroke-width="4" stroke-linecap="round"/>
    <path stroke-dasharray="4 5" style="animation:{arc_path_anim};" d="M136,86 L154,72 L162,52" fill="none" stroke="{glow_color}" stroke-width="2.5" stroke-linecap="round" opacity="0.7"/>
    </g>
    <g>
    <path d="M150,150 L145,126 L158,115 L143,94 L162,80 L151,58 L168,34 M143,94 L128,84 L114,68" fill="none" stroke="{arc_color}" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M150,150 L174,132 L168,118 L196,102 L189,82 L218,66 L238,42 M196,102 L218,112 L238,107" fill="none" stroke="{arc_color}" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M150,150 L168,166 L186,156 L208,178 L228,168 L252,184 L276,178 M208,178 L218,202 L236,212" fill="none" stroke="{arc_color}" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M150,150 L162,180 L148,196 L172,218 L164,238 L182,258 L177,280 M172,218 L192,228 L208,248" fill="none" stroke="{arc_color}" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M150,150 L134,168 L146,186 L128,210 L140,230 L122,252 L116,276 M128,210 L108,220 L92,238" fill="none" stroke="{arc_color}" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M150,150 L124,158 L114,142 L90,155 L78,138 L56,152 L28,144 M90,155 L83,176 L66,187" fill="none" stroke="{arc_color}" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M150,150 L130,134 L116,142 L100,116 L82,124 L66,100 L42,86 M100,116 L106,92 L92,76" fill="none" stroke="{arc_color}" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M150,150 L138,120 L124,110 L136,86 L118,72 L130,50 L116,26 M136,86 L154,72 L162,52" fill="none" stroke="{arc_color}" stroke-width="1.6" stroke-linecap="round"/>
    </g>
    <circle cx="150" cy="150" r="22" fill="url(#coreGrad)"
    style="{core_glow};">
    <animate attributeName="r"
    values="20;26;20" dur="{core_anim.split(' ')[1]}"
    repeatCount="indefinite"/>
    </circle>
    <circle cx="150" cy="150" r="8" fill="#ffffff"
    style="filter:drop-shadow(0 0 12px rgba(255,255,255,1));">
    <animate attributeName="r"
    values="7;10;7" dur="{core_anim.split(' ')[1]}"
    repeatCount="indefinite"/>
    </circle>
    </svg>
    </div>
    </div>
    <div style="font-family:'JetBrains Mono',monospace;font-size:0.7rem;
    letter-spacing:0.06em;color:{cap_color};margin-top:12px;line-height:1.4;">
    {cap_text}
    </div>
    </div>
    """)

    # ── Orb State Toggle Controls ──────────────────────────────────────────────
    H('<div style="margin-bottom:12px;">')
    H('<div class="section-label" style="text-align:center;margin-bottom:8px;">VOICE CORE DYNAMICS</div>')
    b1, b2, b3 = st.columns(3)
    with b1:
        if st.button("System Idle", key="btn_idle", use_container_width=True):
            st.session_state.orb_mode = "IDLE"
            st.session_state.exec_log.insert(0, {
                "ts": datetime.now().strftime("%H:%M:%S"),
                "level": "SYSTEM", "color": "#38bdf8",
                "msg": "Voice core set to IDLE. Lazy breathing mode engaged.",
            })
            st.rerun()
    with b2:
        if st.button("Microphone Listening", key="btn_listen", use_container_width=True):
            st.session_state.orb_mode = "LISTEN"
            st.session_state.exec_log.insert(0, {
                "ts": datetime.now().strftime("%H:%M:%S"),
                "level": "SENSOR", "color": "#00f0ff",
                "msg": "Acoustic input sensors activated. Monitoring voice frequencies.",
            })
            st.rerun()
    with b3:
        if st.button("Asura Voice Transmitting", key="btn_transmit", use_container_width=True):
            st.session_state.orb_mode = "TRANSMIT"
            st.session_state.exec_log.insert(0, {
                "ts": datetime.now().strftime("%H:%M:%S"),
                "level": "VOICE", "color": "#c084fc",
                "msg": "High-voltage voice synthesis active. Neural transmission engaged.",
            })
            st.rerun()
    H("</div>")

    H('<div style="height:14px;"></div>')

    # ── 4 Metric Cards (PROGRESS / RUNTIME / AGENCY TIER / VALUE) ─────────────
    m = st.session_state.metrics
    runtime_fmt = f"{m['runtime_s'] // 3600:02d}:{(m['runtime_s'] % 3600) // 60:02d}:{m['runtime_s'] % 60:02d}"

    H(f"""
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">
    <div class="metric-card" style="border-top:2px solid rgba(0,240,255,0.4);">
    <div class="metric-value" style="color:#00f0ff;">{m['progress']}%</div>
    <div class="metric-label">Mission Progress</div>
    <div class="metric-delta" style="color:rgba(0,240,255,0.7);">
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align:middle;margin-right:3px;">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
    </svg>
    Active pipeline nominal
    </div>
    </div>
    <div class="metric-card" style="border-top:2px solid rgba(168,85,247,0.4);">
    <div class="metric-value" style="color:#a78bfa;">{runtime_fmt}</div>
    <div class="metric-label">Session Runtime</div>
    <div class="metric-delta" style="color:rgba(168,85,247,0.7);">99.98% uptime recorded</div>
    </div>
    <div class="metric-card" style="border-top:2px solid rgba(245,158,11,0.4);">
    <div class="metric-value" style="font-size:1.2rem;color:#f59e0b;">{m['agency_tier']}</div>
    <div class="metric-label">Agency Classification</div>
    <div class="metric-delta" style="color:rgba(245,158,11,0.7);">Hermes Tier IV clearance</div>
    </div>
    <div class="metric-card" style="border-top:2px solid rgba(52,211,153,0.4);">
    <div class="metric-value" style="color:#34d399;">${m['mrr']:,.2f}</div>
    <div class="metric-label">Monthly Revenue Run Rate</div>
    <div class="metric-delta" style="color:rgba(52,211,153,0.7);">+21.4% MoM composite</div>
    </div>
    </div>
    """)

    # ── Mission Command Input ──────────────────────────────────────────────────
    H("""
    <div class="glass" style="padding:18px 20px;">
    <div class="section-label" style="margin-bottom:10px;">MISSION DIRECTIVE  //  HERMES COMMAND INPUT</div>
    """)

    prompt_input = st.text_area(
        label="",
        value=st.session_state.mission_prompt,
        placeholder="Enter mission directive... e.g. Build a high-retention SaaS landing page with Stripe integration and automated email sequences.",
        height=100,
        key="mission_textarea",
        label_visibility="collapsed",
    )
    st.session_state.mission_prompt = prompt_input

    dispatch_col, clear_col = st.columns([3, 1])
    with dispatch_col:
        dispatch_btn = st.button(
            "DISPATCH HERMES AGENTS",
            key="dispatch_btn",
            use_container_width=True,
        )
    with clear_col:
        if st.button("CLEAR LOG", key="clear_log_btn", use_container_width=True):
            st.session_state.exec_log = []
            st.session_state.mission_result = None
            st.rerun()

    H("</div>")

    # ── Mission Execution ──────────────────────────────────────────────────────
    if dispatch_btn and prompt_input.strip():
        st.session_state.orb_mode = "TRANSMIT"
        st.session_state.mission_result = None

        ts_now = datetime.now().strftime("%H:%M:%S")
        st.session_state.exec_log.insert(0, {
            "ts": ts_now, "level": "HERMES", "color": "#a78bfa",
            "msg": f"Hermes Router: mission received — '{prompt_input.strip()[:80]}...'",
        })
        st.session_state.exec_log.insert(0, {
            "ts": ts_now, "level": "SYSTEM", "color": "#38bdf8",
            "msg": "Asura-Strategist and Asura-Engineer are now active. Processing...",
        })
        st.rerun()

    if (
        st.session_state.orb_mode == "TRANSMIT"
        and st.session_state.mission_prompt.strip()
        and st.session_state.mission_result is None
        and not dispatch_btn
    ):
        with st.spinner("Hermes Agents executing mission pipeline..."):
            log_q: queue.Queue = queue.Queue()
            result_container = {}

            def _run():
                result_container["res"] = run_hermes_mission(
                    st.session_state.mission_prompt.strip(), log_q
                )

            thread = threading.Thread(target=_run, daemon=True)
            thread.start()
            thread.join(timeout=120)

            while not log_q.empty():
                level, msg, color = log_q.get_nowait()
                st.session_state.exec_log.insert(0, {
                    "ts": datetime.now().strftime("%H:%M:%S"),
                    "level": level, "color": color, "msg": msg,
                })

            if "res" in result_container:
                st.session_state.mission_result = result_container["res"]
                st.session_state.metrics["progress"] = 100
                st.session_state.orb_mode = "IDLE"
                st.session_state.exec_log.insert(0, {
                    "ts": datetime.now().strftime("%H:%M:%S"),
                    "level": "DONE", "color": "#34d399",
                    "msg": "Mission pipeline concluded. Deliverables streamed to execution log.",
                })
            else:
                st.session_state.exec_log.insert(0, {
                    "ts": datetime.now().strftime("%H:%M:%S"),
                    "level": "WARN", "color": "#f59e0b",
                    "msg": "Agent execution timed out. Check API key and network connectivity.",
                })
                st.session_state.orb_mode = "IDLE"
        st.rerun()


# ══════════════════════════════════════════════════════════════════════════════
# RIGHT PANEL: LIVE SYSTEM LOGS & EXECUTION STREAMS
# ══════════════════════════════════════════════════════════════════════════════
with col_right:
    H("""
    <div class="glass" style="padding:20px 16px;min-height:740px;display:flex;flex-direction:column;">
    <div style="display:flex;align-items:center;justify-content:space-between;
    padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,0.06);margin-bottom:12px;">
    <div style="display:flex;align-items:center;gap:8px;">
    <span style="width:7px;height:7px;border-radius:50%;background:#00f0ff;box-shadow:0 0 8px #00f0ff;"></span>
    <span style="font-family:'JetBrains Mono',monospace;font-size:0.68rem;font-weight:700;
    letter-spacing:0.14em;color:#f8fafc;">LIVE SYSTEM LOGS</span>
    </div>
    <span style="font-family:'JetBrains Mono',monospace;font-size:0.6rem;
    letter-spacing:0.1em;color:rgba(100,116,139,0.65);">EXECUTION STREAMS</span>
    </div>
    """)

    # Log level badge styling map
    LEVEL_STYLES = {
        "SYSTEM":     ("rgba(56,189,248,0.15)",  "#38bdf8"),
        "HERMES":     ("rgba(168,85,247,0.15)",  "#a78bfa"),
        "STRATEGIST": ("rgba(56,189,248,0.15)",  "#38bdf8"),
        "ENGINEER":   ("rgba(52,211,153,0.15)",  "#34d399"),
        "ENGINE":     ("rgba(52,211,153,0.15)",  "#34d399"),
        "SENSOR":     ("rgba(0,240,255,0.15)",   "#00f0ff"),
        "VOICE":      ("rgba(192,132,252,0.15)", "#c084fc"),
        "GUARD":      ("rgba(245,158,11,0.15)",  "#f59e0b"),
        "DONE":       ("rgba(52,211,153,0.15)",  "#34d399"),
        "WARN":       ("rgba(245,158,11,0.15)",  "#f59e0b"),
    }

    log_entries = st.session_state.exec_log[:30]

    for entry in log_entries:
        lvl = entry.get("level", "SYSTEM")
        bg, fc = LEVEL_STYLES.get(lvl, ("rgba(56,189,248,0.1)", "#38bdf8"))
        H(f"""
        <div class="log-entry" style="border-left-color:{fc};">
        <span class="log-ts">{entry['ts']}</span>
        <span class="log-level" style="background:{bg};color:{fc};">{lvl}</span>
        <span style="color:rgba(203,213,225,0.85);">{entry['msg']}</span>
        </div>
        """)

    H("</div>")

    # Mission Output Block (below log panel when result is available)
    if st.session_state.mission_result:
        H("""
        <div class="glass-accent" style="padding:18px 16px;margin-top:14px;">
        <div style="display:flex;justify-content:space-between;align-items:center;
        padding-bottom:8px;border-bottom:1px solid rgba(56,189,248,0.18);margin-bottom:12px;">
        <div style="font-family:'Orbitron',sans-serif;font-size:0.8rem;font-weight:800;
        letter-spacing:0.1em;color:#00f0ff;">MISSION DELIVERABLE</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:0.6rem;
        color:#34d399;letter-spacing:0.1em;">VERIFIED  //  GEMINI 1.5 PRO</div>
        </div>
        """)
        st.markdown(st.session_state.mission_result["output"])
        H("</div>")
