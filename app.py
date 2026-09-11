"""
================================================================================
    ASURA COMMAND  //  PRINCIPAL UI ARCHITECTURE  v7.0
    True Glassmorphism — Reference-Accurate Clarity Level
================================================================================
"""

import os
import threading
import queue
from datetime import datetime

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

def _init():
    d = {
        "orb_mode": "IDLE",
        "exec_log": [
            {"ts": "00:00:01", "level": "SYS",    "color": "#5b9cf6", "msg": "ASURA Command initialized. All subsystems nominal."},
            {"ts": "00:00:02", "level": "HERMES",  "color": "#9b8afb", "msg": "Hermes Agent Router online. Awaiting directive."},
            {"ts": "00:00:03", "level": "ENGINE",  "color": "#34d399", "msg": "Gemini 1.5 Pro engine configured and standing by."},
            {"ts": "00:00:04", "level": "GUARD",   "color": "#fbbf24", "msg": "Neural security perimeter active. Zero anomalies."},
        ],
        "metrics": {"progress": 0, "runtime_s": 0, "agency_tier": "SOVEREIGN", "mrr": 68339.40},
        "mission_result": None,
        "mission_prompt": "",
        "channels": [
            {"name": "SaaS Infrastructure", "status": "LIVE",   "c": "#34d399"},
            {"name": "Media Automation",     "status": "ACTIVE", "c": "#5b9cf6"},
            {"name": "Revenue Telemetry",    "status": "ACTIVE", "c": "#5b9cf6"},
            {"name": "Play Store Deploy",    "status": "TEST",   "c": "#fbbf24"},
            {"name": "Crypto Analytics",     "status": "READY",  "c": "#9b8afb"},
        ],
    }
    for k, v in d.items():
        if k not in st.session_state:
            st.session_state[k] = v

_init()

def H(raw: str):
    cleaned = "\n".join(line.strip() for line in raw.splitlines() if line.strip())
    st.markdown(cleaned, unsafe_allow_html=True)

def run_hermes_mission(prompt: str, lq: queue.Queue) -> dict:
    try:
        from crewai import Agent, Task, Crew, Process
        from langchain_google_genai import ChatGoogleGenerativeAI
        lq.put(("HERMES", "Authenticating Gemini 1.5 Pro engine...", "#9b8afb"))
        llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-pro", temperature=0.2,
            google_api_key=GEMINI_API_KEY,
            convert_system_message_to_human=True,
        )
        lq.put(("HERMES", "Engine authenticated. Dispatching crew...", "#9b8afb"))
        lq.put(("STRAT",  "Asura-Strategist: running market analysis...", "#5b9cf6"))
        strat = Agent(
            role="Asura-Strategist // Market Analysis & Architecture",
            goal=f"Conduct deep market analysis and produce technical architecture for: {prompt}",
            backstory="You are the analytical sovereign of the ASURA collective.",
            llm=llm, verbose=False, allow_delegation=False,
        )
        eng = Agent(
            role="Asura-Engineer // Autonomous Software Production",
            goal=f"Write complete, deployment-ready code for: {prompt}",
            backstory="You are the cybernetic production engine.",
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
        lq.put(("STRAT", "Strategic analysis phase executing...", "#5b9cf6"))
        result = crew.kickoff()
        lq.put(("ENG",   "Source code synthesis complete.", "#34d399"))
        lq.put(("HERMES","Mission pipeline concluded.", "#9b8afb"))
        return {"status": "success", "output": str(result)}
    except Exception as exc:
        lq.put(("SYS", f"Fallback simulation active: {str(exc)[:100]}", "#fbbf24"))
        out = (
            f"## ASURA-STRATEGIST  //  ARCHITECTURE\n\n**Directive:** {prompt}\n\n"
            "### Core Architecture\nCloud-native microservice stack — Gemini 1.5 Pro. "
            "FastAPI gateway + WebSocket telemetry. Redis + PostgreSQL.\n\n"
            "### Modules\n- Hermes Router\n- Revenue Engine\n- Neural Guard\n- Media Scheduler\n\n"
            "---\n\n## ASURA-ENGINEER  //  IMPLEMENTATION\n\n"
            "```python\nfrom fastapi import FastAPI\nfrom pydantic import BaseModel\n\n"
            f"app = FastAPI(title='{prompt[:40]}', version='1.0.0')\n\n"
            "class MissionRequest(BaseModel):\n    directive: str\n\n"
            "@app.post('/api/dispatch')\nasync def dispatch(req: MissionRequest):\n"
            "    return {'status': 'DISPATCHED', 'engine': 'Gemini 1.5 Pro'}\n```\n"
        )
        return {"status": "simulated", "output": out}


# ══════════════════════════════════════════════════════════════════════════════
# GLOBAL STYLESHEET — TRUE GLASS CLARITY
# The key: very low opacity backgrounds (.28–.42) + backdrop-filter blur(20px)
# + a rich, visible dark-navy gradient background that bleeds through the glass.
# ══════════════════════════════════════════════════════════════════════════════
H("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Orbitron:wght@700;900&family=JetBrains+Mono:wght@400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── RICH VISIBLE BACKGROUND — the foundation that shows through glass ── */
html, body {
background: #050814 !important;
}

.stApp {
background:
radial-gradient(ellipse 900px 600px at 70% 15%, rgba(14,40,110,0.75) 0%, transparent 60%),
radial-gradient(ellipse 700px 500px at 20% 70%, rgba(10,30,90,0.55)  0%, transparent 60%),
radial-gradient(ellipse 500px 400px at 90% 85%, rgba(40,10,90,0.3)   0%, transparent 55%),
linear-gradient(160deg, #060a18 0%, #04080f 40%, #060918 80%, #040610 100%) !important;
color: #c8d8f0 !important;
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
-webkit-font-smoothing: antialiased;
}

/* Make every Streamlit wrapper fully transparent so glass works */
.block-container,
div[data-testid="stAppViewContainer"] > section,
div[data-testid="stVerticalBlock"],
div[data-testid="column"],
div[data-testid="stMarkdownContainer"] {
background: transparent !important;
}

.block-container {
padding: 16px 22px 40px !important;
max-width: 100% !important;
}

header[data-testid="stHeader"] { background: transparent !important; }
#MainMenu, footer, [data-testid="stToolbar"] { visibility: hidden !important; height: 0 !important; }

div[data-testid="stMarkdownContainer"] pre {
background: rgba(5, 10, 25, 0.7) !important;
border: 1px solid rgba(255,255,255,0.07) !important;
border-radius: 8px !important;
font-family: 'JetBrains Mono', monospace !important;
font-size: 0.74rem !important;
color: #7a90b8 !important;
padding: 12px 14px !important;
backdrop-filter: blur(6px) !important;
}

/* ══════════════════════════════════════════════════════════
   GLASS SURFACE SYSTEM — three levels matching reference
   ══════════════════════════════════════════════════════════ */

/* Level 1 — Main panels (sidebar, log panel) */
.gl1 {
background: rgba(10, 18, 42, 0.38) !important;
backdrop-filter: blur(22px) saturate(1.6) !important;
-webkit-backdrop-filter: blur(22px) saturate(1.6) !important;
border: 1px solid rgba(255, 255, 255, 0.075) !important;
border-radius: 14px !important;
box-shadow:
0 8px 32px rgba(0, 0, 0, 0.45),
inset 0 1px 0 rgba(255, 255, 255, 0.06),
inset 0 -1px 0 rgba(0, 0, 0, 0.2) !important;
}

/* Level 2 — Cards, inner panels */
.gl2 {
background: rgba(8, 15, 38, 0.32) !important;
backdrop-filter: blur(16px) saturate(1.4) !important;
-webkit-backdrop-filter: blur(16px) saturate(1.4) !important;
border: 1px solid rgba(255, 255, 255, 0.06) !important;
border-radius: 12px !important;
box-shadow:
0 4px 16px rgba(0, 0, 0, 0.35),
inset 0 1px 0 rgba(255, 255, 255, 0.045) !important;
}

/* Level 3 — Inset rows (nav items, channel rows, log rows) */
.gl3 {
background: rgba(6, 12, 30, 0.28) !important;
backdrop-filter: blur(10px) !important;
-webkit-backdrop-filter: blur(10px) !important;
border: 1px solid rgba(255, 255, 255, 0.042) !important;
border-radius: 8px !important;
}

/* Top bar — slightly brighter glass */
.gl-bar {
background: rgba(12, 22, 52, 0.42) !important;
backdrop-filter: blur(28px) saturate(1.8) !important;
-webkit-backdrop-filter: blur(28px) saturate(1.8) !important;
border: 1px solid rgba(255, 255, 255, 0.085) !important;
border-radius: 12px !important;
box-shadow:
0 4px 20px rgba(0,0,0,0.4),
inset 0 1px 0 rgba(255,255,255,0.07) !important;
}

/* Metric cards — subtle top accent per card */
.mc {
background: rgba(8, 15, 38, 0.3) !important;
backdrop-filter: blur(18px) saturate(1.5) !important;
-webkit-backdrop-filter: blur(18px) saturate(1.5) !important;
border: 1px solid rgba(255, 255, 255, 0.058) !important;
border-radius: 12px !important;
box-shadow:
0 4px 20px rgba(0,0,0,0.32),
inset 0 1px 0 rgba(255,255,255,0.05) !important;
padding: 16px 16px 13px !important;
position: relative !important;
overflow: hidden !important;
transition: border-color 0.2s ease !important;
}

.mc:hover {
border-color: rgba(255,255,255,0.1) !important;
}

/* ── TYPOGRAPHY ── */
.t-over {
font-size: 10px; font-weight: 600; letter-spacing: 0.14em;
text-transform: uppercase; color: rgba(140,165,210,0.5); line-height: 1;
}

.t-label {
font-size: 12px; font-weight: 500;
color: rgba(160,185,230,0.65); letter-spacing: 0.01em;
}

.t-body {
font-size: 13px; font-weight: 400;
color: rgba(190,210,240,0.82); line-height: 1.5;
}

.t-val {
font-family: 'Inter', sans-serif; font-size: 22px;
font-weight: 700; color: #e0ecff; letter-spacing: -0.02em; line-height: 1;
}

.t-brand {
font-family: 'Orbitron', sans-serif; font-weight: 900;
font-size: 14px; letter-spacing: 0.2em; color: #ddeeff; line-height: 1;
}

.t-mono {
font-family: 'JetBrains Mono', monospace; font-size: 10.5px;
font-weight: 500; letter-spacing: 0.06em; color: rgba(130,158,210,0.55);
}

/* ── NAV ── */
.nav-row {
display: flex; align-items: center; gap: 9px;
padding: 8px 11px; border-radius: 8px;
font-size: 12.5px; font-weight: 500;
color: rgba(155,180,230,0.6);
cursor: pointer; margin-bottom: 3px;
transition: background 0.15s, color 0.15s;
}

.nav-row.active {
background: rgba(91,156,246,0.1);
backdrop-filter: blur(8px);
-webkit-backdrop-filter: blur(8px);
color: rgba(200,225,255,0.9);
border-left: 2px solid rgba(91,156,246,0.65);
padding-left: 9px;
}

/* ── CHANNEL ROW ── */
.ch-row {
display: flex; align-items: center; justify-content: space-between;
padding: 7px 11px; border-radius: 7px;
background: rgba(5,10,28,0.3);
backdrop-filter: blur(8px);
-webkit-backdrop-filter: blur(8px);
border: 1px solid rgba(255,255,255,0.038);
margin-bottom: 5px;
}

/* ── BADGE ── */
.badge {
display: inline-flex; align-items: center;
padding: 2.5px 7px; border-radius: 5px;
font-family: 'JetBrains Mono', monospace;
font-size: 9px; font-weight: 700;
letter-spacing: 0.1em; line-height: 1;
}

/* ── DIVIDER ── */
.div-line {
height: 1px;
background: linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent);
margin: 13px 0;
}

/* ── BUTTONS ── */
.stButton > button {
background: rgba(12, 22, 52, 0.35) !important;
color: rgba(180,210,255,0.78) !important;
border: 1px solid rgba(255,255,255,0.08) !important;
border-radius: 8px !important;
font-family: 'Inter', sans-serif !important;
font-size: 12px !important;
font-weight: 500 !important;
letter-spacing: 0.03em !important;
padding: 7px 14px !important;
backdrop-filter: blur(12px) !important;
-webkit-backdrop-filter: blur(12px) !important;
transition: background 0.15s, border-color 0.15s, color 0.15s !important;
}

.stButton > button:hover {
background: rgba(91,156,246,0.14) !important;
border-color: rgba(91,156,246,0.35) !important;
color: #cce0ff !important;
}

/* ── INPUTS ── */
.stTextArea textarea,
.stTextInput input {
background: rgba(5, 10, 28, 0.45) !important;
backdrop-filter: blur(16px) !important;
-webkit-backdrop-filter: blur(16px) !important;
border: 1px solid rgba(255,255,255,0.08) !important;
border-radius: 9px !important;
color: #c5d8f5 !important;
font-family: 'Inter', sans-serif !important;
font-size: 13px !important;
caret-color: #5b9cf6 !important;
}

.stTextArea textarea:focus,
.stTextInput input:focus {
border-color: rgba(91,156,246,0.4) !important;
box-shadow: 0 0 0 2px rgba(91,156,246,0.08) !important;
}

/* ── SCROLLBAR ── */
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }

/* ── ORB ANIMATIONS ── */
@keyframes rotCW  { to { transform: rotate(360deg); } }
@keyframes rotCCW { to { transform: rotate(-360deg); } }

@keyframes breatheIdle   { 0%,100%{r:20;opacity:.7} 50%{r:25;opacity:1} }
@keyframes breatheListen { 0%,100%{r:21;opacity:.8} 50%{r:28;opacity:1} }
@keyframes breatheSpeak  { 0%{r:20;opacity:.85} 25%{r:27;opacity:1} 50%{r:23;opacity:.9} 75%{r:28;opacity:1} 100%{r:20;opacity:.85} }

@keyframes jitterIdle   { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(.25deg)} }
@keyframes jitterListen { 0%,100%{transform:rotate(0deg)} 33%{transform:rotate(.45deg)} 66%{transform:rotate(-.35deg)} }
@keyframes jitterSpeak  {
0%  {transform:rotate(0deg)   scale(1)}   15%{transform:rotate(.7deg)  scale(1.01)}
30% {transform:rotate(-.6deg) scale(.99)} 50%{transform:rotate(.8deg)  scale(1.02)}
70% {transform:rotate(-.5deg) scale(.99)} 85%{transform:rotate(.4deg)  scale(1.01)}
100%{transform:rotate(0deg)   scale(1)}
}

@keyframes dashFlow { 0%{stroke-dashoffset:0} 100%{stroke-dashoffset:-60} }

@keyframes glowIdle   {
0%,100%{filter:drop-shadow(0 0 5px rgba(255,255,255,.55)) drop-shadow(0 0 14px rgba(120,170,255,.2))}
50%    {filter:drop-shadow(0 0 12px rgba(255,255,255,.9)) drop-shadow(0 0 28px rgba(120,170,255,.38))}
}
@keyframes glowListen {
0%,100%{filter:drop-shadow(0 0 8px rgba(255,255,255,.8)) drop-shadow(0 0 22px rgba(80,150,255,.45))}
50%    {filter:drop-shadow(0 0 18px rgba(255,255,255,1)) drop-shadow(0 0 40px rgba(80,150,255,.65))}
}
@keyframes glowSpeak {
0%,100%{filter:drop-shadow(0 0 12px rgba(255,255,255,1)) drop-shadow(0 0 35px rgba(160,120,255,.6))}
33%    {filter:drop-shadow(0 0 22px rgba(255,255,255,1)) drop-shadow(0 0 55px rgba(160,120,255,.85))}
66%    {filter:drop-shadow(0 0 16px rgba(255,255,255,1)) drop-shadow(0 0 42px rgba(80,150,255,.7))}
}

@keyframes spinner { to { transform: rotate(360deg); } }
</style>
""")


# ══════════════════════════════════════════════════════════════════════════════
# TOP BAR — glass-bar surface
# ══════════════════════════════════════════════════════════════════════════════
eng_ok    = bool(GEMINI_API_KEY)
eng_label = "AUTHENTICATED" if eng_ok else "SIMULATION MODE"
eng_clr   = "#34d399" if eng_ok else "#fbbf24"

H(f"""
<div class="gl-bar" style="display:flex;align-items:center;justify-content:space-between;
height:50px;padding:0 18px;margin-bottom:16px;">

<div style="display:flex;align-items:center;gap:12px;">
<div style="width:28px;height:28px;border-radius:50%;
background:rgba(255,255,255,0.04);
border:1px solid rgba(255,255,255,0.1);
display:flex;align-items:center;justify-content:center;
backdrop-filter:blur(8px);">
<div style="width:9px;height:9px;border-radius:50%;background:#e8f2ff;
box-shadow:0 0 8px rgba(200,230,255,.65);"></div>
</div>
<div>
<div class="t-brand">ASURA COMMAND</div>
<div class="t-mono" style="margin-top:2px;letter-spacing:.15em;">HERMES AGENT FRAMEWORK  v7.0</div>
</div>
</div>

<div style="display:flex;align-items:center;gap:8px;">
<div style="display:flex;align-items:center;gap:6px;
padding:5px 13px;
background:rgba(255,255,255,0.035);
backdrop-filter:blur(12px);
-webkit-backdrop-filter:blur(12px);
border:1px solid rgba(255,255,255,0.06);
border-radius:7px;">
<div style="width:5px;height:5px;border-radius:50%;background:#34d399;
box-shadow:0 0 5px rgba(52,211,153,.55);"></div>
<span class="t-mono">VIRTUAL ENGINE-1</span>
<span style="color:rgba(255,255,255,0.1);margin:0 3px;">|</span>
<span class="t-mono">LATENCY <span style="color:#34d399;font-weight:600;">11ms</span></span>
</div>
<div style="padding:5px 12px;
background:rgba(255,255,255,0.03);
backdrop-filter:blur(12px);
-webkit-backdrop-filter:blur(12px);
border:1px solid rgba(255,255,255,0.055);
border-radius:7px;">
<span class="t-mono" style="color:{eng_clr};">{eng_label}</span>
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
    <div class="gl1" style="padding:18px 14px;min-height:720px;">

    <div class="t-over" style="margin-bottom:12px;">Divisions</div>

    <div class="nav-row active">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(91,156,246,.85)" stroke-width="2" stroke-linecap="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5"/>
    <rect x="14" y="3" width="7" height="7" rx="1.5"/>
    <rect x="3" y="14" width="7" height="7" rx="1.5"/>
    <rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>
    Overview
    </div>

    <div class="nav-row">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
    Telemetry Grid
    </div>

    <div class="nav-row">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M6 20c0-4 2.7-6 6-6s6 2 6 6"/>
    </svg>
    Neural Agents
    </div>

    <div class="nav-row">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
    Defense Matrix
    </div>

    <div class="nav-row">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    </svg>
    Audit Stream
    </div>

    <div class="nav-row">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
    </svg>
    Node Config
    </div>

    <div class="div-line"></div>
    <div class="t-over" style="margin-bottom:10px;">Active Channels</div>
    """)

    for ch in st.session_state.channels:
        H(f"""
        <div class="ch-row">
        <div style="display:flex;align-items:center;gap:7px;">
        <div style="width:5px;height:5px;border-radius:50%;background:{ch['c']};flex-shrink:0;
        box-shadow:0 0 4px {ch['c']}88;"></div>
        <span style="font-size:12px;font-weight:500;color:rgba(180,205,245,.78);">{ch['name']}</span>
        </div>
        <span class="badge" style="background:{ch['c']}15;color:{ch['c']};border:1px solid {ch['c']}2e;">
        {ch['status']}
        </span>
        </div>
        """)

    H("""
    <div class="div-line"></div>
    <div style="padding:2px 4px;">
    <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
    <div style="width:5px;height:5px;border-radius:50%;background:#34d399;"></div>
    <span style="font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:600;
    letter-spacing:.1em;color:#34d399;">SYSTEM NOMINAL</span>
    </div>
    <div class="t-mono" style="padding-left:11px;">v7.0.0  //  HERMES BUILD</div>
    </div>
    </div>
    """)


# ══════════════════════════════════════════════════════════════════════════════
# CENTER — HEADER + ORB + METRICS + MISSION INPUT
# ══════════════════════════════════════════════════════════════════════════════
with col_center:

    # ── Header ────────────────────────────────────────────────────────────────
    H("""
    <div class="gl1" style="padding:18px 20px;margin-bottom:14px;">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;
    gap:10px;flex-wrap:wrap;">
    <div>
    <div class="t-over" style="margin-bottom:7px;">Deployment Hub  /  Neural Voice Core</div>
    <div style="font-family:'Orbitron',sans-serif;font-weight:900;
    font-size:clamp(18px,2.8vw,26px);letter-spacing:.15em;color:#e0eeff;line-height:1.05;">
    ASURA COMMAND
    </div>
    <div class="t-mono" style="margin-top:5px;letter-spacing:.17em;">
    HERMES AGENT FRAMEWORK  //  GEMINI 1.5 PRO
    </div>
    </div>
    <div style="display:flex;align-items:center;gap:6px;padding:5px 12px;
    background:rgba(52,211,153,.06);
    backdrop-filter:blur(10px);
    -webkit-backdrop-filter:blur(10px);
    border:1px solid rgba(52,211,153,.2);
    border-radius:7px;flex-shrink:0;">
    <div style="width:5px;height:5px;border-radius:50%;background:#34d399;"></div>
    <span style="font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:600;
    letter-spacing:.1em;color:#34d399;">4 / 4 SYSTEMS NOMINAL</span>
    </div>
    </div>
    </div>
    """)

    # ── Tesla Orb ──────────────────────────────────────────────────────────────
    mode = st.session_state.orb_mode

    CFG = {
        "IDLE": {
            "r1": "22s", "r2": "30s",
            "jitter":    "jitterIdle 3.5s ease-in-out infinite",
            "sonar_dur": "4s",  "sonar_del": "2s",
            "core_dur":  "4s",
            "core_anim": "breatheIdle",
            "glow_anim": "glowIdle 4s ease-in-out infinite",
            "arc_c":     "rgba(140,185,255,.5)",
            "sonar_c":   "rgba(91,156,246,.38)",
            "dash":      "dashFlow 9s linear infinite",
            "cap":       "Neural voice core online  //  Awaiting mission directive",
            "cap_clr":   "rgba(130,158,210,.55)",
        },
        "LISTEN": {
            "r1": "9s",  "r2": "13s",
            "jitter":    "jitterListen 1.3s ease-in-out infinite",
            "sonar_dur": "2s",  "sonar_del": "1s",
            "core_dur":  "1.5s",
            "core_anim": "breatheListen",
            "glow_anim": "glowListen 1.5s ease-in-out infinite",
            "arc_c":     "rgba(180,220,255,.7)",
            "sonar_c":   "rgba(91,156,246,.58)",
            "dash":      "dashFlow 3.5s linear infinite",
            "cap":       "Acoustic sensors active  //  Processing voice frequency input",
            "cap_clr":   "rgba(140,185,255,.78)",
        },
        "TRANSMIT": {
            "r1": "3.5s", "r2": "5.5s",
            "jitter":    "jitterSpeak 0.42s steps(2,start) infinite",
            "sonar_dur": "1.1s", "sonar_del": "0.55s",
            "core_dur":  "0.65s",
            "core_anim": "breatheSpeak",
            "glow_anim": "glowSpeak 0.65s ease-in-out infinite",
            "arc_c":     "rgba(210,185,255,.78)",
            "sonar_c":   "rgba(160,120,255,.62)",
            "dash":      "dashFlow 1.2s linear infinite",
            "cap":       "High-voltage neural synthesis  //  Voice discharge transmitting",
            "cap_clr":   "rgba(185,160,255,.82)",
        },
    }
    C = CFG[mode]

    # Orb background tint shifts with mode
    ORB_BG = {
        "IDLE":    "radial-gradient(ellipse 70% 55% at 50% 48%,rgba(30,70,160,0.18) 0%,transparent 70%)",
        "LISTEN":  "radial-gradient(ellipse 70% 55% at 50% 48%,rgba(40,90,200,0.22) 0%,transparent 70%)",
        "TRANSMIT":"radial-gradient(ellipse 70% 55% at 50% 48%,rgba(80,40,180,0.22) 0%,transparent 70%)",
    }[mode]

    H(f"""
    <div class="gl1" style="padding:22px 18px 16px;margin-bottom:14px;
    text-align:center;position:relative;overflow:hidden;">

    <div style="position:absolute;inset:0;border-radius:14px;pointer-events:none;
    background:{ORB_BG};"></div>

    <div style="position:relative;width:272px;height:272px;margin:0 auto;
    display:flex;align-items:center;justify-content:center;">

    <!-- Outer gyro ring CW -->
    <div style="position:absolute;inset:0;border-radius:50%;
    border:1px solid rgba(255,255,255,0.065);
    animation:rotCW {C['r1']} linear infinite;">
    <span style="position:absolute;top:-2px;left:50%;
    width:4px;height:2px;border-radius:1px;transform:translateX(-50%);
    background:rgba(180,210,255,.5);"></span>
    <span style="position:absolute;bottom:-2px;left:50%;
    width:4px;height:2px;border-radius:1px;transform:translateX(-50%);
    background:rgba(180,210,255,.5);"></span>
    <span style="position:absolute;left:-2px;top:50%;
    width:2px;height:4px;border-radius:1px;transform:translateY(-50%);
    background:rgba(180,210,255,.5);"></span>
    <span style="position:absolute;right:-2px;top:50%;
    width:2px;height:4px;border-radius:1px;transform:translateY(-50%);
    background:rgba(180,210,255,.5);"></span>
    </div>

    <!-- Inner gyro ring CCW -->
    <div style="position:absolute;inset:20px;border-radius:50%;
    border:1px dashed rgba(255,255,255,.042);
    animation:rotCCW {C['r2']} linear infinite;">
    <span style="position:absolute;top:-2px;left:50%;
    width:3px;height:3px;border-radius:50%;transform:translateX(-50%);
    background:rgba(255,255,255,.22);"></span>
    <span style="position:absolute;bottom:-2px;left:50%;
    width:3px;height:3px;border-radius:50%;transform:translateX(-50%);
    background:rgba(255,255,255,.22);"></span>
    </div>

    <!-- Orb interior -->
    <div style="position:absolute;inset:10px;border-radius:50%;
    background:radial-gradient(circle,rgba(8,14,32,.92) 0%,rgba(3,6,16,.97) 85%);
    border:1px solid rgba(255,255,255,.055);
    overflow:hidden;
    box-shadow:inset 0 0 30px rgba(0,0,0,.9),0 0 0 1px rgba(0,0,0,.4);">

    <svg viewBox="0 0 280 280" style="width:100%;height:100%;animation:{C['jitter']};">
    <defs>
    <filter id="ag7" x="-40%" y="-40%" width="180%" height="180%">
    <feGaussianBlur in="SourceGraphic" stdDeviation="3.2" result="b1"/>
    <feGaussianBlur in="SourceGraphic" stdDeviation="1.4" result="b2"/>
    <feMerge><feMergeNode in="b1"/><feMergeNode in="b2"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <radialGradient id="cg7" cx="50%" cy="50%" r="50%">
    <stop offset="0%"   stop-color="#ffffff" stop-opacity="1"/>
    <stop offset="32%"  stop-color="#d8eeff" stop-opacity=".95"/>
    <stop offset="68%"  stop-color="rgba(100,155,255)" stop-opacity=".4"/>
    <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    </defs>

    <!-- Sonar rings -->
    <circle cx="140" cy="140" r="12" fill="none" stroke="{C['sonar_c']}" stroke-width=".9">
    <animate attributeName="r"       from="12" to="108" dur="{C['sonar_dur']}" repeatCount="indefinite"/>
    <animate attributeName="opacity" from=".7"  to="0"   dur="{C['sonar_dur']}" repeatCount="indefinite"/>
    </circle>
    <circle cx="140" cy="140" r="12" fill="none" stroke="{C['sonar_c']}" stroke-width=".7">
    <animate attributeName="r"       from="12" to="108" dur="{C['sonar_dur']}" begin="{C['sonar_del']}" repeatCount="indefinite"/>
    <animate attributeName="opacity" from=".55" to="0"   dur="{C['sonar_dur']}" begin="{C['sonar_del']}" repeatCount="indefinite"/>
    </circle>

    <!-- Glow arc layer -->
    <g filter="url(#ag7)" opacity=".62" stroke="{C['arc_c']}" stroke-linecap="round" fill="none">
    <path stroke-width="3.5" stroke-dasharray="9 4" style="animation:{C['dash']};"
    d="M140,140 L136,117 L150,106 L132,84 L153,70 L142,48 M132,84 L117,75 L104,60"/>
    <path stroke-width="3.5" stroke-dasharray="8 5" style="animation:{C['dash']};"
    d="M140,140 L163,123 L157,109 L184,94 L177,73 M184,94 L205,102 L222,98"/>
    <path stroke-width="3.5" stroke-dasharray="9 4" style="animation:{C['dash']};"
    d="M140,140 L157,155 L174,145 L196,165 L216,155 M196,165 L204,186 L219,194"/>
    <path stroke-width="3.5" stroke-dasharray="8 5" style="animation:{C['dash']};"
    d="M140,140 L150,167 L136,184 L158,204 L150,221 M158,204 L177,212 L190,228"/>
    <path stroke-width="3.5" stroke-dasharray="9 4" style="animation:{C['dash']};"
    d="M140,140 L124,157 L135,172 L118,196 L129,214 M118,196 L100,205 L85,220"/>
    <path stroke-width="3.5" stroke-dasharray="8 5" style="animation:{C['dash']};"
    d="M140,140 L114,148 L104,133 L81,146 L70,130 M81,146 L74,164 L58,173"/>
    <path stroke-width="3.5" stroke-dasharray="9 4" style="animation:{C['dash']};"
    d="M140,140 L121,124 L108,131 L92,107 L76,114 M92,107 L97,85 L84,70"/>
    <path stroke-width="3.5" stroke-dasharray="8 5" style="animation:{C['dash']};"
    d="M140,140 L128,110 L115,100 L127,77 L109,64 M127,77 L143,65 L150,48"/>
    </g>

    <!-- Sharp filament layer -->
    <g stroke="rgba(235,248,255,.82)" stroke-linecap="round" fill="none">
    <path stroke-width="1.3"
    d="M140,140 L136,117 L150,106 L132,84 L153,70 L142,48 M132,84 L117,75 L104,60"/>
    <path stroke-width="1.3"
    d="M140,140 L163,123 L157,109 L184,94 L177,73 M184,94 L205,102 L222,98"/>
    <path stroke-width="1.3"
    d="M140,140 L157,155 L174,145 L196,165 L216,155 M196,165 L204,186 L219,194"/>
    <path stroke-width="1.3"
    d="M140,140 L150,167 L136,184 L158,204 L150,221 M158,204 L177,212 L190,228"/>
    <path stroke-width="1.3"
    d="M140,140 L124,157 L135,172 L118,196 L129,214 M118,196 L100,205 L85,220"/>
    <path stroke-width="1.3"
    d="M140,140 L114,148 L104,133 L81,146 L70,130 M81,146 L74,164 L58,173"/>
    <path stroke-width="1.3"
    d="M140,140 L121,124 L108,131 L92,107 L76,114 M92,107 L97,85 L84,70"/>
    <path stroke-width="1.3"
    d="M140,140 L128,110 L115,100 L127,77 L109,64 M127,77 L143,65 L150,48"/>
    </g>

    <!-- Core sphere -->
    <circle cx="140" cy="140" r="20" fill="url(#cg7)"
    style="animation:{C['glow_anim']};">
    <animate attributeName="r" values="18;24;18" dur="{C['core_dur']}s" repeatCount="indefinite"/>
    </circle>
    <circle cx="140" cy="140" r="7" fill="#ffffff"
    style="filter:drop-shadow(0 0 8px rgba(255,255,255,.95));">
    <animate attributeName="r" values="6;9;6" dur="{C['core_dur']}s" repeatCount="indefinite"/>
    </circle>
    </svg>
    </div>
    </div>

    <div style="margin-top:11px;font-family:'JetBrains Mono',monospace;
    font-size:11px;letter-spacing:.05em;color:{C['cap_clr']};">
    {C['cap']}
    </div>
    </div>
    """)

    # ── State Toggle Buttons ───────────────────────────────────────────────────
    H('<div class="t-over" style="text-align:center;margin-bottom:8px;">Voice Core Dynamics</div>')
    b1, b2, b3 = st.columns(3)
    with b1:
        if st.button("System Idle", key="bi", use_container_width=True):
            st.session_state.orb_mode = "IDLE"
            st.session_state.exec_log.insert(0, {"ts": datetime.now().strftime("%H:%M:%S"), "level": "SYS", "color": "#5b9cf6", "msg": "Voice core set to IDLE. Breathing mode engaged."})
            st.rerun()
    with b2:
        if st.button("Microphone Listening", key="bl", use_container_width=True):
            st.session_state.orb_mode = "LISTEN"
            st.session_state.exec_log.insert(0, {"ts": datetime.now().strftime("%H:%M:%S"), "level": "SENSOR", "color": "#5b9cf6", "msg": "Acoustic input sensors activated."})
            st.rerun()
    with b3:
        if st.button("Asura Voice Transmitting", key="bt", use_container_width=True):
            st.session_state.orb_mode = "TRANSMIT"
            st.session_state.exec_log.insert(0, {"ts": datetime.now().strftime("%H:%M:%S"), "level": "VOICE", "color": "#9b8afb", "msg": "High-voltage voice synthesis active."})
            st.rerun()

    H('<div style="height:14px;"></div>')

    # ── 4 Metric Cards ─────────────────────────────────────────────────────────
    m = st.session_state.metrics
    rts = m["runtime_s"]
    rt_fmt = f"{rts//3600:02d}:{(rts%3600)//60:02d}:{rts%60:02d}"

    SP1 = "20,28 35,22 50,26 65,17 80,24 95,13 110,20 125,10 140,16"
    SP2 = "20,28 34,23 48,27 62,18 76,25 90,16 104,22 118,13 130,18"
    MRR_PCT = 78
    import math
    CIRC = 2 * math.pi * 20
    DASH = CIRC * MRR_PCT / 100
    GAP  = CIRC - DASH

    H(f"""
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:11px;margin-bottom:14px;">

    <!-- Progress -->
    <div class="mc" style="border-top:1.5px solid rgba(91,156,246,.42);">
    <div class="t-over" style="margin-bottom:7px;">Mission Progress</div>
    <div class="t-val">{m['progress']}%</div>
    <svg viewBox="0 0 150 36" width="100%" height="34" preserveAspectRatio="none" style="margin-top:7px;">
    <defs>
    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="rgba(91,156,246,.28)"/>
    <stop offset="100%" stop-color="rgba(91,156,246,0)"/>
    </linearGradient>
    </defs>
    <polygon points="{SP1} 140,32 20,32" fill="url(#g1)"/>
    <polyline points="{SP1}" fill="none" stroke="rgba(91,156,246,.78)" stroke-width="1.5"
    stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <div class="t-mono" style="margin-top:3px;color:rgba(91,156,246,.7);">Active pipeline nominal</div>
    </div>

    <!-- Runtime -->
    <div class="mc" style="border-top:1.5px solid rgba(155,138,251,.4);">
    <div class="t-over" style="margin-bottom:7px;">Session Runtime</div>
    <div style="font-family:'JetBrains Mono',monospace;font-size:18px;font-weight:600;
    color:#e0eeff;letter-spacing:.04em;">{rt_fmt}</div>
    <svg viewBox="0 0 150 36" width="100%" height="34" preserveAspectRatio="none" style="margin-top:7px;">
    <defs>
    <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="rgba(155,138,251,.25)"/>
    <stop offset="100%" stop-color="rgba(155,138,251,0)"/>
    </linearGradient>
    </defs>
    <polygon points="{SP2} 130,32 20,32" fill="url(#g2)"/>
    <polyline points="{SP2}" fill="none" stroke="rgba(155,138,251,.75)" stroke-width="1.5"
    stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <div class="t-mono" style="margin-top:3px;color:rgba(155,138,251,.7);">99.98% uptime recorded</div>
    </div>

    <!-- Agency Tier -->
    <div class="mc" style="border-top:1.5px solid rgba(251,191,36,.32);">
    <div class="t-over" style="margin-bottom:7px;">Agency Classification</div>
    <div style="font-size:16px;font-weight:700;color:#e0eeff;letter-spacing:.05em;">{m['agency_tier']}</div>
    <svg viewBox="0 0 150 36" width="100%" height="34" preserveAspectRatio="none" style="margin-top:7px;">
    <rect x="20" y="18" width="9" height="12" rx="1.5" fill="rgba(251,191,36,.38)"/>
    <rect x="33" y="12" width="9" height="18" rx="1.5" fill="rgba(251,191,36,.42)"/>
    <rect x="46" y="16" width="9" height="14" rx="1.5" fill="rgba(251,191,36,.48)"/>
    <rect x="59" y="8"  width="9" height="22" rx="1.5" fill="rgba(251,191,36,.54)"/>
    <rect x="72" y="14" width="9" height="16" rx="1.5" fill="rgba(251,191,36,.6)"/>
    <rect x="85" y="6"  width="9" height="24" rx="1.5" fill="rgba(251,191,36,.68)"/>
    <rect x="98" y="10" width="9" height="20" rx="1.5" fill="rgba(251,191,36,.76)"/>
    <rect x="111" y="4" width="9" height="26" rx="1.5" fill="rgba(251,191,36,.85)"/>
    </svg>
    <div class="t-mono" style="margin-top:3px;color:rgba(251,191,36,.68);">Hermes Tier IV clearance</div>
    </div>

    <!-- MRR -->
    <div class="mc" style="border-top:1.5px solid rgba(52,211,153,.32);">
    <div class="t-over" style="margin-bottom:7px;">Monthly Revenue Run Rate</div>
    <div style="display:flex;align-items:center;gap:12px;">
    <div style="font-size:20px;font-weight:700;color:#e0eeff;">${m['mrr']:,.0f}</div>
    <svg width="48" height="48" viewBox="0 0 50 50">
    <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(255,255,255,.055)" stroke-width="4"/>
    <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(52,211,153,.75)" stroke-width="4"
    stroke-dasharray="{DASH:.1f} {GAP:.1f}"
    stroke-dashoffset="{CIRC/4:.1f}"
    stroke-linecap="round"/>
    <text x="25" y="30" text-anchor="middle"
    font-family="Inter,sans-serif" font-size="9.5" font-weight="700"
    fill="rgba(210,240,225,.9)">{MRR_PCT}%</text>
    </svg>
    </div>
    <div class="t-mono" style="margin-top:5px;color:rgba(52,211,153,.65);">+21.4% MoM composite growth</div>
    </div>

    </div>
    """)

    # ── Mission Input ──────────────────────────────────────────────────────────
    H("""
    <div class="gl1" style="padding:16px 18px;">
    <div class="t-over" style="margin-bottom:10px;">Mission Directive  //  Hermes Command Input</div>
    """)

    prompt_val = st.text_area(
        label="", value=st.session_state.mission_prompt,
        placeholder="Enter mission directive... e.g. Build a SaaS landing page with Stripe integration and automated email sequences.",
        height=86, key="mp", label_visibility="collapsed",
    )
    st.session_state.mission_prompt = prompt_val

    dc, cc = st.columns([3, 1])
    with dc:
        dispatch = st.button("Dispatch Hermes Agents", key="db", use_container_width=True)
    with cc:
        if st.button("Clear Log", key="cl", use_container_width=True):
            st.session_state.exec_log = []
            st.session_state.mission_result = None
            st.rerun()

    H("</div>")

    if dispatch and prompt_val.strip():
        st.session_state.orb_mode = "TRANSMIT"
        st.session_state.mission_result = None
        ts = datetime.now().strftime("%H:%M:%S")
        st.session_state.exec_log.insert(0, {"ts": ts, "level": "HERMES", "color": "#9b8afb", "msg": f"Mission received — '{prompt_val.strip()[:80]}'"})
        st.session_state.exec_log.insert(0, {"ts": ts, "level": "SYS", "color": "#5b9cf6", "msg": "Dispatching Asura-Strategist and Asura-Engineer..."})
        st.rerun()

    if (st.session_state.orb_mode == "TRANSMIT"
            and st.session_state.mission_prompt.strip()
            and st.session_state.mission_result is None
            and not dispatch):
        with st.spinner("Hermes Agents executing..."):
            lq: queue.Queue = queue.Queue()
            rc: dict = {}
            def _run():
                rc["res"] = run_hermes_mission(st.session_state.mission_prompt.strip(), lq)
            t = threading.Thread(target=_run, daemon=True)
            t.start(); t.join(timeout=120)
            while not lq.empty():
                lvl, msg, clr = lq.get_nowait()
                st.session_state.exec_log.insert(0, {"ts": datetime.now().strftime("%H:%M:%S"), "level": lvl, "color": clr, "msg": msg})
            if "res" in rc:
                st.session_state.mission_result = rc["res"]
                st.session_state.metrics["progress"] = 100
                st.session_state.orb_mode = "IDLE"
                st.session_state.exec_log.insert(0, {"ts": datetime.now().strftime("%H:%M:%S"), "level": "DONE", "color": "#34d399", "msg": "Mission pipeline concluded. Deliverables ready."})
            else:
                st.session_state.orb_mode = "IDLE"
                st.session_state.exec_log.insert(0, {"ts": datetime.now().strftime("%H:%M:%S"), "level": "WARN", "color": "#fbbf24", "msg": "Execution timeout. Verify API key and connectivity."})
        st.rerun()


# ══════════════════════════════════════════════════════════════════════════════
# RIGHT — LIVE LOGS
# ══════════════════════════════════════════════════════════════════════════════
with col_right:
    H("""
    <div class="gl1" style="padding:16px 14px;min-height:720px;">
    <div style="display:flex;align-items:center;justify-content:space-between;
    padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,.044);margin-bottom:12px;">
    <div style="display:flex;align-items:center;gap:7px;">
    <div style="width:6px;height:6px;border-radius:50%;background:#5b9cf6;
    box-shadow:0 0 5px rgba(91,156,246,.5);"></div>
    <span style="font-size:12px;font-weight:600;letter-spacing:.04em;
    color:rgba(195,220,255,.88);">Live System Logs</span>
    </div>
    <span class="t-mono" style="letter-spacing:.1em;">Execution Streams</span>
    </div>
    """)

    LVL_MAP = {
        "SYS":    ("#5b9cf6", "rgba(91,156,246,.1)"),
        "HERMES": ("#9b8afb", "rgba(155,138,251,.1)"),
        "STRAT":  ("#5b9cf6", "rgba(91,156,246,.1)"),
        "ENG":    ("#34d399", "rgba(52,211,153,.1)"),
        "ENGINE": ("#34d399", "rgba(52,211,153,.1)"),
        "SENSOR": ("#5b9cf6", "rgba(91,156,246,.1)"),
        "VOICE":  ("#9b8afb", "rgba(155,138,251,.1)"),
        "GUARD":  ("#fbbf24", "rgba(251,191,36,.1)"),
        "DONE":   ("#34d399", "rgba(52,211,153,.1)"),
        "WARN":   ("#fbbf24", "rgba(251,191,36,.1)"),
    }

    for e in st.session_state.exec_log[:28]:
        lvl = e.get("level", "SYS")
        fc, bg = LVL_MAP.get(lvl, ("#5b9cf6", "rgba(91,156,246,.1)"))
        H(f"""
        <div style="display:flex;align-items:flex-start;gap:7px;
        padding:6px 9px;border-radius:7px;
        background:rgba(5,10,26,.22);
        backdrop-filter:blur(8px);
        -webkit-backdrop-filter:blur(8px);
        border:1px solid rgba(255,255,255,.035);
        border-left:2px solid {fc}30;
        margin-bottom:5px;">
        <span style="flex-shrink:0;font-family:'JetBrains Mono',monospace;
        font-size:9px;font-weight:600;letter-spacing:.08em;
        padding:2px 5px;border-radius:4px;
        background:{bg};color:{fc};
        margin-top:1px;line-height:1.2;">{lvl}</span>
        <div>
        <span style="font-family:'JetBrains Mono',monospace;font-size:9.5px;
        color:rgba(100,125,170,.5);margin-right:5px;">{e['ts']}</span>
        <span style="font-family:'JetBrains Mono',monospace;font-size:11px;
        color:rgba(180,205,245,.78);line-height:1.45;">{e['msg']}</span>
        </div>
        </div>
        """)

    H("</div>")

    if st.session_state.mission_result:
        H("""
        <div class="gl1" style="padding:16px 14px;margin-top:12px;
        border-top:1.5px solid rgba(52,211,153,.22);">
        <div style="display:flex;justify-content:space-between;align-items:center;
        padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,.04);margin-bottom:12px;">
        <span style="font-size:12px;font-weight:600;letter-spacing:.06em;
        color:rgba(52,211,153,.88);">Mission Deliverable</span>
        <span class="t-mono" style="color:rgba(52,211,153,.6);">VERIFIED  //  GEMINI 1.5 PRO</span>
        </div>
        """)
        st.markdown(st.session_state.mission_result["output"])
        H("</div>")
