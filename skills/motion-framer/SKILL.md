---
name: motion-framer
description: Framer Motion physics: natural spring dynamics, gesture interactions, layout animations, and modal enter/exit transitions.
---

# FRAMER MOTION PHYSICS

## 1. Spring Physics Standard
Use realistic spring values rather than linear easing:
```javascript
const springTransition = {
  type: "spring",
  stiffness: 350,
  damping: 25,
  mass: 0.8
};
```
