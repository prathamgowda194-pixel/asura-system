# ASURA // MANUS BUILDER INTEGRATED SYSTEM WORKFLOW
## Autonomous Multi-Agent Web Engineering & Vercel Continuous Deployment

---

### 1. Unified Architecture Overview
The Manus Builder system is now fully integrated as the primary autonomous web engineering engine within the Asura System. All websites designed, developed, and deployed through this workflow follow an uncompromising standard of visual craftsmanship, kinetic motion, and zero-defect Vercel production hosting.

```mermaid
flowchart TD
    User["User Brief / Requirements"] --> Sisyphus["Sisyphus (Orchestrator)"]
    Sisyphus --> Prometheus["Prometheus (Strategic Planner & Design Intelligence)"]
    Prometheus --> Oracle["Oracle (Architecture & Tech Stack)"]
    Oracle --> Pixel["Pixel (Frontend & Kinetic UI Specialist)"]
    Oracle --> CodeSmith["CodeSmith (Backend & Vercel Edge Infra)"]
    Pixel & CodeSmith --> Tester["Tester (Visual & Functional QA)"]
    Tester --> Debugger["Debugger (Hotfix & Optimization)"]
    Debugger --> Deployer["Asura GitHub/Vercel Atomic Pipeline"]
    Deployer --> Vercel["Vercel Cloud Production (200 OK)"]
    Vercel --> Studio["Asura Studio Live Fleet Radar (/studio)"]
```

---

### 2. Multi-Agent Team Roster
1. **Sisyphus (Master Orchestrator)**:
   - Directs the lifecycle of every website project from intake to live production.
   - Monitors build milestones, assets, and deployment integrity.
2. **Prometheus (Strategic Planner & Design Intelligence)**:
   - Evaluates client brand identity, market niche, and sensory aesthetics.
   - Uses curated design libraries (`UI/UX Pro Max`, `Design Taste Frontend`) to block generic AI slop.
3. **Oracle (System Architect)**:
   - Designs component boundaries, state flow, and 3D / media canvas pipelines.
   - Ensures cross-platform device responsiveness and zero layout shift.
4. **Pixel (Frontend & Kinetic UI Specialist)**:
   - Authors high-fidelity interactive components using Tailwind CSS, GSAP 3.12, Framer Motion, and HTML5 Canvas.
   - Implements 60fps micro-interactions, folder-tab card cutouts, glassmorphic docks, and bespoke scroll scrubbers.
5. **CodeSmith (Backend & Infrastructure)**:
   - Engineers Vercel serverless functions, asset edge streaming, and zero-404 routing.
   - Manages atomic Git tree commits directly through the GitHub API without shell dependencies.
6. **Tester (QA Specialist)**:
   - Validates live endpoint HTTP status codes, console error logs, and asset loading.
   - Verifies responsiveness on mobile, tablet, and ultra-wide displays.
7. **Debugger (Root Cause Resolver)**:
   - Inspects runtime failures, broken symlinks, syntax errors, and missing assets.
   - Executes immediate precision hotfixes.

---

### 3. Deployed Production Fleet Tracking (Vercel)
The following production applications are active and continuously tracked inside Asura Studio:

| Project Slug | Domain / Client | Tech Stack & Signature Features | Vercel Live Route |
| :--- | :--- | :--- | :--- |
| **`villa-elysee`** | Villa Élysée (Cap de Nice) | 3D AI Clifftop Drone Fly-Through, 60fps Canvas Scrubber, GPS Telemetry, 3D Tilt Cards | [`/projects/villa-elysee`](https://asura-system.vercel.app/projects/villa-elysee) |
| **`aadriti-learning-centre`** | Aadriti Centre For Learning And Psychological Well Being | Folder-Tab Cards, Bento Mosaic, Programs Slider, 1,500+ Metric Counter, Official Client Branding | [`/projects/aadriti-learning-centre`](https://asura-system.vercel.app/projects/aadriti-learning-centre) |
| **`pixnova`** | Pixnova Digital Architecture | Multi-Niche Digital Agency Portfolio, Interactive Dark Blue / White Theme, GSAP Motion | [`/projects/pixnova`](https://asura-system.vercel.app/projects/pixnova) |
| **`studio`** | Asura Control Dashboard | Live Radar Monitor, Autonomous Code Generator, Direct Deployment Manager | [`/studio`](https://asura-system.vercel.app/studio) |

---

### 4. Zero-404 Vercel Edge Pipeline
- **Auto-Sync**: Any atomic Git tree push to `main` branch immediately triggers Vercel CI/CD.
- **Dynamic Asset Fallback**: `api/serve_project.js` and `api/serve_asset.js` ensure that all media (videos, WebP frames, photos) resolve with HTTP 200/206 Range streaming without breakage.
- **Studio Fleet Sync**: Asura Studio automatically registers newly deployed projects in its active radar and monitors live status.
