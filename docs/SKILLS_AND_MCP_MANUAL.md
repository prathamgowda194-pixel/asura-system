# ASURA AGENTIC AI WEBSITE DEVELOPER // SKILLS & MCP MANUAL

**Version:** 10.0.0 Commercial Master  
**Supported Models:** Gemini 3.6 Flash, OpenAI Form (Structured Schema), Claude 3.7 Sonnet  
**Architecture:** 10 Integrated Frontend Skills, 2 MCP Tool Servers, GSAP Animation Physics, Convex Real-Time Data

---

## 1. Integrated Skills Catalog

Asura now possesses 10 dedicated skill packages installed in `skills/` and `.agents/skills/`:

| Skill | Source | Core Commercial Capability |
| :--- | :--- | :--- |
| **`frontend-design`** | Anthropic Official | Eradicates generic AI template "slop". Enforces deliberate aesthetic intent, bespoke typography scales, and strict token hierarchy. |
| **`ui-ux-pro-max`** | NextLevelBuilder | Database of 50+ UI visual paradigms (Bento Grids, Glassmorphism, Neumorphism), curated font pairings, and high-converting palettes. |
| **`design-taste-frontend`** | Eon01 / Antigravity Standard | Pre-flight quality checklist and tactile feedback matrices (hover, active, focus-visible) on all interactive elements. |
| **`shadcn-ui-mcp`** | Jason-Inc / Shadcn Registry | Accessible Radix component primitives (dialogs, sheets, tabs, badges) styled with Tailwind CSS. |
| **`magic-mcp-21st`** | 21st.dev Magic MCP | Instant generation of animated Bento showcases, kinetic beam backgrounds, marquee tickers, and SVGL brand assets. |
| **`vercel-react-best-practices`** | Vercel Labs | 40+ performance rules: eliminates sequential request waterfalls, minimizes bundle sizes, ensures zero layout shift (CLS = 0). |
| **`vercel-react-native-skills`** | Expo / React Native Standards | Universal responsive layouts with mobile-first fluid grids, 44px touch targets, and cross-device ergonomics. |
| **`gsap-master`** | GreenSock | ScrollTrigger timelines, scrubbed parallax layers, continuous marquee motion loops, and staggered text reveals. |
| **`motion-framer`** | Framer Motion | Physics-based spring animations (`stiffness: 350, damping: 25`), tactile gesture snaps, and exit transitions. |
| **`convex-create-component`** | Get-Convex | Real-time reactive backend components: modular schemas, live WebSocket subscriptions, and friction-free lead capture forms. |

---

## 2. MCP Servers Configuration (`mcp_config.json`)

Asura is configured to interface with MCP (Model Context Protocol) servers:

```json
{
  "mcpServers": {
    "shadcn-ui": {
      "command": "npx",
      "args": ["-y", "shadcn@latest", "mcp"],
      "description": "Official Shadcn UI component registry search, preview, and extraction server."
    },
    "magic-mcp-21st": {
      "command": "npx",
      "args": ["-y", "@21st-dev/magic-mcp"],
      "env": {
        "API_KEY": "public_preview"
      },
      "description": "21st.dev Magic MCP: AI component generator, animated Tailwind blocks, and SVGL brand assets."
    }
  },
  "modelConfigurations": {
    "gemini-3.6-flash": {
      "provider": "google",
      "functionCalling": true,
      "toolMode": "auto",
      "temperature": 0.2
    },
    "openai-form": {
      "provider": "openai",
      "responseFormat": { "type": "json_object" },
      "temperature": 0.2
    }
  }
}
```

---

## 3. How to Build Websites for Paying Clients

1. **Launch Asura Cloud Studio:**
   - Double-click **`ASURA AI Web Developer`** on your Windows Desktop (or open `https://asura-system.vercel.app/projects/studio`).
2. **Select the Model:**
   - Choose **`Gemini 3.6 Flash High (Skills Master)`** or **`OpenAI Form (Structured Schema)`** from the model dropdown.
3. **Use the New Preset Prompts (or create your own):**
   - **Bento Grid High-Tech:** *"Build a 21st.dev Magic interactive Bento Grid website for an enterprise AI accelerator with GSAP scroll physics."*
   - **FinTech & Web3:** *"Build a high-performance FinTech portal with Shadcn UI cards, dynamic charts, and Convex real-time state."*
   - **Luxury Real Estate:** *"Build a luxury architectural estate website with GSAP ScrollTrigger parallax and tactile hover micro-physics."*
4. **Deploy & Deliver to Clients:**
   - Inspect the live interactive preview in the sandbox iframe.
   - Click **Deploy to Vercel** or **Export ZIP** to deliver the production-ready code directly to your client.
