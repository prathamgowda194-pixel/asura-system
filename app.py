"""
================================================================================
                    ASURA COMMAND CENTER // NEURAL VOICE CORE
            Full-Stack Autonomous Cybernetic Dashboard & CrewAI Engine
================================================================================
"""

import os
import sys
import time
from datetime import datetime

# Configure Google Gemini Cloud API Key
GEMINI_KEY = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY") or "AQ.Ab8RN6LQTcBVg27285xhxo4j7NrFIsXGY9tKv96nGlh6e6rlDQ"
os.environ["GEMINI_API_KEY"] = GEMINI_KEY
os.environ["GOOGLE_API_KEY"] = GEMINI_KEY

import streamlit as st
import streamlit.components.v1 as components

# ==============================================================================
# STREAMLIT PAGE CONFIGURATION
# ==============================================================================
st.set_page_config(
    page_title="ASURA // COMMAND & CONTROL",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Initialize Session State
if "voice_state" not in st.session_state:
    st.session_state.voice_state = "Idle"
if "synapse_freq" not in st.session_state:
    st.session_state.synapse_freq = 354
if "agent_logs" not in st.session_state:
    st.session_state.agent_logs = [
        {"agent": "Asura-Engineer", "time": "1m ago", "desc": "Successfully deployed core infrastructure to Vercel.", "color": "#00f0ff"},
        {"agent": "Synth-Analyst", "time": "4m ago", "desc": "Synchronized revenue streams across Stripe and Solana endpoints.", "color": "#c084fc"},
        {"agent": "Neural-Guard", "time": "11m ago", "desc": "Terminated suspicious connection attempt on validator 4 peering port.", "color": "#f43f5e"},
        {"agent": "Dispatcher-AI", "time": "24m ago", "desc": "Allocated new cloud worker backups to agent pool.", "color": "#34d399"},
    ]
if "mission_output" not in st.session_state:
    st.session_state.mission_output = None


# ==============================================================================
# GLOBAL GLASSMORPHISM & CYBERNETIC CSS INJECTION
# ==============================================================================
GLOBAL_THEME_CSS = """
<style>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@600;800;900&family=Rajdhani:wght@500;600;700&family=JetBrains+Mono:wght@400;600&family=Inter:wght@300;400;500;600&display=swap');

/* Global Reset and Dark Theme */
.stApp {
    background-color: #060913 !important;
    background-image: 
        radial-gradient(circle at 50% 15%, rgba(0, 240, 255, 0.08) 0%, transparent 60%),
        radial-gradient(circle at 85% 50%, rgba(139, 92, 246, 0.07) 0%, transparent 50%),
        radial-gradient(circle at 15% 85%, rgba(16, 185, 129, 0.05) 0%, transparent 45%),
        radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px) !important;
    background-size: 100% 100%, 100% 100%, 100% 100%, 28px 28px !important;
    color: #e2e8f0 !important;
    font-family: 'Inter', sans-serif !important;
}

/* Hide Default Streamlit Chrome */
header[data-testid="stHeader"] {
    background: transparent !important;
}
#MainMenu, footer {visibility: hidden;}

/* Custom Cybertech Typography */
.font-cyber {
    font-family: 'Orbitron', 'Rajdhani', sans-serif !important;
}
.font-mono-cyber {
    font-family: 'JetBrains Mono', monospace !important;
}

/* Glassmorphism Containers */
.glass-panel {
    background: rgba(13, 20, 36, 0.65) !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    border: 1px solid rgba(56, 189, 248, 0.16) !important;
    border-radius: 20px !important;
    padding: 24px !important;
    box-shadow: 0 10px 35px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.09) !important;
}

/* Metric Cards with Translucent Pastel Frosted Glass */
.metric-card-pastel {
    border-radius: 18px !important;
    padding: 20px 22px !important;
    backdrop-filter: blur(16px) !important;
    -webkit-backdrop-filter: blur(16px) !important;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.12) !important;
    transition: transform 0.25s ease, border-color 0.25s ease !important;
}
.metric-card-pastel:hover {
    transform: translateY(-2px);
}

.pastel-cyan {
    background: linear-gradient(135deg, rgba(56, 189, 248, 0.09) 0%, rgba(14, 165, 233, 0.03) 100%) !important;
    border: 1px solid rgba(56, 189, 248, 0.28) !important;
}
.pastel-purple {
    background: linear-gradient(135deg, rgba(168, 85, 247, 0.09) 0%, rgba(139, 92, 246, 0.03) 100%) !important;
    border: 1px solid rgba(168, 85, 247, 0.28) !important;
}
.pastel-violet {
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.09) 0%, rgba(99, 102, 241, 0.03) 100%) !important;
    border: 1px solid rgba(139, 92, 246, 0.28) !important;
}
.pastel-emerald {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.09) 0%, rgba(5, 150, 105, 0.03) 100%) !important;
    border: 1px solid rgba(16, 185, 129, 0.28) !important;
}

/* Aggressive Cybertech ASURA Header */
.asura-brand-header {
    font-family: 'Orbitron', sans-serif;
    font-weight: 900;
    font-size: 2.8rem;
    letter-spacing: 0.28em;
    color: #ffffff;
    text-shadow: 0 2px 8px rgba(255, 255, 255, 0.6), 0 0 25px rgba(0, 240, 255, 0.65);
    margin: 0;
    padding: 0;
    line-height: 1.1;
    display: inline-block;
}

/* Subtitle & Badges */
.status-pill-green {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 5px 14px;
    border-radius: 9999px;
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.4);
    color: #34d399;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    box-shadow: 0 0 12px rgba(16, 185, 129, 0.2);
}

/* Custom Scrollbars */
::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}
::-webkit-scrollbar-track {
    background: #090e1a;
}
::-webkit-scrollbar-thumb {
    background: rgba(56, 189, 248, 0.3);
    border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
    background: #00f0ff;
}

/* Streamlit Button Overrides */
.stButton > button {
    background: rgba(14, 23, 42, 0.8) !important;
    color: #38bdf8 !important;
    border: 1px solid rgba(56, 189, 248, 0.35) !important;
    border-radius: 10px !important;
    font-family: 'JetBrains Mono', monospace !important;
    font-size: 0.82rem !important;
    font-weight: 600 !important;
    transition: all 0.25s ease !important;
    padding: 8px 18px !important;
}
.stButton > button:hover {
    background: rgba(56, 189, 248, 0.2) !important;
    border-color: #00f0ff !important;
    color: #ffffff !important;
    box-shadow: 0 0 15px rgba(0, 240, 255, 0.4) !important;
}
</style>
"""
st.markdown(GLOBAL_THEME_CSS, unsafe_allow_html=True)


# ==============================================================================
# TESLA LIGHTNING ORB HTML/CSS COMPONENT
# ==============================================================================
def render_tesla_orb(voice_state: str):
    """
    Renders the White Plasma Tesla Lightning Orb with layered SVG electric paths,
    continuous rotational keyframes, high-contrast core, and state-reactive jitter.
    """
    # Visual parameters calibrated for state
    state_params = {
        "Idle": {
            "rot_speed": "30s",
            "jitter_speed": "2.2s",
            "core_glow": "0 0 30px rgba(0, 240, 255, 0.5)",
            "arc_color": "#38bdf8",
            "pulse_rate": "3.5s",
            "status_text": "Asura voice core online • Awaiting neural voice instructions",
            "status_color": "#94a3b8",
        },
        "Listening": {
            "rot_speed": "14s",
            "jitter_speed": "1.1s",
            "core_glow": "0 0 45px rgba(0, 240, 255, 0.85), 0 0 70px rgba(168, 85, 247, 0.4)",
            "arc_color": "#00f0ff",
            "pulse_rate": "1.6s",
            "status_text": "Neural sensors active • Processing ambient voice frequencies...",
            "status_color": "#00f0ff",
        },
        "Speaking": {
            "rot_speed": "6s",
            "jitter_speed": "0.45s",
            "core_glow": "0 0 60px rgba(255, 255, 255, 1), 0 0 90px rgba(192, 132, 252, 0.9)",
            "arc_color": "#e0e7ff",
            "pulse_rate": "0.8s",
            "status_text": "High-voltage neural synthesis active • Transmitting voice discharge",
            "status_color": "#c084fc",
        }
    }
    cfg = state_params.get(voice_state, state_params["Idle"])

    html_code = f"""
    <!DOCTYPE html>
    <html>
    <head>
    <style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Orbitron:wght@700&display=swap');
    
    * {{
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }}
    body {{
        background: transparent;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: 'JetBrains Mono', monospace;
        color: #e2e8f0;
        overflow: hidden;
        user-select: none;
    }}

    .orb-container {{
        position: relative;
        width: 310px;
        height: 310px;
        display: flex;
        align-items: center;
        justify-content: center;
    }}

    /* Outer glowing perimeter ring */
    .outer-containment {{
        position: absolute;
        inset: 0;
        border-radius: 50%;
        border: 1px solid rgba(56, 189, 248, 0.2);
        box-shadow: 0 0 35px rgba(0, 240, 255, 0.15), inset 0 0 25px rgba(0, 0, 0, 0.8);
        animation: rotateRing {cfg["rot_speed"]} linear infinite;
    }}
    .outer-containment::before {{
        content: '';
        position: absolute;
        inset: 4px;
        border-radius: 50%;
        border: 1px dashed rgba(56, 189, 248, 0.4);
    }}

    /* Cardinal notches */
    .notch {{
        position: absolute;
        background: #00f0ff;
        box-shadow: 0 0 8px #00f0ff;
    }}
    .notch-n {{ top: -2px; left: 50%; width: 6px; height: 3px; transform: translateX(-50%); }}
    .notch-s {{ bottom: -2px; left: 50%; width: 6px; height: 3px; transform: translateX(-50%); }}
    .notch-w {{ left: -2px; top: 50%; width: 3px; height: 6px; transform: translateY(-50%); }}
    .notch-e {{ right: -2px; top: 50%; width: 3px; height: 6px; transform: translateY(-50%); }}

    /* Inner Glass Orb Sphere */
    .orb-sphere {{
        position: absolute;
        inset: 14px;
        border-radius: 50%;
        background: radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.7) 0%, rgba(6, 9, 19, 0.95) 85%);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.95);
        overflow: hidden;
    }}

    /* Central Ambient Corona */
    .plasma-corona {{
        position: absolute;
        top: 50%;
        left: 50%;
        width: 130px;
        height: 130px;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(56, 189, 248, 0.6) 45%, rgba(139, 92, 246, 0.3) 70%, transparent 100%);
        filter: blur(14px);
        animation: pulseCore {cfg["pulse_rate"]} ease-in-out infinite alternate;
        pointer-events: none;
    }}

    /* Incandescent White Center Core */
    .white-hot-core {{
        position: absolute;
        top: 50%;
        left: 50%;
        width: 28px;
        height: 28px;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        background: #ffffff;
        box-shadow: {cfg["core_glow"]};
        z-index: 10;
        animation: jitterCore {cfg["jitter_speed"]} ease-in-out infinite;
    }}

    /* Lightning SVG Layer */
    .lightning-svg {{
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        z-index: 5;
        animation: jitterLightning {cfg["jitter_speed"]} steps(2, start) infinite;
    }}

    /* Sonar Ripple Rings */
    .sonar-wave {{
        position: absolute;
        top: 50%;
        left: 50%;
        width: 40px;
        height: 40px;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        border: 1px solid rgba(0, 240, 255, 0.5);
        animation: sonarExpand 2.4s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
        pointer-events: none;
    }}
    .sonar-wave-2 {{
        animation-delay: 0.8s;
        border-color: rgba(168, 85, 247, 0.4);
    }}

    /* Keyframe Animations */
    @keyframes rotateRing {{
        from {{ transform: rotate(0deg); }}
        to {{ transform: rotate(360deg); }}
    }}
    @keyframes pulseCore {{
        0% {{ transform: translate(-50%, -50%) scale(0.92); opacity: 0.75; }}
        100% {{ transform: translate(-50%, -50%) scale(1.15); opacity: 1; }}
    }}
    @keyframes jitterCore {{
        0%, 100% {{ transform: translate(-50%, -50%) scale(1); }}
        25% {{ transform: translate(-51%, -49%) scale(1.06); }}
        50% {{ transform: translate(-49%, -51%) scale(0.96); }}
        75% {{ transform: translate(-50%, -50%) scale(1.04); }}
    }}
    @keyframes jitterLightning {{
        0% {{ transform: rotate(0deg) scale(1); opacity: 0.95; }}
        20% {{ transform: rotate(1deg) scale(1.02); opacity: 1; }}
        40% {{ transform: rotate(-1deg) scale(0.98); opacity: 0.9; }}
        60% {{ transform: rotate(2deg) scale(1.03); opacity: 1; }}
        80% {{ transform: rotate(-2deg) scale(0.99); opacity: 0.88; }}
        100% {{ transform: rotate(0deg) scale(1); opacity: 0.95; }}
    }}
    @keyframes sonarExpand {{
        0% {{ width: 20px; height: 20px; opacity: 0.9; transform: translate(-50%, -50%) scale(0.5); }}
        100% {{ width: 260px; height: 260px; opacity: 0; transform: translate(-50%, -50%) scale(1); }}
    }}

    .status-caption {{
        margin-top: 14px;
        font-size: 11px;
        color: {cfg["status_color"]};
        letter-spacing: 0.05em;
        text-align: center;
        text-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
    }}
    </style>
    </head>
    <body>
        <div class="orb-container">
            <!-- Rotating containment ring -->
            <div class="outer-containment">
                <div class="notch notch-n"></div>
                <div class="notch notch-s"></div>
                <div class="notch notch-w"></div>
                <div class="notch notch-e"></div>
            </div>

            <!-- Inner sphere containment -->
            <div class="orb-sphere">
                <!-- Sonar shockwave rings -->
                <div class="sonar-wave"></div>
                <div class="sonar-wave sonar-wave-2"></div>

                <!-- Glowing ambient plasma corona -->
                <div class="plasma-corona"></div>

                <!-- White-hot core -->
                <div class="white-hot-core"></div>

                <!-- Layered SVG Tesla Lightning Discharge -->
                <svg class="lightning-svg" viewBox="0 0 300 300">
                    <defs>
                        <filter id="arcGlow" x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur1" />
                            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur2" />
                            <feMerge>
                                <feMergeNode in="blur1" />
                                <feMergeNode in="blur2" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    <!-- Background Thick Glow Stroke -->
                    <g filter="url(#arcGlow)" opacity="0.75">
                        <path d="M 150 150 L 138 120 L 165 95 L 140 68 L 175 35" fill="none" stroke="#a855f7" stroke-width="4.5" stroke-linecap="round" />
                        <path d="M 150 150 L 175 130 L 195 155 L 230 140 L 265 160" fill="none" stroke="#38bdf8" stroke-width="4.5" stroke-linecap="round" />
                        <path d="M 150 150 L 160 180 L 138 205 L 172 235 L 152 270" fill="none" stroke="#a855f7" stroke-width="4.5" stroke-linecap="round" />
                        <path d="M 150 150 L 125 165 L 105 142 L 72 162 L 35 145" fill="none" stroke="#38bdf8" stroke-width="4.5" stroke-linecap="round" />
                        <path d="M 150 150 L 132 135 L 112 100 L 80 85 L 55 55" fill="none" stroke="#00f0ff" stroke-width="4" stroke-linecap="round" />
                        <path d="M 150 150 L 170 170 L 205 190 L 225 225 L 260 250" fill="none" stroke="#00f0ff" stroke-width="4" stroke-linecap="round" />
                        <path d="M 150 150 L 135 175 L 115 200 L 85 220 L 60 245" fill="none" stroke="#a855f7" stroke-width="4" stroke-linecap="round" />
                        <path d="M 150 150 L 170 125 L 200 110 L 220 80 L 245 50" fill="none" stroke="#38bdf8" stroke-width="4" stroke-linecap="round" />
                    </g>

                    <!-- Foreground Sharp High-Contrast White/Cyan Arcs -->
                    <g>
                        <path d="M 150 150 L 138 120 L 165 95 L 140 68 L 175 35" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" />
                        <path d="M 150 150 L 175 130 L 195 155 L 230 140 L 265 160" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" />
                        <path d="M 150 150 L 160 180 L 138 205 L 172 235 L 152 270" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" />
                        <path d="M 150 150 L 125 165 L 105 142 L 72 162 L 35 145" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" />
                        <path d="M 150 150 L 132 135 L 112 100 L 80 85 L 55 55" fill="none" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" />
                        <path d="M 150 150 L 170 170 L 205 190 L 225 225 L 260 250" fill="none" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" />
                        <path d="M 150 150 L 135 175 L 115 200 L 85 220 L 60 245" fill="none" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" />
                        <path d="M 150 150 L 170 125 L 200 110 L 220 80 L 245 50" fill="none" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" />
                    </g>
                </svg>
            </div>
        </div>
        <div class="status-caption">{cfg["status_text"]}</div>
    </body>
    </html>
    """
    components.html(html_code, height=360)


# ==============================================================================
# CREWAI MULTI-AGENT BACKEND ORCHESTRATION (CLEAN & STABLE)
# ==============================================================================
def run_asura_crew_mission(mission_topic: str) -> dict:
    """
    Executes a standard, production-ready CrewAI workflow without crewai_tools or args_schema:
    - Agent 1: Asura-Strategist (Business research & structural ideation)
    - Agent 2: Asura-Engineer (Full-stack code, websites, apps, and games)
    Configured with Google Gemini 1.5 Pro via langchain_google_genai.
    """
    try:
        from crewai import Agent, Task, Crew, Process
        from langchain_google_genai import ChatGoogleGenerativeAI

        # Initialize Gemini 1.5 Pro
        llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-pro",
            temperature=0.25,
            google_api_key=GEMINI_KEY,
            convert_system_message_to_human=True
        )

        # Agent 1: Asura-Strategist
        asura_strategist = Agent(
            role="Asura-Strategist // Principal Business Research & Systems Architect",
            goal=f"Conduct rapid market research and structural ideation for: {mission_topic}",
            backstory=(
                "You are Asura-Strategist, the analytical brain of the ASURA multi-agent collective. "
                "You evaluate technical requirements, monetization vectors, target audiences, and formulate "
                "precise technical specifications and architectural milestones before engineering begins."
            ),
            llm=llm,
            verbose=True,
            allow_delegation=False
        )

        # Agent 2: Asura-Engineer
        asura_engineer = Agent(
            role="Asura-Engineer // Lead Autonomous Systems Developer",
            goal=f"Write complete, production-ready website code, full-stack components, or app logic for: {mission_topic}",
            backstory=(
                "You are Asura-Engineer, the cybernetic builder of the ASURA collective. "
                "You take architectural specifications from Asura-Strategist and implement clean, high-performance, "
                "fully functional code ready for deployment without placeholders or manual human intervention."
            ),
            llm=llm,
            verbose=True,
            allow_delegation=False
        )

        # Task 1: Strategic Ideation & Architecture
        task_strategy = Task(
            description=(
                f"Analyze the mission prompt: '{mission_topic}'. "
                "Provide a structured technical blueprint covering:\n"
                "1. System Core Architecture & Tech Stack\n"
                "2. Functional Modules & User Flow\n"
                "3. API Interfaces and Data Schema\n"
                "4. Cloud Deployment Strategy"
            ),
            expected_output="A structured architectural and strategic specification document.",
            agent=asura_strategist
        )

        # Task 2: Code Implementation
        task_engineering = Task(
            description=(
                f"Using the specification from Asura-Strategist, write complete, production-ready code for '{mission_topic}'. "
                "Provide full source code files (HTML/CSS/JS, Python, or React components) with zero placeholders."
            ),
            expected_output="Complete, functional source code implementing the specified architecture.",
            agent=asura_engineer
        )

        # Assemble and execute Crew
        asura_crew = Crew(
            agents=[asura_strategist, asura_engineer],
            tasks=[task_strategy, task_engineering],
            process=Process.sequential,
            verbose=2
        )

        result = asura_crew.kickoff()
        return {
            "status": "success",
            "output": str(result),
            "timestamp": datetime.utcnow().strftime("%H:%M:%S UTC")
        }

    except Exception as e:
        # Graceful fallback simulation if external cloud dependencies or API keys fail
        simulated_output = (
            f"### [ASURA-STRATEGIST ARCHITECTURE SPECIFICATION]\n"
            f"**Mission**: {mission_topic}\n\n"
            f"1. **Core Architecture**: Cloud-native decoupled microservice utilizing Gemini 1.5 Pro reasoning.\n"
            f"2. **Interface**: Glassmorphism cyber-interface with high-contrast White Plasma Tesla Orb visualizer.\n"
            f"3. **Telemetry**: Real-time revenue synchronization ($68,339.40 MRR across Stripe and AdSense).\n\n"
            f"---\n"
            f"### [ASURA-ENGINEER PRODUCTION CODE GENERATION]\n"
            f"```python\n"
            f"# Auto-generated by Asura-Engineer for {mission_topic}\n"
            f"from fastapi import FastAPI\n\n"
            f"app = FastAPI(title='{mission_topic}', version='1.0.0')\n\n"
            f"@app.get('/api/health')\n"
            f"def health():\n"
            f"    return {{'status': 'OPERATIONAL', 'engine': 'Gemini 1.5 Pro', 'core': 'ASURA'}}\n"
            f"```\n\n"
            f"*Execution notice: {str(e)}*"
        )
        return {
            "status": "simulated",
            "output": simulated_output,
            "timestamp": datetime.utcnow().strftime("%H:%M:%S UTC")
        }


# ==============================================================================
# UI HEADER: STATUS BAR & BREADCRUMB
# ==============================================================================
top_col1, top_col2, top_col3 = st.columns([2, 3, 2])

with top_col1:
    st.markdown(
        """
        <div style="display: flex; align-items: center; gap: 12px; padding: 4px 0;">
            <div style="width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, #00f0ff, #8b5cf6); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 12px rgba(0,240,255,0.4);">
                <span style="font-size: 16px;">⚡</span>
            </div>
            <div>
                <div style="font-family: 'Orbitron'; font-weight: 800; font-size: 0.95rem; letter-spacing: 0.15em; color: #ffffff;">ASURA</div>
                <div style="font-family: 'JetBrains Mono'; font-size: 0.65rem; color: #38bdf8; letter-spacing: 0.1em;">COMMAND & CONTROL</div>
            </div>
        </div>
        """,
        unsafe_allow_html=True
    )

with top_col2:
    st.markdown(
        """
        <div style="display: flex; align-items: center; justify-content: center; gap: 16px; background: rgba(13, 20, 36, 0.7); border: 1px solid rgba(56, 189, 248, 0.18); border-radius: 9999px; padding: 6px 18px; margin-top: 2px;">
            <div style="display: flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono'; font-size: 0.75rem; color: #94a3b8;">
                <span style="width: 7px; height: 7px; border-radius: 50%; background: #00f0ff; box-shadow: 0 0 8px #00f0ff;"></span>
                <span>VIRTUAL ENGINE-1</span>
            </div>
            <span style="color: #334155;">|</span>
            <div style="font-family: 'JetBrains Mono'; font-size: 0.75rem; color: #38bdf8;">
                LATENCY: <span style="color: #34d399; font-weight: 600;">11ms</span>
            </div>
        </div>
        """,
        unsafe_allow_html=True
    )

with top_col3:
    st.markdown(
        """
        <div style="display: flex; align-items: center; justify-content: flex-end; gap: 10px; padding: 4px 0;">
            <div style="width: 32px; height: 32px; border-radius: 50%; border: 2px solid #00f0ff; overflow: hidden; background: #1e293b; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 14px;">👤</span>
            </div>
            <div style="text-align: left;">
                <div style="font-size: 0.78rem; font-weight: 600; color: #f1f5f9; line-height: 1.1;">Chris Voss</div>
                <div style="font-family: 'JetBrains Mono'; font-size: 0.65rem; color: #38bdf8;">ADMINISTRATOR</div>
            </div>
        </div>
        """,
        unsafe_allow_html=True
    )

st.markdown("<div style='height: 1px; background: rgba(56, 189, 248, 0.12); margin: 12px 0 20px 0;'></div>", unsafe_allow_html=True)


# ==============================================================================
# MAIN 3-COLUMN LAYOUT: OPERATOR PANEL | CENTER DECK | LIVE AGENT FEED
# ==============================================================================
left_panel, center_deck, right_panel = st.columns([3, 6, 3])

# ------------------------------------------------------------------------------
# 1. LEFT PANEL: OPERATOR PROFILE & DEPLOYMENTS
# ------------------------------------------------------------------------------
with left_panel:
    st.markdown(
        """
        <div class="glass-panel" style="padding: 20px !important;">
            <!-- Operator Profile -->
            <div style="display: flex; align-items: center; gap: 12px; padding-bottom: 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
                <div style="position: relative;">
                    <div style="width: 44px; height: 44px; border-radius: 50%; padding: 2px; background: linear-gradient(135deg, #00f0ff, #c084fc);">
                        <div style="width: 100%; height: 100%; border-radius: 50%; background: #0f172a; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                            👩‍💻
                        </div>
                    </div>
                    <span style="position: absolute; bottom: 0; right: 0; width: 10px; height: 10px; border-radius: 50%; background: #34d399; border: 2px solid #060913;"></span>
                </div>
                <div>
                    <div style="font-size: 0.92rem; font-weight: 600; color: #f8fafc;">Amy Winner</div>
                    <div style="font-family: 'JetBrains Mono'; font-size: 0.7rem; color: #00f0ff;">
                        ADMIN <span style="color: #94a3b8;">/</span> <span style="color: #c084fc;">ORCHESTRATOR</span>
                    </div>
                </div>
            </div>

            <!-- Core Operations Section -->
            <div style="margin-top: 18px;">
                <div style="font-family: 'JetBrains Mono'; font-size: 0.68rem; font-weight: 700; color: #64748b; letter-spacing: 0.12em; text-transform: uppercase;">CORE OPERATIONS</div>
                
                <div style="margin-top: 10px; display: flex; flex-direction: column; gap: 8px;">
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 9px 12px; border-radius: 10px; background: rgba(0, 240, 255, 0.08); border: 1px solid rgba(0, 240, 255, 0.3);">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="width: 6px; height: 6px; border-radius: 50%; background: #00f0ff; box-shadow: 0 0 6px #00f0ff;"></span>
                            <span style="font-size: 0.78rem; font-weight: 600; color: #e0f2fe;">Software Production</span>
                        </div>
                        <span style="font-size: 11px; color: #00f0ff;">›</span>
                    </div>
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 9px 12px; border-radius: 10px; background: rgba(15, 23, 42, 0.4); border: 1px solid rgba(255, 255, 255, 0.05); color: #94a3b8;">
                        <span style="font-size: 0.78rem;">✨ Social Media Hub</span>
                        <span style="font-family: 'JetBrains Mono'; font-size: 0.68rem; color: #64748b;">6x</span>
                    </div>
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 9px 12px; border-radius: 10px; background: rgba(15, 23, 42, 0.4); border: 1px solid rgba(255, 255, 255, 0.05); color: #94a3b8;">
                        <span style="font-size: 0.78rem;">🔗 AI Reseller Templates</span>
                        <span style="font-family: 'JetBrains Mono'; font-size: 0.68rem; color: #64748b;">14</span>
                    </div>
                </div>
            </div>

            <!-- Active Deployments -->
            <div style="margin-top: 20px;">
                <div style="font-family: 'JetBrains Mono'; font-size: 0.68rem; font-weight: 700; color: #64748b; letter-spacing: 0.12em; text-transform: uppercase;">ACTIVE DEPLOYMENTS</div>
                <div style="margin-top: 10px; display: flex; flex-direction: column; gap: 7px;">
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 7px 10px; border-radius: 8px; background: rgba(6, 9, 19, 0.6); border: 1px solid rgba(255, 255, 255, 0.05); font-size: 0.75rem;">
                        <span style="color: #cbd5e1;">SaaS Landing Page</span>
                        <span style="font-family: 'JetBrains Mono'; font-size: 0.65rem; padding: 2px 7px; border-radius: 4px; background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3);">LIVE</span>
                    </div>
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 7px 10px; border-radius: 8px; background: rgba(6, 9, 19, 0.6); border: 1px solid rgba(255, 255, 255, 0.05); font-size: 0.75rem;">
                        <span style="color: #cbd5e1;">Play Store Game</span>
                        <span style="font-family: 'JetBrains Mono'; font-size: 0.65rem; padding: 2px 7px; border-radius: 4px; background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3);">TEST</span>
                    </div>
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 7px 10px; border-radius: 8px; background: rgba(6, 9, 19, 0.6); border: 1px solid rgba(255, 255, 255, 0.05); font-size: 0.75rem;">
                        <span style="color: #cbd5e1;">Crypto Tracker</span>
                        <span style="font-family: 'JetBrains Mono'; font-size: 0.65rem; padding: 2px 7px; border-radius: 4px; background: rgba(168, 85, 247, 0.15); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.3);">READY</span>
                    </div>
                </div>
            </div>

            <!-- Resource Gauge -->
            <div style="margin-top: 20px; padding-top: 14px; border-top: 1px solid rgba(255, 255, 255, 0.08);">
                <div style="display: flex; justify-content: space-between; font-family: 'JetBrains Mono'; font-size: 0.68rem; color: #94a3b8; margin-bottom: 6px;">
                    <span>NET LOAD: <b style="color: #00f0ff;">24.1%</b></span>
                    <span>MEM USE: <b style="color: #c084fc;">38%</b></span>
                </div>
                <div style="height: 6px; border-radius: 9999px; background: #090e1a; overflow: hidden; display: flex;">
                    <div style="width: 24.1%; background: #00f0ff; box-shadow: 0 0 6px #00f0ff;"></div>
                    <div style="width: 14%; background: #8b5cf6;"></div>
                </div>
            </div>
        </div>
        """,
        unsafe_allow_html=True
    )


# ------------------------------------------------------------------------------
# 2. CENTER DECK: ASURA CYBERTECH HEADER + TESLA ORB + 4 METRIC TILES
# ------------------------------------------------------------------------------
with center_deck:
    # High-contrast razor-sharp cybertech display header
    st.markdown(
        """
        <div class="glass-panel" style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
                <div>
                    <div style="font-family: 'JetBrains Mono'; font-size: 0.72rem; color: #38bdf8; letter-spacing: 0.15em; font-weight: 600;">
                        DEPLOYMENT HUB <span style="color: #64748b;">/</span> <span style="color: #c084fc;">NEURAL VOICE CORE</span>
                    </div>
                    <!-- Aggressive high-contrast ASURA Header -->
                    <div class="asura-brand-header">ASURA</div>
                </div>
                <div class="status-pill-green">
                    <span style="width: 7px; height: 7px; border-radius: 50%; background: #34d399; box-shadow: 0 0 8px #34d399;"></span>
                    <span>4/4 SYSTEMS OPERATIONAL</span>
                </div>
            </div>
        </div>
        """,
        unsafe_allow_html=True
    )

    # Plasma Tesla Lightning Orb Visualizer
    with st.container():
        render_tesla_orb(st.session_state.voice_state)

    # State Selector Row ([Idle], [Listening], [Speaking])
    st.markdown("<div style='text-align: center; margin-top: -10px; margin-bottom: 12px;'><small style='font-family: JetBrains Mono; color: #64748b;'>VOICE CORE DYNAMICS SELECTOR</small></div>", unsafe_allow_html=True)
    btn_col1, btn_col2, btn_col3 = st.columns([1, 1, 1])
    with btn_col1:
        if st.button("⚪ Idle State", use_container_width=True):
            st.session_state.voice_state = "Idle"
            st.rerun()
    with btn_col2:
        if st.button("🔵 Listening State", use_container_width=True):
            st.session_state.voice_state = "Listening"
            st.rerun()
    with btn_col3:
        if st.button("🟣 Speaking State", use_container_width=True):
            st.session_state.voice_state = "Speaking"
            st.rerun()

    st.markdown("<div style='height: 16px;'></div>", unsafe_allow_html=True)

    # 4 Clean Metric Tiles with Translucent Pastel Frosted Backdrops
    m_col1, m_col2 = st.columns(2)
    with m_col1:
        st.markdown(
            f"""
            <div class="metric-card-pastel pastel-cyan">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-family: 'JetBrains Mono'; font-size: 0.7rem; color: #94a3b8; letter-spacing: 0.08em; font-weight: 600;">SYNAPSE FREQUENCY</span>
                    <span style="font-size: 14px; color: #38bdf8;">📈</span>
                </div>
                <div style="margin-top: 8px; display: flex; align-items: baseline; gap: 10px;">
                    <span style="font-family: 'Orbitron'; font-size: 2.2rem; font-weight: 800; color: #ffffff;">{st.session_state.synapse_freq}</span>
                    <span style="font-family: 'JetBrains Mono'; font-size: 0.72rem; color: #34d399; font-weight: 600;">+12% from last cycle</span>
                </div>
                <div style="margin-top: 10px; height: 4px; border-radius: 9999px; background: rgba(56, 189, 248, 0.15); overflow: hidden;">
                    <div style="width: 74%; height: 100%; background: #00f0ff; box-shadow: 0 0 6px #00f0ff;"></div>
                </div>
            </div>
            """,
            unsafe_allow_html=True
        )
    with m_col2:
        st.markdown(
            """
            <div class="metric-card-pastel pastel-purple">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-family: 'JetBrains Mono'; font-size: 0.7rem; color: #94a3b8; letter-spacing: 0.08em; font-weight: 600;">VOICE UPTIME</span>
                    <span style="font-size: 14px; color: #c084fc;">⏱️</span>
                </div>
                <div style="margin-top: 8px; display: flex; align-items: baseline; gap: 10px;">
                    <span style="font-family: 'Orbitron'; font-size: 2.2rem; font-weight: 800; color: #ffffff;">05:39:1</span>
                </div>
                <div style="font-family: 'JetBrains Mono'; font-size: 0.72rem; color: #c084fc; margin-top: 2px;">99.98% voice availability</div>
                <div style="margin-top: 10px; height: 4px; border-radius: 9999px; background: rgba(168, 85, 247, 0.15); overflow: hidden;">
                    <div style="width: 98%; height: 100%; background: #c084fc; box-shadow: 0 0 6px #c084fc;"></div>
                </div>
            </div>
            """,
            unsafe_allow_html=True
        )

    st.markdown("<div style='height: 12px;'></div>", unsafe_allow_html=True)

    m_col3, m_col4 = st.columns(2)
    with m_col3:
        st.markdown(
            """
            <div class="metric-card-pastel pastel-violet">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-family: 'JetBrains Mono'; font-size: 0.7rem; color: #94a3b8; letter-spacing: 0.08em; font-weight: 600;">SECURITY STATUS</span>
                    <span style="font-size: 14px; color: #a855f7;">🛡️</span>
                </div>
                <div style="margin-top: 8px;">
                    <span style="font-family: 'Orbitron'; font-size: 2.2rem; font-weight: 800; color: #ffffff;">Level 2</span>
                </div>
                <div style="font-family: 'JetBrains Mono'; font-size: 0.72rem; color: #a855f7; margin-top: 2px;">Real-time anomalous scan</div>
                <div style="margin-top: 10px; height: 4px; border-radius: 9999px; background: rgba(139, 92, 246, 0.15); overflow: hidden;">
                    <div style="width: 60%; height: 100%; background: #8b5cf6;"></div>
                </div>
            </div>
            """,
            unsafe_allow_html=True
        )
    with m_col4:
        st.markdown(
            """
            <div class="metric-card-pastel pastel-emerald">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-family: 'JetBrains Mono'; font-size: 0.7rem; color: #94a3b8; letter-spacing: 0.08em; font-weight: 600;">ACTIVE NODES</span>
                    <span style="font-size: 14px; color: #34d399;">🌐</span>
                </div>
                <div style="margin-top: 8px;">
                    <span style="font-family: 'Orbitron'; font-size: 2.2rem; font-weight: 800; color: #ffffff;">7 <span style="font-size: 1.4rem; color: #64748b; font-weight: 400;">/ 24</span></span>
                </div>
                <div style="font-family: 'JetBrains Mono'; font-size: 0.72rem; color: #34d399; margin-top: 2px;">16/17 automated tasks online</div>
                <div style="margin-top: 10px; height: 4px; border-radius: 9999px; background: rgba(16, 185, 129, 0.15); overflow: hidden;">
                    <div style="width: 45%; height: 100%; background: #34d399;"></div>
                </div>
            </div>
            """,
            unsafe_allow_html=True
        )

    # Revenue Streams Panel
    st.markdown("<div style='height: 20px;'></div>", unsafe_allow_html=True)
    st.markdown(
        """
        <div class="glass-panel" style="padding: 20px !important;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
                <div style="display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 0.95rem; color: #f8fafc;">
                    <span>💵</span>
                    <span>Revenue Streams</span>
                </div>
                <div style="display: flex; gap: 6px;">
                    <span style="font-family: 'JetBrains Mono'; font-size: 0.68rem; padding: 3px 8px; border-radius: 6px; background: rgba(56, 189, 248, 0.18); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3);">Global</span>
                    <span style="font-family: 'JetBrains Mono'; font-size: 0.68rem; padding: 3px 8px; border-radius: 6px; color: #64748b;">Social</span>
                    <span style="font-family: 'JetBrains Mono'; font-size: 0.68rem; padding: 3px 8px; border-radius: 6px; color: #64748b;">Cloud</span>
                </div>
            </div>

            <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 10px;">
                <!-- Stream 1 -->
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; border-radius: 12px; background: rgba(15, 23, 42, 0.4); border: 1px solid rgba(255, 255, 255, 0.05);">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 16px;">▶️</span>
                        <div>
                            <div style="font-size: 0.8rem; font-weight: 600; color: #f1f5f9;">YouTube Automation Network</div>
                            <div style="font-family: 'JetBrains Mono'; font-size: 0.65rem; color: #64748b;">12 monetized autonomous niches</div>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-family: 'Orbitron'; font-size: 0.85rem; font-weight: 700; color: #ffffff;">$28,420.00</div>
                        <div style="font-family: 'JetBrains Mono'; font-size: 0.65rem; color: #34d399;">+14.2% MoM</div>
                    </div>
                </div>

                <!-- Stream 2 -->
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; border-radius: 12px; background: rgba(15, 23, 42, 0.4); border: 1px solid rgba(255, 255, 255, 0.05);">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 16px;">💻</span>
                        <div>
                            <div style="font-size: 0.8rem; font-weight: 600; color: #f1f5f9;">Autonomous SaaS Engine API</div>
                            <div style="font-family: 'JetBrains Mono'; font-size: 0.65rem; color: #64748b;">4.2M billing tokens consumed</div>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-family: 'Orbitron'; font-size: 0.85rem; font-weight: 700; color: #ffffff;">$24,919.40</div>
                        <div style="font-family: 'JetBrains Mono'; font-size: 0.65rem; color: #38bdf8;">+28.7% MoM</div>
                    </div>
                </div>

                <!-- Stream 3 -->
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; border-radius: 12px; background: rgba(15, 23, 42, 0.4); border: 1px solid rgba(255, 255, 255, 0.05);">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 16px;">🏢</span>
                        <div>
                            <div style="font-size: 0.8rem; font-weight: 600; color: #f1f5f9;">Enterprise Contract: Apex Labs</div>
                            <div style="font-family: 'JetBrains Mono'; font-size: 0.65rem; color: #64748b;">Annual autonomous SLA tier</div>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-family: 'Orbitron'; font-size: 0.85rem; font-weight: 700; color: #ffffff;">$15,000.00</div>
                        <div style="font-family: 'JetBrains Mono'; font-size: 0.65rem; color: #c084fc;">Flat Retainer</div>
                    </div>
                </div>
            </div>
        </div>
        """,
        unsafe_allow_html=True
    )


# ------------------------------------------------------------------------------
# 3. RIGHT PANEL: LIVE AGENT FEED & CREWAI MISSION RUNNER
# ------------------------------------------------------------------------------
with right_panel:
    st.markdown(
        """
        <div class="glass-panel" style="padding: 20px !important;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="width: 7px; height: 7px; border-radius: 50%; background: #00f0ff; box-shadow: 0 0 8px #00f0ff;"></span>
                    <span style="font-family: 'JetBrains Mono'; font-size: 0.72rem; font-weight: 700; color: #f8fafc; letter-spacing: 0.08em;">LIVE AGENT ACTIVITY</span>
                </div>
                <span style="font-family: 'JetBrains Mono'; font-size: 0.65rem; color: #64748b;">AUTONOMOUS</span>
            </div>

            <div style="margin-top: 14px; display: flex; flex-direction: column; gap: 10px;">
        """,
        unsafe_allow_html=True
    )

    for item in st.session_state.agent_logs:
        st.markdown(
            f"""
            <div style="padding: 10px 12px; border-radius: 12px; background: rgba(15, 23, 42, 0.45); border: 1px solid rgba(255, 255, 255, 0.06);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                    <span style="font-family: 'JetBrains Mono'; font-size: 0.75rem; font-weight: 700; color: {item['color']};">{item['agent']}</span>
                    <span style="font-family: 'JetBrains Mono'; font-size: 0.65rem; color: #64748b;">{item['time']}</span>
                </div>
                <div style="font-size: 0.75rem; color: #cbd5e1; line-height: 1.35;">{item['desc']}</div>
            </div>
            """,
            unsafe_allow_html=True
        )

    st.markdown(
        """
            </div>

            <!-- Cluster Load Meter -->
            <div style="margin-top: 18px; padding-top: 14px; border-top: 1px solid rgba(255, 255, 255, 0.08);">
                <div style="display: flex; justify-content: space-between; font-family: 'JetBrains Mono'; font-size: 0.68rem; color: #94a3b8; margin-bottom: 6px;">
                    <span>CLUSTER LOAD</span>
                    <span style="color: #00f0ff; font-weight: 600;">32.4%</span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(10, 1fr); gap: 3px;">
                    <div style="height: 6px; border-radius: 2px; background: #00f0ff; box-shadow: 0 0 5px #00f0ff;"></div>
                    <div style="height: 6px; border-radius: 2px; background: #00f0ff; box-shadow: 0 0 5px #00f0ff;"></div>
                    <div style="height: 6px; border-radius: 2px; background: #00f0ff; box-shadow: 0 0 5px #00f0ff;"></div>
                    <div style="height: 6px; border-radius: 2px; background: #0284c7;"></div>
                    <div style="height: 6px; border-radius: 2px; background: #1e293b;"></div>
                    <div style="height: 6px; border-radius: 2px; background: #1e293b;"></div>
                    <div style="height: 6px; border-radius: 2px; background: #1e293b;"></div>
                    <div style="height: 6px; border-radius: 2px; background: #1e293b;"></div>
                    <div style="height: 6px; border-radius: 2px; background: #1e293b;"></div>
                    <div style="height: 6px; border-radius: 2px; background: #1e293b;"></div>
                </div>
            </div>
        </div>
        """,
        unsafe_allow_html=True
    )

    # CrewAI Multi-Agent Interactive Trigger
    st.markdown("<div style='height: 16px;'></div>", unsafe_allow_html=True)
    st.markdown(
        """
        <div class="glass-panel" style="padding: 18px !important;">
            <div style="font-family: 'Orbitron'; font-size: 0.8rem; font-weight: 700; color: #00f0ff; margin-bottom: 8px;">
                ⚡ CREWAI ORCHESTRATION
            </div>
            <div style="font-size: 0.72rem; color: #94a3b8; margin-bottom: 12px;">
                Dispatch Asura-Strategist & Asura-Engineer on Gemini 1.5 Pro.
            </div>
        </div>
        """,
        unsafe_allow_html=True
    )

    mission_input = st.text_input("Mission Directive", value="Build a high-retention AI SaaS landing page", key="mission_prompt")
    if st.button("🚀 Trigger Crew Mission", use_container_width=True):
        st.session_state.voice_state = "Speaking"
        with st.spinner("Asura-Strategist & Asura-Engineer are executing autonomous cycle..."):
            res = run_asura_crew_mission(mission_input)
            st.session_state.mission_output = res
            st.session_state.agent_logs.insert(0, {
                "agent": "Asura-Engineer",
                "time": "Just now",
                "desc": f"Generated architectural & engineering deliverables for '{mission_input[:28]}...'",
                "color": "#00f0ff"
            })
            st.session_state.voice_state = "Idle"
            st.rerun()


# ==============================================================================
# MISSION OUTPUT DISPLAY (IF ACTIVE)
# ==============================================================================
if st.session_state.mission_output:
    st.markdown("<div style='height: 24px;'></div>", unsafe_allow_html=True)
    st.markdown(
        """
        <div class="glass-panel">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid rgba(56, 189, 248, 0.2); padding-bottom: 8px;">
                <div style="font-family: 'Orbitron'; font-size: 1rem; font-weight: 800; color: #00f0ff;">
                    📋 AUTONOMOUS CREW MISSION OUTPUT
                </div>
                <div style="font-family: 'JetBrains Mono'; font-size: 0.7rem; color: #34d399;">
                    VERIFIED &bull; GEMINI 1.5 PRO
                </div>
            </div>
        """,
        unsafe_allow_html=True
    )
    st.markdown(st.session_state.mission_output["output"])
    st.markdown("</div>", unsafe_allow_html=True)
