# Build Premium 3D Website

**Input**: {{USER_PROMPT}}

## Step 1: Research
Use browser research to find 3 reference websites in the niche described in {{USER_PROMPT}}.
Extract: dominant colors, typography, layout patterns, animation styles.
Save findings to `research_notes.md`.

## Step 2: Plan
Based on the research, create `project_plan.md` containing:
- Site architecture (pages, sections)
- Component inventory (hero, gallery, about, contact)
- Tech stack confirmation
- 3D element specification

Present the plan to the user for approval.

## Step 3: Build
Scaffold a Next.js project with TypeScript and Tailwind.
Install dependencies: three, @react-three/fiber, @react-three/drei, framer-motion, gsap, lenis.
Build each component from the plan one by one.
After each component, run `npm run build` to catch errors.
If build fails, fix the error and re-run.

## Step 4: Verify
Start the development server.
Take screenshots of every page.
Compare against the research references.
Flag any visual issues.

## Step 5: Deploy
Run the production build.
Provide the output folder path.
