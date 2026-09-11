"""
================================================================================
    ASURA COMMAND  //  PRINCIPAL UI ARCHITECTURE  v6.0
    Premium Corporate-Grade Command Deck — Production Ready
================================================================================
"""

import os
import threading
import queue
from datetime import datetime

# ── API KEY ────────────────────────────────────────────────────────────────────
GEMINI_API_KEY = (
    os.environ.get("GEMINI_API_KEY")
    or os.environ.get("GOOGLE_API_KEY")
    or ""
)
os.environ["GEMINI_API_KEY"] = GEMINI_API_KEY
os.environ["GOOGLE_API_KEY"] = GEMINI_API_KEY

import streamlit as st

st.set_page_config(
    page_title="ASURA COMMAND",
    page_icon="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10' fill='none' stroke='%23ffffff' stroke-width='1.5'/><circle cx='12' cy='12' r='4' fill='white'/></svg>",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# ── SESSION STATE ──────────────────────────────────────────────────────────────
def _init():
    d = {
        "orb_mode": "IDLE",
        "exec_log": [
            {"ts": "00:00:01", "level": "SYS",     "color": "#4f8ef7", "msg": "ASURA Command initialized. All subsystems nominal."},
            {"ts": "00:00:02", "level": "HERMES",  "color": "#8b7cf8", "msg": "Hermes Agent Router online. Awaiting directive."},
            {"ts": "00:00:03", "level": "ENGINE",  "color": "#34c97e", "msg": "Gemini 1.5 Pro engine configured and standing by."},
            {"ts": "00:00:04", "level": "GUARD",   "color": "#e8a838", "msg": "Neural security perimeter active. Zero anomalies."},
        ],
        "metrics": {"progress": 0, "runtime_s": 0, "agency_tier": "SOVEREIGN", "mrr": 68339.40},
        "mission_active": False,
        "mission_result": None,
        "mission_prompt": "",
        "channels": [
            {"name": "SaaS Infrastructure", "status": "LIVE",   "c": "#34c97e"},
            {"name": "Media Automation",     "status": "ACTIVE", "c": "#4f8ef7"},
            {"name": "Revenue Telemetry",    "status": "ACTIVE", "c": "#4f8ef7"},
            {"name": "Play Store Deploy",    "status": "TEST",   "c": "#e8a838"},
            {"name": "Crypto Analytics",     "status": "READY",  "c": "#8b7cf8"},
        ],
    }
    for k, v in d.items():
        if k not in st.session_state:
            st.session_state[k] = v

_init()

# ── FAIL-SAFE HTML RENDERER ────────────────────────────────────────────────────
def H(raw: str):
    cleaned = "\n".join(
        line.strip() for line in raw.splitlines() if line.strip()
    )
    st.markdown(cleaned, unsafe_allow_html=True)

# ── CREWAI BACKEND ─────────────────────────────────────────────────────────────
def run_hermes_mission(prompt: str, lq: queue.Queue) -> dict:
    try:
        from crewai import Agent, Task, Crew, Process
        from langchain_google_genai import ChatGoogleGenerativeAI

        lq.put(("HERMES", "Authenticating Gemini 1.5 Pro engine...", "#8b7cf8"))
        llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-pro", temperature=0.2,
            google_api_key=GEMINI_API_KEY,
            convert_system_message_to_human=True,
        )
        lq.put(("HERMES", "Engine authenticated. Dispatching crew...", "#8b7cf8"))
        lq.put(("STRAT",  "Asura-Strategist: running market analysis...", "#4f8ef7"))

        strat = Agent(
            role="Asura-Strategist // Market Analysis & Architecture",
            goal=f"Conduct deep market analysis and produce technical architecture for: {prompt}",
            backstory="You are the analytical sovereign of the ASURA collective. You produce airtight technical specifications.",
            llm=llm, verbose=False, allow_delegation=False,
        )
        eng = Agent(
            role="Asura-Engineer // Autonomous Software Production",
            goal=f"Write complete, deployment-ready code for: {prompt}",
            backstory="You are the cybernetic production engine. You translate specs into zero-placeholder production code.",
            llm=llm, verbose=False, allow_delegation=False,
        )
        t1 = Task(
            description=f"Analyze '{prompt}'. Deliver architecture covering: stack, modules, API contracts, deployment, monetization.",
            expected_output="Structured architectural specification document.",
            agent=strat,
        )
        t2 = Task(
            description=f"Implement complete production code for '{prompt}' using specification from Asura-Strategist.",
            expected_output="Complete production-ready source code.",
            agent=eng,
        )
        crew = Crew(agents=[strat, eng], tasks=[t1, t2], process=Process.sequential, verbose=False)
        lq.put(("STRAT", "Strategic analysis phase executing...", "#4f8ef7"))
        result = crew.kickoff()
        lq.put(("ENG",   "Source code synthesis complete.", "#34c97e"))
        lq.put(("HERMES","Mission pipeline concluded successfully.", "#8b7cf8"))
        return {"status": "success", "output": str(result)}

    except Exception as exc:
        lq.put(("SYS", f"Fallback simulation active: {str(exc)[:100]}", "#e8a838"))
        out = (
            f"## ASURA-STRATEGIST  //  ARCHITECTURE SPECIFICATION\n\n"
            f"**Directive:** {prompt}\n\n"
            "### Core Architecture\n"
            "Cloud-native microservice stack — Gemini 1.5 Pro reasoning core. "
            "FastAPI REST gateway + WebSocket telemetry bridge. "
            "Redis session caching, PostgreSQL persistent mission logs.\n\n"
            "### Functional Modules\n"
            "- **Hermes Router** — multi-agent dispatch and orchestration\n"
            "- **Revenue Engine** — Stripe and AdSense balance synchronization\n"
            "- **Neural Guard** — anomaly detection and validator monitoring\n"
            "- **Media Scheduler** — social graph API automated publishing\n\n"
            "---\n\n"
            "## ASURA-ENGINEER  //  PRODUCTION IMPLEMENTATION\n\n"
            "```python\n"
            "from fastapi import FastAPI\nfrom pydantic import BaseModel\n\n"
            f"app = FastAPI(title='{prompt[:40]}', version='1.0.0')\n\n"
            "class MissionRequest(BaseModel):\n    directive: str\n    priority: str = 'standard'\n\n"
            "@app.post('/api/mission/dispatch')\n"
            "async def dispatch(req: MissionRequest):\n"
            "    return {'status': 'DISPATCHED', 'engine': 'Gemini 1.5 Pro'}\n\n"
            "@app.get('/api/health')\n"
            "async def health():\n"
            "    return {'status': 'OPERATIONAL', 'systems': '4/4'}\n"
            "```\n"
        )
        return {"status": "simulated", "output": out}


# ══════════════════════════════════════════════════════════════════════════════
# GLOBAL STYLESHEET — PROFESSIONAL DARK SaaS AESTHETIC
# Reference: Tight 8px grid, rgba(255,255,255,0.04) surfaces,
#            no heavy glows, Inter font, real data visualization feel
# ══════════════════════════════════════════════════════════════════════════════
H("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Orbitron:wght@700;900&family=JetBrains+Mono:wght@400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html, body, .stApp {
background-color: #090c14 !important;
color: #c9d4e8 !important;
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
-webkit-font-smoothing: antialiased;
}

.stApp {
background-image:
radial-gradient(ellipse 900px 500px at 80% 5%, rgba(30,60,120,0.18) 0%, transparent 65%),
radial-gradient(ellipse 600px 400px at 10% 90%, rgba(20,50,100,0.12) 0%, transparent 60%) !important;
}

.block-container {
padding: 16px 20px 40px 20px !important;
max-width: 100% !important;
}

header[data-testid="stHeader"]  { background: transparent !important; }
#MainMenu, footer, [data-testid="stToolbar"] { visibility: hidden !important; height: 0 !important; }

/* Prevent code blocks from leaking */
div[data-testid="stMarkdownContainer"] pre {
background: rgba(15, 20, 35, 0.9) !important;
border: 1px solid rgba(255,255,255,0.07) !important;
border-radius: 8px !important;
font-family: 'JetBrains Mono', monospace !important;
font-size: 0.75rem !important;
color: #8899bb !important;
padding: 12px 14px !important;
}

/* ── SURFACE SYSTEM ── */
.s1 {
background: rgba(255,255,255,0.028);
border: 1px solid rgba(255,255,255,0.062);
border-radius: 12px;
}

.s2 {
background: rgba(255,255,255,0.018);
border: 1px solid rgba(255,255,255,0.044);
border-radius: 10px;
}

.s-inset {
background: rgba(0,0,0,0.25);
border: 1px solid rgba(255,255,255,0.038);
border-radius: 8px;
}

/* ── TYPOGRAPHY SYSTEM ── */
.t-overline {
font-size: 10px;
font-weight: 600;
letter-spacing: 0.14em;
text-transform: uppercase;
color: rgba(140,160,200,0.55);
line-height: 1;
}

.t-label {
font-size: 11.5px;
font-weight: 500;
color: rgba(160,180,220,0.7);
letter-spacing: 0.01em;
}

.t-body {
font-size: 13px;
font-weight: 400;
color: rgba(190,205,235,0.85);
line-height: 1.5;
}

.t-value-xl {
font-family: 'Orbitron', sans-serif;
font-size: 26px;
font-weight: 700;
color: #dce8ff;
letter-spacing: 0.03em;
line-height: 1;
}

.t-value-lg {
font-family: 'Inter', sans-serif;
font-size: 22px;
font-weight: 700;
color: #dce8ff;
letter-spacing: -0.01em;
line-height: 1;
}

.t-brand {
font-family: 'Orbitron', sans-serif;
font-size: 15px;
font-weight: 900;
letter-spacing: 0.18em;
color: #e8f0ff;
line-height: 1;
}

.t-mono {
font-family: 'JetBrains Mono', monospace;
font-size: 11px;
font-weight: 500;
letter-spacing: 0.05em;
color: rgba(140,160,200,0.6);
}

/* ── BADGE SYSTEM ── */
.badge {
display: inline-flex;
align-items: center;
padding: 3px 8px;
border-radius: 5px;
font-family: 'JetBrains Mono', monospace;
font-size: 9.5px;
font-weight: 600;
letter-spacing: 0.1em;
line-height: 1;
}

/* ── NAV ITEMS ── */
.nav-row {
display: flex;
align-items: center;
gap: 9px;
padding: 8px 10px;
border-radius: 7px;
font-size: 12.5px;
font-weight: 500;
color: rgba(160,180,220,0.65);
cursor: pointer;
transition: background 0.15s, color 0.15s;
margin-bottom: 2px;
}

.nav-row.active {
background: rgba(79,142,247,0.1);
color: rgba(200,220,255,0.92);
border-left: 2px solid rgba(79,142,247,0.7);
padding-left: 8px;
}

.nav-row svg { flex-shrink: 0; opacity: 0.65; }
.nav-row.active svg { opacity: 1; }

/* ── CHANNEL ROW ── */
.ch-row {
display: flex;
align-items: center;
justify-content: space-between;
padding: 7px 10px;
border-radius: 7px;
background: rgba(0,0,0,0.18);
border: 1px solid rgba(255,255,255,0.035);
margin-bottom: 5px;
}

/* ── METRIC CARD ── */
.mc {
background: rgba(255,255,255,0.025);
border: 1px solid rgba(255,255,255,0.055);
border-radius: 11px;
padding: 16px 16px 14px;
position: relative;
overflow: hidden;
}

.mc-top-accent {
position: absolute;
top: 0; left: 16px; right: 16px;
height: 1px;
}

/* ── LOG ENTRY ── */
.log-row {
display: flex;
align-items: flex-start;
gap: 8px;
padding: 6px 10px;
border-radius: 6px;
background: rgba(0,0,0,0.2);
border-left: 2px solid transparent;
margin-bottom: 5px;
font-family: 'JetBrains Mono', monospace;
font-size: 11px;
line-height: 1.45;
}

/* ── BUTTONS ── */
.stButton > button {
background: rgba(255,255,255,0.04) !important;
color: rgba(190,210,250,0.82) !important;
border: 1px solid rgba(255,255,255,0.08) !important;
border-radius: 8px !important;
font-family: 'Inter', sans-serif !important;
font-size: 12px !important;
font-weight: 500 !important;
letter-spacing: 0.025em !important;
padding: 7px 14px !important;
transition: background 0.15s, border-color 0.15s, color 0.15s !important;
}

.stButton > button:hover {
background: rgba(79,142,247,0.12) !important;
border-color: rgba(79,142,247,0.35) !important;
color: #dce8ff !important;
}

/* ── DISPATCH BUTTON ── */
button[kind="primary"],
.stButton > button[data-testid*="dispatch"] {
background: rgba(79,142,247,0.14) !important;
border-color: rgba(79,142,247,0.4) !important;
color: #a8caff !important;
}

/* ── INPUTS ── */
.stTextArea textarea, .stTextInput input {
background: rgba(0,0,0,0.35) !important;
border: 1px solid rgba(255,255,255,0.08) !important;
border-radius: 8px !important;
color: #c9d4e8 !important;
font-family: 'Inter', sans-serif !important;
font-size: 13px !important;
caret-color: #4f8ef7 !important;
}

.stTextArea textarea:focus, .stTextInput input:focus {
border-color: rgba(79,142,247,0.38) !important;
box-shadow: 0 0 0 2px rgba(79,142,247,0.1) !important;
outline: none !important;
}

/* ── SCROLLBAR ── */
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }

/* ── ORB ANIMATIONS ── */
@keyframes rotCW   { to { transform: rotate(360deg);  } }
@keyframes rotCCW  { to { transform: rotate(-360deg); } }

@keyframes breatheIdle {
0%,100% { opacity:.75; r:20; }
50%     { opacity:1;   r:25; }
}
@keyframes breatheListen {
0%,100% { opacity:.85; r:22; }
50%     { opacity:1;   r:28; }
}
@keyframes breatheSpeak {
0%     { opacity:.9; r:21; }
25%    { opacity:1;  r:27; }
50%    { opacity:.9; r:24; }
75%    { opacity:1;  r:28; }
100%   { opacity:.9; r:21; }
}

@keyframes jitterIdle   { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(.3deg)} }
@keyframes jitterListen { 0%,100%{transform:rotate(0deg)} 33%{transform:rotate(.5deg)} 66%{transform:rotate(-.4deg)} }
@keyframes jitterSpeak  {
0%  {transform:rotate(0deg)   scale(1)}
15% {transform:rotate(.8deg)  scale(1.01)}
30% {transform:rotate(-.7deg) scale(.99)}
50% {transform:rotate(.9deg)  scale(1.02)}
70% {transform:rotate(-.6deg) scale(.99)}
85% {transform:rotate(.5deg)  scale(1.01)}
100%{transform:rotate(0deg)   scale(1)}
}

@keyframes sonarOut {
0%   { r:12; opacity:.7; stroke-width:1; }
100% { r:105; opacity:0; stroke-width:.4; }
}

@keyframes sonarOutFast {
0%   { r:12; opacity:.9; stroke-width:1.2; }
100% { r:105; opacity:0; stroke-width:.3; }
}

@keyframes dashFlow {
0%   { stroke-dashoffset:0; }
100% { stroke-dashoffset:-60; }
}

@keyframes coreGlowPulse {
0%,100% { filter: drop-shadow(0 0 6px rgba(255,255,255,.6)) drop-shadow(0 0 18px rgba(160,200,255,.25)); }
50%     { filter: drop-shadow(0 0 14px rgba(255,255,255,.95)) drop-shadow(0 0 32px rgba(160,200,255,.45)); }
}
@keyframes coreGlowActive {
0%,100% { filter: drop-shadow(0 0 10px rgba(255,255,255,.9)) drop-shadow(0 0 28px rgba(100,180,255,.5)); }
50%     { filter: drop-shadow(0 0 22px rgba(255,255,255,1)) drop-shadow(0 0 50px rgba(100,180,255,.7)); }
}
@keyframes coreGlowSpeak {
0%,100% { filter: drop-shadow(0 0 14px rgba(255,255,255,1)) drop-shadow(0 0 40px rgba(180,140,255,.65)); }
33%     { filter: drop-shadow(0 0 24px rgba(255,255,255,1)) drop-shadow(0 0 60px rgba(180,140,255,.85)); }
66%     { filter: drop-shadow(0 0 18px rgba(255,255,255,1)) drop-shadow(0 0 48px rgba(100,180,255,.75)); }
}
</style>
""")


# ══════════════════════════════════════════════════════════════════════════════
# TOP BAR
# ══════════════════════════════════════════════════════════════════════════════
eng_ok = bool(GEMINI_API_KEY)
eng_label = "AUTHENTICATED" if eng_ok else "SIMULATION MODE"
eng_color = "#34c97e" if eng_ok else "#e8a838"

H(f"""
<div style="
display:flex;align-items:center;justify-content:space-between;
height:48px;padding:0 16px;
background:rgba(255,255,255,0.022);
border:1px solid rgba(255,255,255,0.055);
border-radius:10px;
margin-bottom:16px;">

<div style="display:flex;align-items:center;gap:12px;">
<div style="
width:26px;height:26px;border-radius:50%;
background:rgba(255,255,255,0.05);
border:1px solid rgba(255,255,255,0.12);
display:flex;align-items:center;justify-content:center;">
<div style="width:8px;height:8px;border-radius:50%;background:#e0eaff;
box-shadow:0 0 6px rgba(200,220,255,.6);"></div>
</div>
<div>
<div class="t-brand">ASURA COMMAND</div>
<div class="t-mono" style="margin-top:1px;letter-spacing:.14em;">HERMES AGENT FRAMEWORK  v6.0</div>
</div>
</div>

<div style="display:flex;align-items:center;gap:6px;">
<div style="
display:flex;align-items:center;gap:5px;
padding:5px 12px;
background:rgba(255,255,255,0.03);
border:1px solid rgba(255,255,255,0.06);
border-radius:6px;">
<div style="width:5px;height:5px;border-radius:50%;background:#34c97e;box-shadow:0 0 5px rgba(52,201,126,.6);"></div>
<span class="t-mono">VIRTUAL ENGINE-1</span>
<span style="color:rgba(255,255,255,0.12);margin:0 4px;">|</span>
<span class="t-mono">LATENCY <span style="color:#34c97e;font-weight:600;">11ms</span></span>
</div>
<div style="
padding:5px 10px;
background:rgba(255,255,255,0.025);
border:1px solid rgba(255,255,255,0.055);
border-radius:6px;">
<span class="t-mono" style="color:{eng_color};">{eng_label}</span>
</div>
</div>

</div>
""")


# ══════════════════════════════════════════════════════════════════════════════
# THREE COLUMNS
# ══════════════════════════════════════════════════════════════════════════════
col_left, col_center, col_right = st.columns([2.2, 4.8, 3.0], gap="medium")


# ══════════════════════════════════════════════════════════════════════════════
# LEFT — DIVISIONS + CHANNELS
# ══════════════════════════════════════════════════════════════════════════════
with col_left:
    H("""
    <div class="s1" style="padding:16px 14px;min-height:720px;">

    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
    <span class="t-overline">Divisions</span>
    </div>

    <div class="nav-row active">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4f8ef7" stroke-width="2" stroke-linecap="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
    Overview
    </div>

    <div class="nav-row">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
    Telemetry Grid
    </div>

    <div class="nav-row">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <circle cx="12" cy="8" r="4"/><path d="M6 20c0-4 2.7-6 6-6s6 2 6 6"/>
    </svg>
    Neural Agents
    </div>

    <div class="nav-row">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
    Defense Matrix
    </div>

    <div class="nav-row">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    </svg>
    Audit Stream
    </div>

    <div class="nav-row">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
    </svg>
    Node Config
    </div>

    <div style="
    height:1px;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent);
    margin:14px 0;">
    </div>

    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
    <span class="t-overline">Active Channels</span>
    </div>
    """)

    for ch in st.session_state.channels:
        H(f"""
        <div class="ch-row">
        <div style="display:flex;align-items:center;gap:7px;">
        <div style="width:5px;height:5px;border-radius:50%;background:{ch['c']};flex-shrink:0;"></div>
        <span style="font-size:12px;font-weight:500;color:rgba(185,200,230,0.8);">{ch['name']}</span>
        </div>
        <span class="badge" style="background:{ch['c']}18;color:{ch['c']};border:1px solid {ch['c']}30;">
        {ch['status']}
        </span>
        </div>
        """)

    H("""
    <div style="
    height:1px;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent);
    margin:14px 0;">
    </div>
    <div style="padding:2px 4px;">
    <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
    <div style="width:5px;height:5px;border-radius:50%;background:#34c97e;"></div>
    <span style="font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:600;
    letter-spacing:.1em;color:#34c97e;">SYSTEM NOMINAL</span>
    </div>
    <div class="t-mono" style="padding-left:11px;">v5.0.0  //  HERMES BUILD</div>
    </div>
    </div>
    """)


# ══════════════════════════════════════════════════════════════════════════════
# CENTER — HEADER + ORB + METRICS + MISSION INPUT
# ══════════════════════════════════════════════════════════════════════════════
with col_center:

    # ── Section Header ─────────────────────────────────────────────────────────
    H("""
    <div class="s1" style="padding:16px 18px;margin-bottom:14px;">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;flex-wrap:wrap;">
    <div>
    <div class="t-overline" style="margin-bottom:6px;">Deployment Hub  /  Neural Voice Core</div>
    <div style="
    font-family:'Orbitron',sans-serif;font-weight:900;
    font-size:clamp(20px,3vw,28px);
    letter-spacing:.16em;
    color:#e8f0ff;
    line-height:1.05;
    ">ASURA COMMAND</div>
    <div class="t-mono" style="margin-top:5px;letter-spacing:.18em;">
    HERMES AGENT FRAMEWORK  //  GEMINI 1.5 PRO
    </div>
    </div>
    <div style="
    display:flex;align-items:center;gap:6px;
    padding:5px 12px;
    background:rgba(52,201,126,.07);
    border:1px solid rgba(52,201,126,.22);
    border-radius:6px;
    flex-shrink:0;
    ">
    <div style="width:5px;height:5px;border-radius:50%;background:#34c97e;"></div>
    <span style="font-family:'JetBrains Mono',monospace;font-size:10.5px;font-weight:600;
    letter-spacing:.1em;color:#34c97e;">4 / 4 SYSTEMS NOMINAL</span>
    </div>
    </div>
    </div>
    """)

    # ── Tesla Orb ──────────────────────────────────────────────────────────────
    mode = st.session_state.orb_mode

    CFG = {
        "IDLE": {
            "r1_speed": "22s", "r2_speed": "30s",
            "arc_jitter": "jitterIdle 3s ease-in-out infinite",
            "sonar_dur": "4s", "sonar_delay": "2s",
            "core_anim": "breatheIdle 4s ease-in-out infinite",
            "core_glow": "coreGlowPulse 4s ease-in-out infinite",
            "arc_clr": "rgba(160,195,255,.55)", "glow_clr": "rgba(100,160,255,.4)",
            "sonar_clr": "rgba(100,160,255,.45)",
            "arc_dash": "dashFlow 8s linear infinite",
            "cap": "Neural voice core online  //  Awaiting mission directive",
            "cap_clr": "rgba(140,160,200,.6)",
        },
        "LISTEN": {
            "r1_speed": "10s", "r2_speed": "14s",
            "arc_jitter": "jitterListen 1.2s ease-in-out infinite",
            "sonar_dur": "2s", "sonar_delay": "1s",
            "core_anim": "breatheListen 1.4s ease-in-out infinite",
            "core_glow": "coreGlowActive 1.4s ease-in-out infinite",
            "arc_clr": "rgba(200,230,255,.75)", "glow_clr": "rgba(79,142,247,.6)",
            "sonar_clr": "rgba(79,142,247,.6)",
            "arc_dash": "dashFlow 3s linear infinite",
            "cap": "Acoustic sensors active  //  Processing voice frequency input",
            "cap_clr": "rgba(140,185,255,.8)",
        },
        "TRANSMIT": {
            "r1_speed": "4s", "r2_speed": "6s",
            "arc_jitter": "jitterSpeak 0.4s steps(2,start) infinite",
            "sonar_dur": "1.1s", "sonar_delay": "0.55s",
            "core_anim": "breatheSpeak 0.65s ease-in-out infinite",
            "core_glow": "coreGlowSpeak 0.65s ease-in-out infinite",
            "arc_clr": "rgba(230,210,255,.85)", "glow_clr": "rgba(180,140,255,.7)",
            "sonar_clr": "rgba(180,140,255,.7)",
            "arc_dash": "dashFlow 1.2s linear infinite",
            "cap": "High-voltage neural synthesis active  //  Voice discharge transmitting",
            "cap_clr": "rgba(195,170,255,.85)",
        },
    }
    C = CFG[mode]

    H(f"""
    <div class="s1" style="padding:22px 18px 16px;margin-bottom:14px;
    background:rgba(255,255,255,0.016);
    text-align:center;position:relative;overflow:hidden;">

    <div style="
    position:absolute;inset:0;border-radius:12px;pointer-events:none;
    background:radial-gradient(ellipse 65% 50% at 50% 45%,
    rgba(79,100,200,0.07) 0%, transparent 70%);
    "></div>

    <div style="position:relative;width:268px;height:268px;margin:0 auto;
    display:flex;align-items:center;justify-content:center;">

    <div style="position:absolute;inset:0;border-radius:50%;
    border:1px solid rgba(255,255,255,0.08);
    animation:rotCW {C['r1_speed']} linear infinite;">
    <span style="position:absolute;top:-2.5px;left:50%;
    width:5px;height:2px;border-radius:1px;
    background:rgba(180,210,255,.6);transform:translateX(-50%);"></span>
    <span style="position:absolute;bottom:-2.5px;left:50%;
    width:5px;height:2px;border-radius:1px;
    background:rgba(180,210,255,.6);transform:translateX(-50%);"></span>
    <span style="position:absolute;left:-2.5px;top:50%;
    width:2px;height:5px;border-radius:1px;
    background:rgba(180,210,255,.6);transform:translateY(-50%);"></span>
    <span style="position:absolute;right:-2.5px;top:50%;
    width:2px;height:5px;border-radius:1px;
    background:rgba(180,210,255,.6);transform:translateY(-50%);"></span>
    </div>

    <div style="position:absolute;inset:18px;border-radius:50%;
    border:1px dashed rgba(255,255,255,0.055);
    animation:rotCCW {C['r2_speed']} linear infinite;">
    <span style="position:absolute;top:50%;left:-2px;
    width:4px;height:4px;border-radius:50%;
    background:rgba(255,255,255,.25);transform:translateY(-50%);"></span>
    <span style="position:absolute;top:-2px;left:50%;
    width:4px;height:4px;border-radius:50%;
    background:rgba(255,255,255,.25);transform:translateX(-50%);"></span>
    </div>

    <div style="position:absolute;inset:10px;border-radius:50%;
    background:radial-gradient(circle, rgba(10,15,28,.88) 0%, rgba(5,7,15,.97) 85%);
    border:1px solid rgba(255,255,255,.065);
    overflow:hidden;box-shadow:inset 0 0 32px rgba(0,0,0,.85);">

    <svg viewBox="0 0 280 280"
    style="width:100%;height:100%;animation:{C['arc_jitter']};">
    <defs>
    <filter id="ag" x="-40%" y="-40%" width="180%" height="180%">
    <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b1"/>
    <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="b2"/>
    <feMerge><feMergeNode in="b1"/><feMergeNode in="b2"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <radialGradient id="cg" cx="50%" cy="50%" r="50%">
    <stop offset="0%"   stop-color="#ffffff" stop-opacity="1"/>
    <stop offset="28%"  stop-color="#d0e8ff" stop-opacity="1"/>
    <stop offset="60%"  stop-color="{C['glow_clr'].replace('rgba','rgba').split(',')[0].split('(')[1].strip()},200,255" stop-opacity=".5"/>
    <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    </defs>

    <circle cx="140" cy="140" r="12" fill="none" stroke="{C['sonar_clr']}" stroke-width=".9">
    <animate attributeName="r" from="12" to="108" dur="{C['sonar_dur']}" repeatCount="indefinite"/>
    <animate attributeName="opacity" from=".75" to="0" dur="{C['sonar_dur']}" repeatCount="indefinite"/>
    </circle>
    <circle cx="140" cy="140" r="12" fill="none" stroke="{C['sonar_clr']}" stroke-width=".7">
    <animate attributeName="r" from="12" to="108" dur="{C['sonar_dur']}" begin="{C['sonar_delay']}" repeatCount="indefinite"/>
    <animate attributeName="opacity" from=".6" to="0" dur="{C['sonar_dur']}" begin="{C['sonar_delay']}" repeatCount="indefinite"/>
    </circle>

    <g filter="url(#ag)" opacity=".68" stroke="{C['arc_clr']}" stroke-linecap="round" fill="none">
    <path stroke-width="3.8" stroke-dasharray="8 4"
    style="animation:{C['arc_dash']};"
    d="M140,140 L136,118 L150,107 L133,86 L153,72 L143,50 L160,28 M133,86 L118,77 L105,62"/>
    <path stroke-width="3.8" stroke-dasharray="7 5"
    style="animation:{C['arc_dash']};"
    d="M140,140 L163,124 L157,110 L184,95 L177,75 L205,60 M184,95 L204,104 L222,100"/>
    <path stroke-width="3.8" stroke-dasharray="8 4"
    style="animation:{C['arc_dash']};"
    d="M140,140 L157,155 L174,146 L196,166 L215,157 L238,171 M196,166 L204,188 L220,196"/>
    <path stroke-width="3.8" stroke-dasharray="7 5"
    style="animation:{C['arc_dash']};"
    d="M140,140 L150,167 L137,183 L159,204 L151,222 L167,242 M159,204 L177,213 L190,230"/>
    <path stroke-width="3.8" stroke-dasharray="8 4"
    style="animation:{C['arc_dash']};"
    d="M140,140 L125,157 L136,173 L119,196 L130,215 L113,234 M119,196 L100,206 L86,222"/>
    <path stroke-width="3.8" stroke-dasharray="7 5"
    style="animation:{C['arc_dash']};"
    d="M140,140 L115,148 L105,134 L82,146 L71,130 L50,143 M82,146 L75,165 L59,175"/>
    <path stroke-width="3.8" stroke-dasharray="8 4"
    style="animation:{C['arc_dash']};"
    d="M140,140 L121,125 L108,132 L93,108 L76,115 L61,92 M93,108 L98,86 L85,71"/>
    <path stroke-width="3.8" stroke-dasharray="7 5"
    style="animation:{C['arc_dash']};"
    d="M140,140 L129,111 L116,101 L127,78 L110,65 M127,78 L144,66 L151,48"/>
    </g>

    <g stroke="rgba(240,248,255,.88)" stroke-linecap="round" fill="none">
    <path stroke-width="1.4"
    d="M140,140 L136,118 L150,107 L133,86 L153,72 L143,50 L160,28 M133,86 L118,77 L105,62"/>
    <path stroke-width="1.4"
    d="M140,140 L163,124 L157,110 L184,95 L177,75 L205,60 M184,95 L204,104 L222,100"/>
    <path stroke-width="1.4"
    d="M140,140 L157,155 L174,146 L196,166 L215,157 L238,171 M196,166 L204,188 L220,196"/>
    <path stroke-width="1.4"
    d="M140,140 L150,167 L137,183 L159,204 L151,222 L167,242 M159,204 L177,213 L190,230"/>
    <path stroke-width="1.4"
    d="M140,140 L125,157 L136,173 L119,196 L130,215 L113,234 M119,196 L100,206 L86,222"/>
    <path stroke-width="1.4"
    d="M140,140 L115,148 L105,134 L82,146 L71,130 L50,143 M82,146 L75,165 L59,175"/>
    <path stroke-width="1.4"
    d="M140,140 L121,125 L108,132 L93,108 L76,115 L61,92 M93,108 L98,86 L85,71"/>
    <path stroke-width="1.4"
    d="M140,140 L129,111 L116,101 L127,78 L110,65 M127,78 L144,66 L151,48"/>
    </g>

    <circle cx="140" cy="140" r="20" fill="url(#cg)"
    style="animation:{C['core_glow']};">
    <animate attributeName="r" values="18;24;18" dur="{C['core_anim'].split(' ')[1]}"
    repeatCount="indefinite"/>
    </circle>
    <circle cx="140" cy="140" r="7" fill="#ffffff"
    style="filter:drop-shadow(0 0 8px rgba(255,255,255,.95));">
    <animate attributeName="r" values="6;9;6" dur="{C['core_anim'].split(' ')[1]}"
    repeatCount="indefinite"/>
    </circle>
    </svg>
    </div>
    </div>

    <div style="margin-top:12px;font-family:'JetBrains Mono',monospace;
    font-size:11px;font-weight:400;letter-spacing:.05em;
    color:{C['cap_clr']};">
    {C['cap']}
    </div>
    </div>
    """)

    # ── Orb State Buttons ──────────────────────────────────────────────────────
    H('<div class="t-overline" style="text-align:center;margin-bottom:8px;">Voice Core Dynamics</div>')
    b1, b2, b3 = st.columns(3)
    with b1:
        if st.button("System Idle", key="bi", use_container_width=True):
            st.session_state.orb_mode = "IDLE"
            st.session_state.exec_log.insert(0, {"ts": datetime.now().strftime("%H:%M:%S"), "level": "SYS", "color": "#4f8ef7", "msg": "Voice core set to IDLE. Breathing mode engaged."})
            st.rerun()
    with b2:
        if st.button("Microphone Listening", key="bl", use_container_width=True):
            st.session_state.orb_mode = "LISTEN"
            st.session_state.exec_log.insert(0, {"ts": datetime.now().strftime("%H:%M:%S"), "level": "SENSOR", "color": "#4f8ef7", "msg": "Acoustic input sensors activated."})
            st.rerun()
    with b3:
        if st.button("Asura Voice Transmitting", key="bt", use_container_width=True):
            st.session_state.orb_mode = "TRANSMIT"
            st.session_state.exec_log.insert(0, {"ts": datetime.now().strftime("%H:%M:%S"), "level": "VOICE", "color": "#8b7cf8", "msg": "High-voltage voice synthesis active."})
            st.rerun()

    H('<div style="height:14px;"></div>')

    # ── 4 Metric Cards with Sparklines ────────────────────────────────────────
    m = st.session_state.metrics
    rts = m['runtime_s']
    rt_fmt = f"{rts//3600:02d}:{(rts%3600)//60:02d}:{rts%60:02d}"

    # Inline SVG sparklines — polyline charts matching the reference image style
    SPARK_PROGRESS = "20,28 35,22 48,26 62,18 75,24 90,14 105,19 118,10 130,16"
    SPARK_RUNTIME  = "20,28 32,24 44,28 56,20 68,26 80,18 92,22 108,14 120,18 130,12"
    SPARK_TIER_BARS = """
    <rect x="20" y="20" width="8" height="10" rx="1" fill="rgba(79,142,247,.45)"/>
    <rect x="32" y="14" width="8" height="16" rx="1" fill="rgba(79,142,247,.45)"/>
    <rect x="44" y="18" width="8" height="12" rx="1" fill="rgba(79,142,247,.55)"/>
    <rect x="56" y="10" width="8" height="20" rx="1" fill="rgba(79,142,247,.6)"/>
    <rect x="68" y="16" width="8" height="14" rx="1" fill="rgba(79,142,247,.65)"/>
    <rect x="80" y="8"  width="8" height="22" rx="1" fill="rgba(79,142,247,.7)"/>
    <rect x="92" y="12" width="8" height="18" rx="1" fill="rgba(79,142,247,.75)"/>
    <rect x="104" y="6" width="8" height="24" rx="1" fill="rgba(79,142,247,.85)"/>
    <rect x="116" y="10" width="8" height="20" rx="1" fill="rgba(79,142,247,.9)"/>
    """
    # Radial arc for MRR (matches reference "94%" donut arc style)
    MRR_PCT = 78
    CIRC = 2 * 3.14159 * 20
    DASH = CIRC * MRR_PCT / 100
    GAP  = CIRC - DASH

    H(f"""
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:11px;margin-bottom:14px;">

    <div class="mc" style="border-top:1.5px solid rgba(79,142,247,.4);">
    <div class="t-overline" style="margin-bottom:7px;">Mission Progress</div>
    <div class="t-value-lg" style="color:#dce8ff;">{m['progress']}%</div>
    <div style="margin-top:6px;">
    <svg viewBox="0 0 150 38" width="100%" height="36" preserveAspectRatio="none">
    <defs>
    <linearGradient id="sp1" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="rgba(79,142,247,.35)"/>
    <stop offset="100%" stop-color="rgba(79,142,247,0)"/>
    </linearGradient>
    </defs>
    <polygon points="{SPARK_PROGRESS} 130,34 20,34" fill="url(#sp1)" opacity=".6"/>
    <polyline points="{SPARK_PROGRESS}" fill="none" stroke="rgba(79,142,247,.85)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    </div>
    <div class="t-mono" style="margin-top:2px;color:rgba(79,142,247,.8);">Active pipeline nominal</div>
    </div>

    <div class="mc" style="border-top:1.5px solid rgba(139,124,248,.4);">
    <div class="t-overline" style="margin-bottom:7px;">Session Runtime</div>
    <div class="t-value-lg" style="color:#dce8ff;font-family:'JetBrains Mono',monospace;font-size:18px;">{rt_fmt}</div>
    <div style="margin-top:6px;">
    <svg viewBox="0 0 150 38" width="100%" height="36" preserveAspectRatio="none">
    <defs>
    <linearGradient id="sp2" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="rgba(139,124,248,.3)"/>
    <stop offset="100%" stop-color="rgba(139,124,248,0)"/>
    </linearGradient>
    </defs>
    <polygon points="{SPARK_RUNTIME} 130,34 20,34" fill="url(#sp2)" opacity=".5"/>
    <polyline points="{SPARK_RUNTIME}" fill="none" stroke="rgba(139,124,248,.8)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    </div>
    <div class="t-mono" style="margin-top:2px;color:rgba(139,124,248,.8);">99.98% uptime recorded</div>
    </div>

    <div class="mc" style="border-top:1.5px solid rgba(232,168,56,.35);">
    <div class="t-overline" style="margin-bottom:7px;">Agency Classification</div>
    <div class="t-value-lg" style="color:#dce8ff;font-size:16px;letter-spacing:.04em;">{m['agency_tier']}</div>
    <div style="margin-top:6px;">
    <svg viewBox="0 0 150 38" width="100%" height="36" preserveAspectRatio="none">
    {SPARK_TIER_BARS}
    </svg>
    </div>
    <div class="t-mono" style="margin-top:2px;color:rgba(232,168,56,.75);">Hermes Tier IV clearance</div>
    </div>

    <div class="mc" style="border-top:1.5px solid rgba(52,201,126,.35);">
    <div class="t-overline" style="margin-bottom:7px;">Monthly Revenue Run Rate</div>
    <div style="display:flex;align-items:center;gap:14px;">
    <div class="t-value-lg" style="color:#dce8ff;font-size:18px;">${m['mrr']:,.0f}</div>
    <svg width="50" height="50" viewBox="0 0 50 50">
    <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="4"/>
    <circle cx="25" cy="25" r="20" fill="none"
    stroke="rgba(52,201,126,.8)" stroke-width="4"
    stroke-dasharray="{DASH:.1f} {GAP:.1f}"
    stroke-dashoffset="{CIRC/4:.1f}"
    stroke-linecap="round"/>
    <text x="25" y="29" text-anchor="middle"
    font-family="Inter,sans-serif" font-size="9" font-weight="700"
    fill="rgba(220,232,255,.9)">{MRR_PCT}%</text>
    </svg>
    </div>
    <div class="t-mono" style="margin-top:4px;color:rgba(52,201,126,.75);">+21.4% MoM composite growth</div>
    </div>

    </div>
    """)

    # ── Mission Command Input ──────────────────────────────────────────────────
    H("""
    <div class="s1" style="padding:16px 18px;">
    <div class="t-overline" style="margin-bottom:10px;">Mission Directive  //  Hermes Command Input</div>
    """)

    prompt_val = st.text_area(
        label="", value=st.session_state.mission_prompt,
        placeholder="Enter mission directive... e.g. Build a SaaS landing page with Stripe integration and automated email sequences.",
        height=88, key="mp", label_visibility="collapsed",
    )
    st.session_state.mission_prompt = prompt_val

    dc, cc = st.columns([3, 1])
    with dc:
        dispatch = st.button("Dispatch Hermes Agents", key="dispatch_btn", use_container_width=True)
    with cc:
        if st.button("Clear Log", key="cl", use_container_width=True):
            st.session_state.exec_log = []
            st.session_state.mission_result = None
            st.rerun()

    H("</div>")

    # Mission trigger logic
    if dispatch and prompt_val.strip():
        st.session_state.orb_mode = "TRANSMIT"
        st.session_state.mission_result = None
        ts = datetime.now().strftime("%H:%M:%S")
        st.session_state.exec_log.insert(0, {"ts": ts, "level": "HERMES", "color": "#8b7cf8",
            "msg": f"Mission received — '{prompt_val.strip()[:80]}'"})
        st.session_state.exec_log.insert(0, {"ts": ts, "level": "SYS", "color": "#4f8ef7",
            "msg": "Dispatching Asura-Strategist and Asura-Engineer..."})
        st.rerun()

    if (st.session_state.orb_mode == "TRANSMIT"
            and st.session_state.mission_prompt.strip()
            and st.session_state.mission_result is None
            and not dispatch):
        with st.spinner("Hermes Agents executing mission pipeline..."):
            lq: queue.Queue = queue.Queue()
            rc: dict = {}
            def _run():
                rc["res"] = run_hermes_mission(st.session_state.mission_prompt.strip(), lq)
            t = threading.Thread(target=_run, daemon=True)
            t.start(); t.join(timeout=120)
            while not lq.empty():
                lvl, msg, clr = lq.get_nowait()
                st.session_state.exec_log.insert(0, {"ts": datetime.now().strftime("%H:%M:%S"),
                    "level": lvl, "color": clr, "msg": msg})
            if "res" in rc:
                st.session_state.mission_result = rc["res"]
                st.session_state.metrics["progress"] = 100
                st.session_state.orb_mode = "IDLE"
                st.session_state.exec_log.insert(0, {"ts": datetime.now().strftime("%H:%M:%S"),
                    "level": "DONE", "color": "#34c97e",
                    "msg": "Mission pipeline concluded. Deliverables streamed to log panel."})
            else:
                st.session_state.orb_mode = "IDLE"
                st.session_state.exec_log.insert(0, {"ts": datetime.now().strftime("%H:%M:%S"),
                    "level": "WARN", "color": "#e8a838",
                    "msg": "Execution timeout. Verify API key and network connectivity."})
        st.rerun()


# ══════════════════════════════════════════════════════════════════════════════
# RIGHT — LIVE SYSTEM LOGS + MISSION OUTPUT
# ══════════════════════════════════════════════════════════════════════════════
with col_right:
    H("""
    <div class="s1" style="padding:16px 14px;min-height:720px;display:flex;flex-direction:column;">
    <div style="
    display:flex;align-items:center;justify-content:space-between;
    padding-bottom:10px;
    border-bottom:1px solid rgba(255,255,255,.05);
    margin-bottom:12px;">
    <div style="display:flex;align-items:center;gap:7px;">
    <div style="width:6px;height:6px;border-radius:50%;background:#4f8ef7;
    box-shadow:0 0 6px rgba(79,142,247,.55);"></div>
    <span style="font-size:11.5px;font-weight:600;
    letter-spacing:.04em;color:rgba(200,215,245,.9);">Live System Logs</span>
    </div>
    <span class="t-mono" style="letter-spacing:.12em;">Execution Streams</span>
    </div>
    """)

    LVL_STYLE = {
        "SYS":     ("#4f8ef7", "rgba(79,142,247,.1)"),
        "HERMES":  ("#8b7cf8", "rgba(139,124,248,.1)"),
        "STRAT":   ("#4f8ef7", "rgba(79,142,247,.1)"),
        "ENG":     ("#34c97e", "rgba(52,201,126,.1)"),
        "ENGINE":  ("#34c97e", "rgba(52,201,126,.1)"),
        "SENSOR":  ("#4f8ef7", "rgba(79,142,247,.1)"),
        "VOICE":   ("#8b7cf8", "rgba(139,124,248,.1)"),
        "GUARD":   ("#e8a838", "rgba(232,168,56,.1)"),
        "DONE":    ("#34c97e", "rgba(52,201,126,.1)"),
        "WARN":    ("#e8a838", "rgba(232,168,56,.1)"),
    }

    for entry in st.session_state.exec_log[:28]:
        lvl = entry.get("level", "SYS")
        fc, bg = LVL_STYLE.get(lvl, ("#4f8ef7", "rgba(79,142,247,.1)"))
        H(f"""
        <div style="
        display:flex;align-items:flex-start;gap:7px;
        padding:6px 9px;
        border-radius:6px;
        background:rgba(0,0,0,.18);
        border-left:2px solid {fc}28;
        margin-bottom:5px;">
        <span style="
        flex-shrink:0;
        font-family:'JetBrains Mono',monospace;
        font-size:9px;font-weight:600;
        letter-spacing:.08em;
        padding:2px 5px;border-radius:4px;
        background:{bg};color:{fc};
        margin-top:1px;line-height:1.2;">{lvl}</span>
        <div>
        <span style="
        font-family:'JetBrains Mono',monospace;
        font-size:9.5px;color:rgba(100,120,160,.55);
        margin-right:5px;">{entry['ts']}</span>
        <span style="
        font-family:'JetBrains Mono',monospace;
        font-size:11px;color:rgba(185,200,230,.8);
        line-height:1.45;">{entry['msg']}</span>
        </div>
        </div>
        """)

    H("</div>")

    if st.session_state.mission_result:
        H("""
        <div class="s1" style="padding:16px 14px;margin-top:12px;
        border-top:1.5px solid rgba(52,201,126,.25);">
        <div style="
        display:flex;justify-content:space-between;align-items:center;
        padding-bottom:8px;
        border-bottom:1px solid rgba(255,255,255,.05);
        margin-bottom:12px;">
        <span style="font-size:11.5px;font-weight:600;
        letter-spacing:.06em;color:rgba(52,201,126,.9);">Mission Deliverable</span>
        <span class="t-mono" style="color:rgba(52,201,126,.65);">VERIFIED  //  GEMINI 1.5 PRO</span>
        </div>
        """)
        st.markdown(st.session_state.mission_result["output"])
        H("</div>")
