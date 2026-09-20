---
name: vercel-react-best-practices
description: Vercel Labs performance optimization standards: zero-waterfall loading, bundle size minimization, and instant client rendering.
---

# VERCEL REACT BEST PRACTICES // PERFORMANCE STANDARDS

## 1. Eliminate Waterfalls
- Never chain dependent sequential API requests. Trigger all data fetching in parallel (Promise.all).
- Pre-render static markup and hydrate interactivity progressively.

## 2. Bundle Size Optimization
- Use native modern browser APIs where possible (Web Audio, Canvas 2D, IntersectionObserver) before importing heavy libraries.
- For heavy libraries (Three.js, Chart.js), load asynchronously via CDN or dynamic imports.

## 3. Core Web Vitals
- LCP (Largest Contentful Paint) < 1.2s: Optimize hero typography and critical CSS.
- CLS (Cumulative Layout Shift) = 0: Explicit width/height on all images, iframes, and canvas elements.
