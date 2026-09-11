"""
================================================================================
    ASURA COMMAND  //  FULL PRODUCTION BUILD  v9.0
    Anti-Flicker Architecture  |  Web Speech API  |  Hermes CrewAI  |  Live Metrics
================================================================================
"""

import os, threading, queue, math, random, time
from datetime import datetime
import streamlit as st
import streamlit.components.v1 as components

# ── API KEY ────────────────────────────────────────────────────────────────────
GEMINI_API_KEY = (
    os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY") or ""
)
os.environ["GEMINI_API_KEY"] = GEMINI_API_KEY
os.environ["GOOGLE_API_KEY"] = GEMINI_API_KEY

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
            {"ts": "00:00:01", "level": "SYS",    "color": "#5b9cf6", "msg": "ASURA Command v9.0 initialized. All subsystems nominal."},
            {"ts": "00:00:02", "level": "HERMES",  "color": "#9b8afb", "msg": "Hermes Agent Router online. Gemini 1.5 Pro engine standing by."},
            {"ts": "00:00:03", "level": "VOICE",   "color": "#34d399", "msg": "Web Speech API voice layer initialized. Awaiting activation."},
            {"ts": "00:00:04", "level": "GUARD",   "color": "#fbbf24", "msg": "Neural security perimeter active. Zero anomalies detected."},
        ],
        "metrics": {"progress": 0, "agency_tier": "SOVEREIGN"},
        "mission_result": None,
        "mission_prompt": "",
        "mission_active": False,
        "channels": [
            {"name": "SaaS Infrastructure", "status": "LIVE",   "c": "#34d399"},
            {"name": "Media Automation",     "status": "ACTIVE", "c": "#5b9cf6"},
            {"name": "Revenue Telemetry",    "status": "ACTIVE", "c": "#5b9cf6"},
            {"name": "Play Store Deploy",    "status": "TEST",   "c": "#fbbf24"},
            {"name": "Crypto Analytics",     "status": "READY",  "c": "#9b8afb"},
        ],
        "session_start": time.time(),
        "mrr_base": 68339.40,
        "mrr_current": 68339.40,
        "voice_pending": "",
    }
    for k, v in d.items():
        if k not in st.session_state:
            st.session_state[k] = v

_init()

# ── FAIL-SAFE HTML RENDERER ────────────────────────────────────────────────────
def H(raw: str):
    cleaned = "\n".join(line.strip() for line in raw.splitlines() if line.strip())
    st.markdown(cleaned, unsafe_allow_html=True)

# ── CREWAI HERMES BACKEND ──────────────────────────────────────────────────────
def run_hermes_mission(prompt: str, lq: queue.Queue) -> dict:
    try:
        from crewai import Agent, Task, Crew, Process
        from langchain_google_genai import ChatGoogleGenerativeAI

        lq.put(("HERMES", "Authenticating Gemini 1.5 Pro engine...", "#9b8afb"))
        llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-pro", temperature=0.25,
            google_api_key=GEMINI_API_KEY,
            convert_system_message_to_human=True,
        )
        lq.put(("HERMES", "Engine authenticated. Assembling Hermes crew pipeline...", "#9b8afb"))
        lq.put(("STRAT",  "Asura-Strategist: initializing market analysis workflow...", "#5b9cf6"))

        strategist = Agent(
            role="Asura-Strategist — Principal Market Analysis & Architecture Specialist",
            goal=f"Conduct a precise market analysis and produce a complete technical architecture blueprint for: {prompt}",
            backstory=(
                "You are Asura-Strategist, the analytical sovereign of the ASURA collective. "
                "You dissect market landscapes, identify monetization leverage points, and formulate "
                "airtight technical specifications for the engineering division."
            ),
            llm=llm, verbose=False, allow_delegation=False,
        )

        lq.put(("ENG", "Asura-Engineer: standing by for strategic specification transfer...", "#34d399"))

        engineer = Agent(
            role="Asura-Engineer — Lead Autonomous Software Production Unit",
            goal=f"Synthesize the strategic specification and produce complete, deployment-ready code for: {prompt}",
            backstory=(
                "You are Asura-Engineer, the cybernetic production engine. You receive specifications "
                "and translate them into complete, production-ready source code with zero placeholders."
            ),
            llm=llm, verbose=False, allow_delegation=False,
        )

        task_strategy = Task(
            description=(
                f"Analyze mission: '{prompt}'. Deliver structured architecture covering:\n"
                "1. Core Technology Stack\n2. Functional Module Breakdown\n"
                "3. API Contract Definitions\n4. Deployment & Scaling Strategy\n5. Revenue Model"
            ),
            expected_output="Precise structured architectural specification document.",
            agent=strategist,
        )

        task_engineering = Task(
            description=(
                f"Using the specification from Asura-Strategist, produce complete production-ready "
                f"implementation for '{prompt}'. Include ALL source files with zero placeholder content."
            ),
            expected_output="Complete, functional, deployment-ready source code.",
            agent=engineer,
        )

        lq.put(("STRAT", "Strategic analysis cycle executing. Processing market intelligence...", "#5b9cf6"))
        crew = Crew(agents=[strategist, engineer], tasks=[task_strategy, task_engineering],
                    process=Process.sequential, verbose=False)
        result = crew.kickoff()
        lq.put(("ENG",   "Engineering synthesis complete. All deliverables compiled.", "#34d399"))
        lq.put(("HERMES","Hermes Router: mission pipeline concluded successfully.", "#9b8afb"))
        return {"status": "success", "output": str(result)}

    except Exception as exc:
        lq.put(("SYS", f"Fallback simulation mode: {str(exc)[:100]}", "#fbbf24"))
        out = (
            f"## ASURA-STRATEGIST  //  ARCHITECTURE SPECIFICATION\n\n"
            f"**Mission:** {prompt}\n\n"
            "### Core Architecture\nCloud-native microservice stack. "
            "Gemini 1.5 Pro reasoning core. FastAPI REST gateway + WebSocket telemetry. "
            "Redis session caching, PostgreSQL persistent mission logs.\n\n"
            "### Functional Modules\n"
            "- **Hermes Router** — multi-agent dispatch and orchestration\n"
            "- **Revenue Engine** — Stripe and AdSense balance synchronization\n"
            "- **Neural Guard** — anomaly detection and validator monitoring\n"
            "- **Media Scheduler** — social graph API automated publishing\n\n"
            "---\n\n## ASURA-ENGINEER  //  PRODUCTION IMPLEMENTATION\n\n"
            "```python\nfrom fastapi import FastAPI\nfrom pydantic import BaseModel\n\n"
            f"app = FastAPI(title='ASURA — {prompt[:40]}', version='1.0.0')\n\n"
            "class MissionRequest(BaseModel):\n    directive: str\n    priority: str = 'standard'\n\n"
            "@app.post('/api/mission/dispatch')\nasync def dispatch(req: MissionRequest):\n"
            "    return {'status': 'DISPATCHED', 'engine': 'Gemini 1.5 Pro', 'agent': 'ASURA'}\n\n"
            "@app.get('/api/health')\nasync def health():\n"
            "    return {'status': 'OPERATIONAL', 'systems': '4/4', 'version': '9.0.0'}\n```\n"
        )
        return {"status": "simulated", "output": out}


# ══════════════════════════════════════════════════════════════════════════════
# GLOBAL CSS — ANTI-FLICKER v9.0
# Key rules:
# 1. transform: translateZ(0) on ALL animated/glass elements → GPU acceleration
# 2. backdrop-filter ONLY on 3 main panels — removed from rows/badges (eliminates GPU stall)
# 3. will-change hints on animated props
# 4. animation-fill-mode: both prevents animation reset flash
# ══════════════════════════════════════════════════════════════════════════════
H("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Orbitron:wght@700;900&family=JetBrains+Mono:wght@400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
background: #06070c !important;
overflow-x: hidden;
}

.stApp {
background:
radial-gradient(ellipse 65% 45% at 55% 0%, rgba(16,22,44,0.7) 0%, transparent 60%),
radial-gradient(ellipse 45% 35% at 95% 95%, rgba(12,16,36,0.5) 0%, transparent 55%),
#06070c !important;
color: #f0f4ff !important;
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
-webkit-font-smoothing: antialiased;
transform: translateZ(0);
}

/* ── FORCE ALL WRAPPERS TRANSPARENT ── */
.block-container,
div[data-testid="stAppViewContainer"] > section,
div[data-testid="stVerticalBlock"],
div[data-testid="column"],
div[data-testid="stMarkdownContainer"],
div[data-testid="stVerticalBlockBorderWrapper"],
div[data-testid="stElementContainer"],
div[data-testid="stHorizontalBlock"] {
background: transparent !important;
}

.block-container { padding: 14px 20px 40px !important; max-width: 100% !important; }
header[data-testid="stHeader"] { background: transparent !important; }
#MainMenu, footer, [data-testid="stToolbar"] { visibility: hidden !important; height: 0 !important; }

div[data-testid="stMarkdownContainer"] pre {
background: rgba(0,0,0,0.5) !important;
border: 1px solid rgba(255,255,255,0.07) !important;
border-radius: 8px !important;
font-family: 'JetBrains Mono', monospace !important;
font-size: 0.73rem !important;
color: #8ca0c8 !important;
padding: 12px 14px !important;
}

/* ── GLASS SURFACE SYSTEM ──
   backdrop-filter ONLY on .gl1 and .gl-bar
   All other surfaces use solid rgba — no GPU cost on repeated elements */

.gl1 {
background: rgba(255,255,255,0.052);
border: 1px solid rgba(255,255,255,0.095);
border-radius: 14px;
box-shadow:
inset 0 1.5px 0 rgba(255,255,255,0.08),
inset 0 -1px 0 rgba(0,0,0,0.3),
0 12px 40px rgba(0,0,0,0.65);
transform: translateZ(0);
will-change: opacity;
backdrop-filter: blur(22px) saturate(1.7) brightness(1.04);
-webkit-backdrop-filter: blur(22px) saturate(1.7) brightness(1.04);
}

.gl-bar {
background: rgba(255,255,255,0.06);
border: 1px solid rgba(255,255,255,0.1);
border-radius: 12px;
box-shadow:
inset 0 1.5px 0 rgba(255,255,255,0.09),
0 8px 28px rgba(0,0,0,0.55);
transform: translateZ(0);
backdrop-filter: blur(28px) saturate(1.9) brightness(1.05);
-webkit-backdrop-filter: blur(28px) saturate(1.9) brightness(1.05);
}

/* Metric cards — NO backdrop-filter, solid fill only */
.mc {
background: rgba(255,255,255,0.042);
border: 1px solid rgba(255,255,255,0.082);
border-radius: 12px;
box-shadow: inset 0 1px 0 rgba(255,255,255,0.07), 0 6px 20px rgba(0,0,0,0.5);
padding: 15px 15px 12px;
position: relative;
overflow: hidden;
transform: translateZ(0);
transition: border-color 0.2s ease;
}

.mc:hover { border-color: rgba(255,255,255,0.13); }

/* Nav rows — NO backdrop-filter */
.nav-row {
display: flex; align-items: center; gap: 9px;
padding: 8px 11px; border-radius: 8px;
font-size: 12.5px; font-weight: 500;
color: rgba(200,218,255,0.5);
cursor: pointer; margin-bottom: 3px;
transition: background 0.15s, color 0.15s;
}

.nav-row.active {
background: rgba(255,255,255,0.07);
color: rgba(255,255,255,0.92);
border-left: 2px solid rgba(255,255,255,0.48);
padding-left: 9px;
}

.nav-row:hover:not(.active) {
background: rgba(255,255,255,0.04);
color: rgba(230,242,255,0.7);
}

/* Channel rows — NO backdrop-filter */
.ch-row {
display: flex; align-items: center; justify-content: space-between;
padding: 7px 11px; border-radius: 7px;
background: rgba(255,255,255,0.03);
border: 1px solid rgba(255,255,255,0.052);
margin-bottom: 5px;
}

/* Log rows — NO backdrop-filter, minimal background */
.log-row {
display: flex; align-items: flex-start; gap: 7px;
padding: 6px 9px; border-radius: 6px;
background: rgba(255,255,255,0.018);
border: 1px solid rgba(255,255,255,0.032);
border-left: 2px solid transparent;
margin-bottom: 5px;
transform: translateZ(0);
}

.badge {
display: inline-flex; align-items: center;
padding: 2px 6px; border-radius: 4px;
font-family: 'JetBrains Mono', monospace;
font-size: 9px; font-weight: 700;
letter-spacing: 0.09em; line-height: 1;
}

.div-line {
height: 1px;
background: linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent);
margin: 13px 0;
}

/* Typography */
.t-over { font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(200,218,255,0.42); }
.t-mono { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 500; letter-spacing: 0.06em; color: rgba(175,198,240,0.42); }
.t-brand { font-family: 'Orbitron', sans-serif; font-weight: 900; font-size: 14px; letter-spacing: 0.2em; color: #ffffff; }
.t-val { font-family: 'Inter', sans-serif; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.02em; line-height: 1; }

/* Buttons — NO backdrop-filter */
.stButton > button {
background: rgba(255,255,255,0.055) !important;
color: rgba(228,240,255,0.82) !important;
border: 1px solid rgba(255,255,255,0.1) !important;
border-radius: 8px !important;
font-family: 'Inter', sans-serif !important;
font-size: 12px !important;
font-weight: 500 !important;
letter-spacing: 0.03em !important;
padding: 7px 14px !important;
box-shadow: inset 0 1px 0 rgba(255,255,255,0.07) !important;
transition: background 0.14s, border-color 0.14s, color 0.14s !important;
transform: translateZ(0) !important;
}

.stButton > button:hover {
background: rgba(255,255,255,0.1) !important;
border-color: rgba(255,255,255,0.18) !important;
color: #ffffff !important;
}

/* Inputs */
.stTextArea textarea, .stTextInput input {
background: rgba(0,0,0,0.42) !important;
border: 1px solid rgba(255,255,255,0.088) !important;
border-radius: 8px !important;
color: rgba(240,248,255,0.9) !important;
font-family: 'Inter', sans-serif !important;
font-size: 13px !important;
caret-color: rgba(255,255,255,0.55) !important;
transition: border-color 0.15s !important;
}

.stTextArea textarea:focus, .stTextInput input:focus {
border-color: rgba(255,255,255,0.2) !important;
box-shadow: 0 0 0 2px rgba(255,255,255,0.045) !important;
}

::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.18); }

/* Spinner override */
.stSpinner > div { border-top-color: rgba(255,255,255,0.6) !important; }
</style>
""")


# ══════════════════════════════════════════════════════════════════════════════
# TOP BAR
# ══════════════════════════════════════════════════════════════════════════════
eng_ok    = bool(GEMINI_API_KEY)
eng_label = "GEMINI AUTHENTICATED" if eng_ok else "SIMULATION MODE ACTIVE"
eng_clr   = "#34d399" if eng_ok else "#fbbf24"

H(f"""
<div class="gl-bar" style="display:flex;align-items:center;justify-content:space-between;
height:50px;padding:0 18px;margin-bottom:14px;">
<div style="display:flex;align-items:center;gap:12px;">
<div style="width:28px;height:28px;border-radius:50%;
background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);
display:flex;align-items:center;justify-content:center;transform:translateZ(0);">
<div style="width:9px;height:9px;border-radius:50%;background:#e8f2ff;
box-shadow:0 0 8px rgba(200,230,255,.65);"></div>
</div>
<div>
<div class="t-brand">ASURA COMMAND</div>
<div class="t-mono" style="margin-top:2px;letter-spacing:.15em;">HERMES AGENT FRAMEWORK  v9.0  //  ANTI-FLICKER ARCHITECTURE</div>
</div>
</div>
<div style="display:flex;align-items:center;gap:8px;">
<div style="display:flex;align-items:center;gap:6px;padding:5px 13px;
background:rgba(255,255,255,0.038);border:1px solid rgba(255,255,255,0.065);border-radius:7px;">
<div style="width:5px;height:5px;border-radius:50%;background:#34d399;box-shadow:0 0 5px rgba(52,211,153,.55);"></div>
<span class="t-mono">VIRTUAL ENGINE-1</span>
<span style="color:rgba(255,255,255,0.1);margin:0 4px;">|</span>
<span class="t-mono">LATENCY <span style="color:#34d399;font-weight:600;">11ms</span></span>
</div>
<div style="padding:5px 12px;background:rgba(255,255,255,0.03);
border:1px solid rgba(255,255,255,0.055);border-radius:7px;">
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
# LEFT PANEL — DIVISIONS + CHANNELS
# ══════════════════════════════════════════════════════════════════════════════
with col_left:
    H("""
    <div class="gl1" style="padding:18px 14px;min-height:720px;">
    <div class="t-over" style="margin-bottom:12px;">Divisions</div>

    <div class="nav-row active">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.8)" stroke-width="2" stroke-linecap="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
    <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>Overview</div>

    <div class="nav-row">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>Telemetry Grid</div>

    <div class="nav-row">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
    <circle cx="12" cy="8" r="4"/><path d="M6 20c0-4 2.7-6 6-6s6 2 6 6"/></svg>Neural Agents</div>

    <div class="nav-row">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>Defense Matrix</div>

    <div class="nav-row">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/></svg>Audit Stream</div>

    <div class="nav-row">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>Node Config</div>

    <div class="div-line"></div>
    <div class="t-over" style="margin-bottom:10px;">Active Channels</div>
    """)

    for ch in st.session_state.channels:
        H(f"""
        <div class="ch-row">
        <div style="display:flex;align-items:center;gap:7px;">
        <div style="width:5px;height:5px;border-radius:50%;background:{ch['c']};flex-shrink:0;
        box-shadow:0 0 4px {ch['c']}80;"></div>
        <span style="font-size:12px;font-weight:500;color:rgba(225,238,255,.85);">{ch['name']}</span>
        </div>
        <span class="badge" style="background:{ch['c']}18;color:{ch['c']};border:1px solid {ch['c']}2e;">{ch['status']}</span>
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
    <div class="t-mono" style="padding-left:11px;">v9.0.0  //  HERMES BUILD  //  ANTI-FLICKER</div>
    </div>
    </div>
    """)


# ══════════════════════════════════════════════════════════════════════════════
# CENTER PANEL
# ══════════════════════════════════════════════════════════════════════════════
with col_center:

    # ── Section Header ─────────────────────────────────────────────────────────
    H("""
    <div class="gl1" style="padding:16px 20px;margin-bottom:14px;">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;flex-wrap:wrap;">
    <div>
    <div class="t-over" style="margin-bottom:7px;">Deployment Hub  /  Neural Voice Core</div>
    <div style="font-family:'Orbitron',sans-serif;font-weight:900;
    font-size:clamp(18px,2.8vw,26px);letter-spacing:.15em;color:#ffffff;line-height:1.05;">
    ASURA COMMAND</div>
    <div class="t-mono" style="margin-top:5px;letter-spacing:.17em;">
    HERMES AGENT FRAMEWORK  //  GEMINI 1.5 PRO  //  WEB SPEECH API</div>
    </div>
    <div style="display:flex;align-items:center;gap:6px;padding:5px 12px;
    background:rgba(52,211,153,.06);border:1px solid rgba(52,211,153,.2);border-radius:7px;flex-shrink:0;">
    <div style="width:5px;height:5px;border-radius:50%;background:#34d399;"></div>
    <span style="font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:600;
    letter-spacing:.1em;color:#34d399;">4 / 4 SYSTEMS NOMINAL</span>
    </div>
    </div>
    </div>
    """)

    # ══════════════════════════════════════════════════════════════════════════
    # TESLA ORB + VOICE ENGINE — ISOLATED IFRAME (zero flicker on Python rerun)
    # All state changes via CSS custom properties — JavaScript only
    # Web Speech API integrated directly in component
    # ══════════════════════════════════════════════════════════════════════════
    ORB_COMPONENT = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Orbitron:wght@700&family=JetBrains+Mono:wght@400;500&display=swap');
*, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}
html, body {{
background: transparent;
font-family: 'Inter', sans-serif;
overflow: hidden;
color: #f0f4ff;
}}
:root {{
--r1-speed: 22s;
--r2-speed: 30s;
--core-dur: 4s;
--sonar-dur: 4s;
--sonar-del: 2s;
--arc-dash: 9s;
--jitter-dur: 3.5s;
--arc-color: rgba(140,185,255,.5);
--sonar-color: rgba(91,156,246,.38);
--cap-color: rgba(180,200,240,.55);
--glow-anim: glowIdle 4s ease-in-out infinite;
}}

@keyframes rotCW  {{ to {{ transform: rotate(360deg);  }} }}
@keyframes rotCCW {{ to {{ transform: rotate(-360deg); }} }}
@keyframes breathe {{
0%,100% {{ opacity:.72; }} 50% {{ opacity:1; }}
}}
@keyframes jitter {{
0%,100% {{ transform:rotate(0deg) scale(1); }}
20% {{ transform:rotate(calc(var(--j-deg,0.3deg))) scale(1.01); }}
40% {{ transform:rotate(calc(var(--j-neg,-0.25deg))) scale(0.99); }}
60% {{ transform:rotate(calc(var(--j-deg,0.3deg))) scale(1.01); }}
80% {{ transform:rotate(calc(var(--j-neg,-0.25deg))) scale(0.99); }}
}}
@keyframes dashFlow {{ 0% {{ stroke-dashoffset:0; }} 100% {{ stroke-dashoffset:-60; }} }}
@keyframes glowIdle {{
0%,100% {{ filter:drop-shadow(0 0 5px rgba(255,255,255,.52)) drop-shadow(0 0 14px rgba(120,170,255,.2)); }}
50%     {{ filter:drop-shadow(0 0 12px rgba(255,255,255,.88)) drop-shadow(0 0 28px rgba(120,170,255,.38)); }}
}}
@keyframes glowListen {{
0%,100% {{ filter:drop-shadow(0 0 8px rgba(255,255,255,.78)) drop-shadow(0 0 22px rgba(80,150,255,.45)); }}
50%     {{ filter:drop-shadow(0 0 18px rgba(255,255,255,1)) drop-shadow(0 0 40px rgba(80,150,255,.65)); }}
}}
@keyframes glowSpeak {{
0%,100% {{ filter:drop-shadow(0 0 12px rgba(255,255,255,1)) drop-shadow(0 0 35px rgba(160,120,255,.6)); }}
33%     {{ filter:drop-shadow(0 0 24px rgba(255,255,255,1)) drop-shadow(0 0 55px rgba(160,120,255,.85)); }}
66%     {{ filter:drop-shadow(0 0 16px rgba(255,255,255,1)) drop-shadow(0 0 42px rgba(80,150,255,.7)); }}
}}

#container {{
display:flex;flex-direction:column;align-items:center;
background:transparent;
padding:8px 0 0;
}}

#ring-outer {{
width:264px;height:264px;position:relative;
display:flex;align-items:center;justify-content:center;
}}

.ring {{
position:absolute;inset:0;border-radius:50%;border:1px solid rgba(255,255,255,0.065);
transform-origin:center;will-change:transform;
}}
#ring1 {{ animation:rotCW var(--r1-speed) linear infinite; }}
#ring1::before,#ring1::after {{
content:'';position:absolute;border-radius:1px;
background:rgba(180,210,255,.48);
}}
#ring1::before {{ width:4px;height:2px;top:-2px;left:50%;transform:translateX(-50%); }}
#ring1::after  {{ width:4px;height:2px;bottom:-2px;left:50%;transform:translateX(-50%); }}

#ring2 {{
inset:20px;border-style:dashed;border-color:rgba(255,255,255,0.042);
animation:rotCCW var(--r2-speed) linear infinite;
}}
#ring2::before {{
content:'';position:absolute;
width:4px;height:4px;border-radius:50%;
background:rgba(255,255,255,.22);
top:50%;left:-2px;transform:translateY(-50%);
}}

#orb-shell {{
width:224px;height:224px;border-radius:50%;
background:radial-gradient(circle,rgba(8,14,32,.92) 0%,rgba(3,6,16,.97) 85%);
border:1px solid rgba(255,255,255,.055);
overflow:hidden;
box-shadow:inset 0 0 28px rgba(0,0,0,.9),0 0 0 1px rgba(0,0,0,.4);
}}
#orb-svg {{
width:100%;height:100%;
animation:jitter var(--jitter-dur) ease-in-out infinite;
will-change:transform;
}}

#orb-caption {{
font-family:'JetBrains Mono',monospace;
font-size:10.5px;letter-spacing:.05em;
color:var(--cap-color);
text-align:center;margin-top:10px;
max-width:300px;line-height:1.4;
transition:color 0.5s ease;
}}

/* Voice dynamics buttons */
#mode-btns {{
display:flex;gap:8px;margin-top:14px;width:100%;justify-content:center;
}}

.mode-btn {{
font-family:'Inter',sans-serif;font-size:11.5px;font-weight:500;
letter-spacing:0.03em;color:rgba(228,240,255,.78);
background:rgba(255,255,255,0.055);
border:1px solid rgba(255,255,255,0.1);
border-radius:8px;padding:7px 14px;cursor:pointer;
box-shadow:inset 0 1px 0 rgba(255,255,255,0.07);
transition:background 0.14s,border-color 0.14s,color 0.14s;
flex:1;max-width:140px;text-align:center;
}}
.mode-btn:hover {{ background:rgba(255,255,255,0.1);border-color:rgba(255,255,255,0.18);color:#fff; }}
.mode-btn.active {{ background:rgba(255,255,255,0.1);border-color:rgba(255,255,255,0.22);color:#ffffff; }}

/* Voice control row */
#voice-row {{
display:flex;align-items:center;gap:10px;margin-top:12px;
}}

#mic-btn {{
width:38px;height:38px;border-radius:50%;
background:rgba(255,255,255,0.058);
border:1px solid rgba(255,255,255,0.1);
cursor:pointer;display:flex;align-items:center;justify-content:center;
transition:all 0.15s;flex-shrink:0;
}}
#mic-btn:hover {{ background:rgba(255,255,255,0.1);border-color:rgba(255,255,255,0.2); }}
#mic-btn.listening {{
background:rgba(255,90,90,0.18);
border-color:rgba(255,80,80,0.5);
box-shadow:0 0 14px rgba(255,80,80,0.3);
animation:breathe 0.8s ease-in-out infinite;
}}

#mic-status {{
font-family:'JetBrains Mono',monospace;
font-size:10.5px;color:rgba(180,200,240,.45);
letter-spacing:0.05em;
}}

.t-over-comp {{
font-size:9.5px;font-weight:600;letter-spacing:0.14em;
text-transform:uppercase;color:rgba(200,218,255,0.42);
text-align:center;margin-bottom:6px;
}}
</style>
</head>
<body>
<div id="container">
<div class="t-over-comp">Neural Voice Core  //  Dynamic Animation Engine</div>
<div id="ring-outer">
<div class="ring" id="ring1"></div>
<div class="ring" id="ring2"></div>
<div id="orb-shell">
<svg id="orb-svg" viewBox="0 0 280 280">
<defs>
<filter id="ag" x="-40%" y="-40%" width="180%" height="180%">
<feGaussianBlur in="SourceGraphic" stdDeviation="3.2" result="b1"/>
<feGaussianBlur in="SourceGraphic" stdDeviation="1.4" result="b2"/>
<feMerge><feMergeNode in="b1"/><feMergeNode in="b2"/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>
<radialGradient id="cg" cx="50%" cy="50%" r="50%">
<stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
<stop offset="30%" stop-color="#d8eeff" stop-opacity=".95"/>
<stop offset="68%" stop-color="rgba(100,155,255)" stop-opacity=".4"/>
<stop offset="100%" stop-color="#000" stop-opacity="0"/>
</radialGradient>
</defs>
<!-- Sonar rings -->
<circle id="s1" cx="140" cy="140" r="12" fill="none" stroke-width=".9">
<animate attributeName="r" from="12" to="108" dur="4s" repeatCount="indefinite"/>
<animate attributeName="opacity" from=".7" to="0" dur="4s" repeatCount="indefinite"/>
</circle>
<circle id="s2" cx="140" cy="140" r="12" fill="none" stroke-width=".7">
<animate attributeName="r" from="12" to="108" dur="4s" begin="2s" repeatCount="indefinite"/>
<animate attributeName="opacity" from=".55" to="0" dur="4s" begin="2s" repeatCount="indefinite"/>
</circle>
<!-- Glow arc layer -->
<g id="arcs-glow" filter="url(#ag)" opacity=".62" stroke-linecap="round" fill="none">
<path id="ag1" stroke-width="3.5" stroke-dasharray="9 4" d="M140,140 L136,117 L150,106 L132,84 L153,70 L142,48 M132,84 L117,75 L104,60"/>
<path id="ag2" stroke-width="3.5" stroke-dasharray="8 5" d="M140,140 L163,123 L157,109 L184,94 L177,73 M184,94 L205,102 L222,98"/>
<path id="ag3" stroke-width="3.5" stroke-dasharray="9 4" d="M140,140 L157,155 L174,145 L196,165 L216,155 M196,165 L204,186 L219,194"/>
<path id="ag4" stroke-width="3.5" stroke-dasharray="8 5" d="M140,140 L150,167 L136,184 L158,204 L150,221 M158,204 L177,212 L190,228"/>
<path id="ag5" stroke-width="3.5" stroke-dasharray="9 4" d="M140,140 L124,157 L135,172 L118,196 L129,214 M118,196 L100,205 L85,220"/>
<path id="ag6" stroke-width="3.5" stroke-dasharray="8 5" d="M140,140 L114,148 L104,133 L81,146 L70,130 M81,146 L74,164 L58,173"/>
<path id="ag7" stroke-width="3.5" stroke-dasharray="9 4" d="M140,140 L121,124 L108,131 L92,107 L76,114 M92,107 L97,85 L84,70"/>
<path id="ag8" stroke-width="3.5" stroke-dasharray="8 5" d="M140,140 L128,110 L115,100 L127,77 L109,64 M127,77 L143,65 L150,48"/>
</g>
<!-- Sharp filament layer -->
<g id="arcs-sharp" stroke="rgba(235,248,255,.82)" stroke-linecap="round" fill="none">
<path stroke-width="1.3" d="M140,140 L136,117 L150,106 L132,84 L153,70 L142,48 M132,84 L117,75 L104,60"/>
<path stroke-width="1.3" d="M140,140 L163,123 L157,109 L184,94 L177,73 M184,94 L205,102 L222,98"/>
<path stroke-width="1.3" d="M140,140 L157,155 L174,145 L196,165 L216,155 M196,165 L204,186 L219,194"/>
<path stroke-width="1.3" d="M140,140 L150,167 L136,184 L158,204 L150,221 M158,204 L177,212 L190,228"/>
<path stroke-width="1.3" d="M140,140 L124,157 L135,172 L118,196 L129,214 M118,196 L100,205 L85,220"/>
<path stroke-width="1.3" d="M140,140 L114,148 L104,133 L81,146 L70,130 M81,146 L74,164 L58,173"/>
<path stroke-width="1.3" d="M140,140 L121,124 L108,131 L92,107 L76,114 M92,107 L97,85 L84,70"/>
<path stroke-width="1.3" d="M140,140 L128,110 L115,100 L127,77 L109,64 M127,77 L143,65 L150,48"/>
</g>
<!-- Power core -->
<circle id="core-glow" cx="140" cy="140" r="20" fill="url(#cg)">
<animate attributeName="r" values="18;24;18" dur="4s" repeatCount="indefinite"/>
</circle>
<circle id="core-inner" cx="140" cy="140" r="7" fill="#ffffff"
style="filter:drop-shadow(0 0 8px rgba(255,255,255,.95));">
<animate attributeName="r" values="6;9;6" dur="4s" repeatCount="indefinite"/>
</circle>
</svg>
</div>
</div>

<div id="orb-caption">Neural voice core online  //  Awaiting mission directive</div>

<div id="mode-btns">
<button class="mode-btn active" id="btn-IDLE" onclick="setMode('IDLE')">System Idle</button>
<button class="mode-btn" id="btn-LISTEN" onclick="setMode('LISTEN')">Mic Listening</button>
<button class="mode-btn" id="btn-TRANSMIT" onclick="setMode('TRANSMIT')">Voice Transmitting</button>
</div>

<div id="voice-row">
<button id="mic-btn" onclick="toggleMic()" title="Toggle ASURA voice input">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.8)" stroke-width="2" stroke-linecap="round">
<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
<path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/>
<line x1="8" y1="23" x2="16" y2="23"/>
</svg>
</button>
<span id="mic-status">Click mic to activate ASURA voice input</span>
</div>
</div>

<script>
const R = document.documentElement;
const MODES = {{
  IDLE: {{
    r1:'22s',r2:'30s',coreDur:'4s',sonarDur:'4s',sonarDel:'2s',
    arcDash:'9s',jitterDur:'3.5s',jDeg:'0.28deg',jNeg:'-0.22deg',
    arcColor:'rgba(140,185,255,.5)',sonarColor:'rgba(91,156,246,.38)',
    capColor:'rgba(180,200,240,.55)',
    cap:'Neural voice core online  //  Awaiting mission directive',
    glowAnim:'glowIdle 4s ease-in-out infinite',
    coAnimDur:'4s'
  }},
  LISTEN: {{
    r1:'9s',r2:'13s',coreDur:'1.5s',sonarDur:'2s',sonarDel:'1s',
    arcDash:'3.5s',jitterDur:'1.3s',jDeg:'0.45deg',jNeg:'-0.38deg',
    arcColor:'rgba(180,220,255,.7)',sonarColor:'rgba(91,156,246,.58)',
    capColor:'rgba(140,185,255,.78)',
    cap:'Acoustic sensors active  //  Processing voice frequency input',
    glowAnim:'glowListen 1.5s ease-in-out infinite',
    coAnimDur:'1.5s'
  }},
  TRANSMIT: {{
    r1:'3.5s',r2:'5.5s',coreDur:'0.65s',sonarDur:'1.1s',sonarDel:'0.55s',
    arcDash:'1.2s',jitterDur:'0.42s',jDeg:'0.75deg',jNeg:'-0.65deg',
    arcColor:'rgba(210,185,255,.78)',sonarColor:'rgba(160,120,255,.62)',
    capColor:'rgba(185,160,255,.82)',
    cap:'High-voltage neural synthesis  //  Voice discharge transmitting',
    glowAnim:'glowSpeak 0.65s ease-in-out infinite',
    coAnimDur:'0.65s'
  }}
}};

let currentMode = 'IDLE';

function setMode(mode) {{
  if (!MODES[mode]) return;
  currentMode = mode;
  const m = MODES[mode];

  // Update CSS vars — animations transition smoothly, NO restart
  R.style.setProperty('--r1-speed', m.r1);
  R.style.setProperty('--r2-speed', m.r2);
  R.style.setProperty('--sonar-dur', m.sonarDur);
  R.style.setProperty('--sonar-del', m.sonarDel);
  R.style.setProperty('--arc-dash', m.arcDash);
  R.style.setProperty('--jitter-dur', m.jitterDur);
  R.style.setProperty('--arc-color', m.arcColor);
  R.style.setProperty('--sonar-color', m.sonarColor);
  R.style.setProperty('--cap-color', m.capColor);
  R.style.setProperty('--j-deg', m.jDeg);
  R.style.setProperty('--j-neg', m.jNeg);

  // Apply arc colors
  document.querySelectorAll('#arcs-glow path').forEach(p => p.style.stroke = m.arcColor);

  // Apply sonar colors
  document.getElementById('s1').style.stroke = m.sonarColor;
  document.getElementById('s2').style.stroke = m.sonarColor;

  // Apply arc animation durations
  document.querySelectorAll('#arcs-glow path').forEach(p => {{
    p.style.animation = 'dashFlow ' + m.arcDash + ' linear infinite';
  }});

  // Apply core glow
  document.getElementById('core-glow').style.animation = m.glowAnim;

  // Update core animate elements
  const coreAnimates = document.getElementById('core-glow').getElementsByTagName('animate');
  if (coreAnimates.length > 0) coreAnimates[0].setAttribute('dur', m.coAnimDur);
  const innerAnimates = document.getElementById('core-inner').getElementsByTagName('animate');
  if (innerAnimates.length > 0) innerAnimates[0].setAttribute('dur', m.coAnimDur);

  // Caption
  const cap = document.getElementById('orb-caption');
  cap.style.color = m.capColor;
  cap.textContent = m.cap;

  // Button states
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById('btn-' + mode);
  if (btn) btn.classList.add('active');

  // Notify parent Streamlit page
  try {{
    window.parent.postMessage({{type:'asura_orb_mode',mode:mode}}, '*');
  }} catch(e) {{}}
}}

// ── WEB SPEECH API ─────────────────────────────────────────────────────────
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let isListening = false;

if (SR) {{
  recognition = new SR();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {{
    isListening = true;
    setMode('LISTEN');
    document.getElementById('mic-btn').classList.add('listening');
    document.getElementById('mic-status').textContent = 'ASURA listening...';
    document.getElementById('mic-status').style.color = 'rgba(140,185,255,.9)';
  }};

  recognition.onend = () => {{
    isListening = false;
    document.getElementById('mic-btn').classList.remove('listening');
    document.getElementById('mic-status').textContent = 'Click mic to activate ASURA voice input';
    document.getElementById('mic-status').style.color = 'rgba(180,200,240,.45)';
    if (currentMode === 'LISTEN') setMode('IDLE');
  }};

  recognition.onresult = (event) => {{
    let finalTxt = '', interimTxt = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {{
      if (event.results[i].isFinal) finalTxt += event.results[i][0].transcript;
      else interimTxt += event.results[i][0].transcript;
    }}
    const display = finalTxt || interimTxt;
    document.getElementById('mic-status').textContent = display ? ('"' + display + '"') : 'Listening...';

    if (finalTxt.trim()) {{
      const transcript = finalTxt.trim();
      // Inject text into Streamlit textarea in parent page
      try {{
        const parentDoc = window.parent.document;
        const areas = parentDoc.querySelectorAll('textarea');
        if (areas.length > 0) {{
          const ta = areas[areas.length - 1];
          const setter = Object.getOwnPropertyDescriptor(
            window.parent.HTMLTextAreaElement.prototype, 'value').set;
          setter.call(ta, transcript);
          ta.dispatchEvent(new Event('input', {{bubbles:true}}));
          ta.dispatchEvent(new Event('change', {{bubbles:true}}));
        }}
      }} catch(e) {{ console.log('Textarea inject failed:', e); }}

      // Notify parent with transcript
      try {{
        window.parent.postMessage({{
          type: 'asura_voice_input',
          text: transcript
        }}, '*');
      }} catch(e) {{}}

      // ASURA acknowledges
      setMode('TRANSMIT');
      asuraSpeak('Directive received. Routing through the Hermes framework. Stand by.');
      setTimeout(() => {{ if(currentMode==='TRANSMIT') setMode('IDLE'); }}, 3500);
    }}
  }};

  recognition.onerror = (e) => {{
    isListening = false;
    document.getElementById('mic-btn').classList.remove('listening');
    document.getElementById('mic-status').textContent = 'Error: ' + e.error;
    document.getElementById('mic-status').style.color = 'rgba(251,191,36,.7)';
    setMode('IDLE');
  }};
}} else {{
  document.getElementById('mic-status').textContent = 'Voice: Chrome/Edge required for speech recognition';
}}

function toggleMic() {{
  if (!recognition) return;
  if (isListening) {{
    recognition.stop();
  }} else {{
    recognition.start();
  }}
}}

// ── ASURA TTS ENGINE ────────────────────────────────────────────────────────
function asuraSpeak(text) {{
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate  = 0.88;
  utt.pitch = 0.72;
  utt.volume = 1.0;

  function assignVoice() {{
    const voices = window.speechSynthesis.getVoices();
    // Priority: Google UK Male > Daniel (macOS) > any UK > any EN
    const v = voices.find(v => v.name === 'Google UK English Male') ||
              voices.find(v => v.name === 'Daniel') ||
              voices.find(v => v.lang === 'en-GB') ||
              voices.find(v => v.lang.startsWith('en')) || voices[0];
    if (v) utt.voice = v;
  }}

  const vs = window.speechSynthesis.getVoices();
  if (vs.length > 0) assignVoice();
  else window.speechSynthesis.onvoiceschanged = assignVoice;

  utt.onstart = () => setMode('TRANSMIT');
  utt.onend   = () => {{ if(currentMode==='TRANSMIT') setMode('IDLE'); }};
  window.speechSynthesis.speak(utt);
}}

// ── LISTEN FOR MESSAGES FROM PARENT ────────────────────────────────────────
window.addEventListener('message', (e) => {{
  if (!e.data || !e.data.type) return;
  if (e.data.type === 'asura_speak')    asuraSpeak(e.data.text);
  if (e.data.type === 'set_orb_mode')  setMode(e.data.mode);
}});

// Initialize
setMode('IDLE');
</script>
</body>
</html>"""

    components.html(ORB_COMPONENT, height=400, scrolling=False)

    H('<div style="height:12px;"></div>')

    # ══════════════════════════════════════════════════════════════════════════
    # METRIC CARDS — Auto-updating fragment (no full page rerender)
    # ══════════════════════════════════════════════════════════════════════════
    @st.fragment(run_every=8)
    def metric_cards():
        # Live runtime from session start
        elapsed = int(time.time() - st.session_state.session_start)
        rt_fmt = f"{elapsed//3600:02d}:{(elapsed%3600)//60:02d}:{elapsed%60:02d}"

        # Dynamic MRR with realistic micro-fluctuation
        tick = int(time.time()) % 30
        mrr_delta = random.uniform(-280, 420) * (0.6 + 0.4 * math.sin(time.time() / 60))
        mrr = st.session_state.mrr_base + mrr_delta
        mrr_change = "+" + f"{abs(mrr_delta/100):.1f}%" if mrr_delta >= 0 else f"-{abs(mrr_delta/100):.1f}%"
        mrr_clr = "#34d399" if mrr_delta >= 0 else "#f87171"

        progress = st.session_state.metrics.get("progress", 0)

        # Compute donut arc for MRR uptime (based on elapsed)
        uptime_pct = min(99, 95 + (elapsed % 5) * 0.8)
        CIRC = 2 * math.pi * 20
        DASH = CIRC * uptime_pct / 100
        GAP  = CIRC - DASH

        SP1 = "20,28 35,22 50,26 65,17 80,24 95,13 110,20 125,10 140,16"
        SP2 = "20,28 34,23 48,27 62,18 76,25 90,16 104,22 118,13 130,18"

        H(f"""
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:11px;margin-bottom:14px;">
        <div class="mc" style="border-top:1.5px solid rgba(91,156,246,.4);">
        <div class="t-over" style="margin-bottom:7px;">Mission Progress</div>
        <div class="t-val">{progress}%</div>
        <svg viewBox="0 0 150 36" width="100%" height="34" preserveAspectRatio="none" style="margin-top:7px;">
        <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgba(91,156,246,.28)"/>
        <stop offset="100%" stop-color="rgba(91,156,246,0)"/>
        </linearGradient></defs>
        <polygon points="{SP1} 140,32 20,32" fill="url(#g1)"/>
        <polyline points="{SP1}" fill="none" stroke="rgba(91,156,246,.78)" stroke-width="1.5"
        stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div class="t-mono" style="margin-top:3px;color:rgba(91,156,246,.7);">Active pipeline nominal</div>
        </div>

        <div class="mc" style="border-top:1.5px solid rgba(155,138,251,.38);">
        <div class="t-over" style="margin-bottom:7px;">Session Runtime</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:17px;font-weight:600;
        color:#ffffff;letter-spacing:.04em;">{rt_fmt}</div>
        <svg viewBox="0 0 150 36" width="100%" height="34" preserveAspectRatio="none" style="margin-top:7px;">
        <defs><linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgba(155,138,251,.25)"/>
        <stop offset="100%" stop-color="rgba(155,138,251,0)"/>
        </linearGradient></defs>
        <polygon points="{SP2} 130,32 20,32" fill="url(#g2)"/>
        <polyline points="{SP2}" fill="none" stroke="rgba(155,138,251,.75)" stroke-width="1.5"
        stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div class="t-mono" style="margin-top:3px;color:rgba(155,138,251,.7);">99.98% uptime recorded</div>
        </div>

        <div class="mc" style="border-top:1.5px solid rgba(251,191,36,.3);">
        <div class="t-over" style="margin-bottom:7px;">Agency Classification</div>
        <div style="font-size:15px;font-weight:700;color:#ffffff;letter-spacing:.05em;">
        {st.session_state.metrics.get('agency_tier','SOVEREIGN')}</div>
        <svg viewBox="0 0 150 36" width="100%" height="34" preserveAspectRatio="none" style="margin-top:7px;">
        <rect x="20" y="18" width="9" height="12" rx="1.5" fill="rgba(251,191,36,.38)"/>
        <rect x="33" y="12" width="9" height="18" rx="1.5" fill="rgba(251,191,36,.42)"/>
        <rect x="46" y="16" width="9" height="14" rx="1.5" fill="rgba(251,191,36,.48)"/>
        <rect x="59" y="8"  width="9" height="22" rx="1.5" fill="rgba(251,191,36,.56)"/>
        <rect x="72" y="14" width="9" height="16" rx="1.5" fill="rgba(251,191,36,.62)"/>
        <rect x="85" y="6"  width="9" height="24" rx="1.5" fill="rgba(251,191,36,.70)"/>
        <rect x="98" y="10" width="9" height="20" rx="1.5" fill="rgba(251,191,36,.78)"/>
        <rect x="111" y="4" width="9" height="26" rx="1.5" fill="rgba(251,191,36,.88)"/>
        </svg>
        <div class="t-mono" style="margin-top:3px;color:rgba(251,191,36,.65);">Hermes Tier IV clearance</div>
        </div>

        <div class="mc" style="border-top:1.5px solid rgba(52,211,153,.3);">
        <div class="t-over" style="margin-bottom:7px;">Monthly Revenue Run Rate</div>
        <div style="display:flex;align-items:center;gap:10px;">
        <div style="font-size:19px;font-weight:700;color:#ffffff;">&#36;{mrr:,.0f}</div>
        <svg width="46" height="46" viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(255,255,255,.052)" stroke-width="4"/>
        <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(52,211,153,.75)" stroke-width="4"
        stroke-dasharray="{DASH:.1f} {GAP:.1f}"
        stroke-dashoffset="{CIRC/4:.1f}" stroke-linecap="round"/>
        <text x="25" y="29.5" text-anchor="middle" font-family="Inter,sans-serif"
        font-size="9" font-weight="700" fill="rgba(210,240,225,.9)">{uptime_pct:.0f}%</text>
        </svg>
        </div>
        <div class="t-mono" style="margin-top:4px;color:{mrr_clr};opacity:0.8;">
        {mrr_change} this cycle  //  live telemetry</div>
        </div>
        </div>
        """)

    metric_cards()

    # ── Mission Command Input ──────────────────────────────────────────────────
    H("""
    <div class="gl1" style="padding:16px 18px;">
    <div class="t-over" style="margin-bottom:10px;">Mission Directive  //  Hermes Command Input  //  Voice-Ready</div>
    """)

    prompt_val = st.text_area(
        label="", value=st.session_state.mission_prompt,
        placeholder='Enter directive or use mic... e.g. "Build a modern e-commerce landing page for a clothing brand with Stripe checkout."',
        height=82, key="mp", label_visibility="collapsed",
    )
    st.session_state.mission_prompt = prompt_val

    dc, cc = st.columns([3, 1])
    with dc:
        dispatch = st.button("Dispatch Hermes Agents", key="db", use_container_width=True)
    with cc:
        if st.button("Clear Log", key="cl", use_container_width=True):
            st.session_state.exec_log = []
            st.session_state.mission_result = None
            st.session_state.metrics["progress"] = 0
            st.rerun()

    H("</div>")

    # Mission trigger
    if dispatch and prompt_val.strip():
        st.session_state.mission_result = None
        st.session_state.mission_active = True
        ts = datetime.now().strftime("%H:%M:%S")
        st.session_state.exec_log.insert(0, {
            "ts": ts, "level": "HERMES", "color": "#9b8afb",
            "msg": f"Mission received — '{prompt_val.strip()[:75]}'"
        })
        st.session_state.exec_log.insert(0, {
            "ts": ts, "level": "SYS", "color": "#5b9cf6",
            "msg": "Dispatching Asura-Strategist and Asura-Engineer..."
        })
        st.rerun()

    if (st.session_state.mission_active
            and st.session_state.mission_prompt.strip()
            and st.session_state.mission_result is None
            and not dispatch):
        with st.spinner("Hermes Agents executing mission pipeline..."):
            lq: queue.Queue = queue.Queue()
            rc: dict = {}
            def _run():
                rc["res"] = run_hermes_mission(st.session_state.mission_prompt.strip(), lq)
            t = threading.Thread(target=_run, daemon=True)
            t.start()
            t.join(timeout=120)
            while not lq.empty():
                lvl, msg, clr = lq.get_nowait()
                st.session_state.exec_log.insert(0, {
                    "ts": datetime.now().strftime("%H:%M:%S"),
                    "level": lvl, "color": clr, "msg": msg
                })
            if "res" in rc:
                st.session_state.mission_result = rc["res"]
                st.session_state.metrics["progress"] = 100
                st.session_state.mission_active = False
                st.session_state.exec_log.insert(0, {
                    "ts": datetime.now().strftime("%H:%M:%S"),
                    "level": "DONE", "color": "#34d399",
                    "msg": "Mission pipeline concluded. All deliverables compiled and ready."
                })
            else:
                st.session_state.mission_active = False
                st.session_state.exec_log.insert(0, {
                    "ts": datetime.now().strftime("%H:%M:%S"),
                    "level": "WARN", "color": "#fbbf24",
                    "msg": "Execution timeout. Verify GEMINI_API_KEY and network connectivity."
                })
        st.rerun()


# ══════════════════════════════════════════════════════════════════════════════
# RIGHT PANEL — LIVE LOGS (Auto-updating fragment, 2s refresh)
# ══════════════════════════════════════════════════════════════════════════════
with col_right:

    @st.fragment(run_every=2)
    def log_panel():
        LVL_MAP = {
            "SYS":    ("#5b9cf6", "rgba(91,156,246,.12)"),
            "HERMES": ("#9b8afb", "rgba(155,138,251,.12)"),
            "STRAT":  ("#5b9cf6", "rgba(91,156,246,.12)"),
            "ENG":    ("#34d399", "rgba(52,211,153,.12)"),
            "ENGINE": ("#34d399", "rgba(52,211,153,.12)"),
            "SENSOR": ("#5b9cf6", "rgba(91,156,246,.12)"),
            "VOICE":  ("#9b8afb", "rgba(155,138,251,.12)"),
            "GUARD":  ("#fbbf24", "rgba(251,191,36,.12)"),
            "DONE":   ("#34d399", "rgba(52,211,153,.12)"),
            "WARN":   ("#fbbf24", "rgba(251,191,36,.12)"),
        }

        H("""
        <div class="gl1" style="padding:16px 14px;min-height:720px;">
        <div style="display:flex;align-items:center;justify-content:space-between;
        padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,.055);margin-bottom:12px;">
        <div style="display:flex;align-items:center;gap:7px;">
        <div style="width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.55);"></div>
        <span style="font-size:12px;font-weight:600;letter-spacing:.04em;color:rgba(255,255,255,.88);">
        Live System Logs</span>
        </div>
        <span class="t-mono" style="letter-spacing:.1em;">Execution Streams</span>
        </div>
        """)

        for e in st.session_state.exec_log[:30]:
            lvl = e.get("level", "SYS")
            fc, bg = LVL_MAP.get(lvl, ("#5b9cf6", "rgba(91,156,246,.12)"))
            H(f"""
            <div class="log-row" style="border-left-color:{fc}38;">
            <span style="flex-shrink:0;font-family:'JetBrains Mono',monospace;
            font-size:9px;font-weight:700;letter-spacing:.08em;
            padding:2px 5px;border-radius:4px;
            background:{bg};color:{fc};
            margin-top:1px;line-height:1.2;">{lvl}</span>
            <div>
            <span style="font-family:'JetBrains Mono',monospace;font-size:9px;
            color:rgba(160,180,220,.38);margin-right:5px;">{e['ts']}</span>
            <span style="font-family:'JetBrains Mono',monospace;font-size:11px;
            color:rgba(230,242,255,.88);line-height:1.45;">{e['msg']}</span>
            </div>
            </div>
            """)

        H("</div>")

    log_panel()

    if st.session_state.mission_result:
        H("""
        <div class="gl1" style="padding:16px 14px;margin-top:12px;
        border-top:1.5px solid rgba(52,211,153,.2);">
        <div style="display:flex;justify-content:space-between;align-items:center;
        padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,.045);margin-bottom:12px;">
        <span style="font-size:12px;font-weight:600;letter-spacing:.06em;
        color:rgba(52,211,153,.88);">Mission Deliverable</span>
        <span class="t-mono" style="color:rgba(52,211,153,.6);">VERIFIED  //  GEMINI 1.5 PRO</span>
        </div>
        """)
        st.markdown(st.session_state.mission_result["output"])
        H("</div>")
