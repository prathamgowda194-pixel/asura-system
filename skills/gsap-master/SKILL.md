---
name: gsap-master
description: GreenSock Animation Platform: ScrollTrigger timelines, scrubbed parallax, staggered text reveals, and continuous motion loops.
---

# GSAP ANIMATION ORCHESTRATION

## 1. Essential GSAP Patterns
Staggered fade & slide in:
```javascript
gsap.from(".bento-card", {
  duration: 0.8,
  y: 40,
  opacity: 0,
  stagger: 0.15,
  ease: "power3.out"
});
```
