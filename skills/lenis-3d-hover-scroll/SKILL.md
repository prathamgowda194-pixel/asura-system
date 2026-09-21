---
name: lenis-3d-hover-scroll
description: High-performance smooth scrolling and 3D hover/scroll interaction engine powered by Darkroom Engineering's Lenis, GSAP, and Three.js WebGL. Use when building living, kinetic web experiences that require synchronized physics, 3D card tilt, velocity skewing, and magnetic cursor interactions.
---

# Lenis Smooth Scroll & 3D Hover/Scroll Physics Engine

This skill encodes the complete architectural patterns of **`darkroomengineering/lenis`** paired with **Three.js** and **3D CSS kinetic transforms** to add tactile life and depth to modern web applications.

---

## 1. Lenis Smooth Scroll Architecture

### A. Minimal Drop-in (Zero-Dependency CDN)
```html
<link rel="stylesheet" href="https://unpkg.com/lenis@1.3.26/dist/lenis.css">
<script src="https://unpkg.com/lenis@1.3.26/dist/lenis.min.js"></script>
<script>
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.5,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
</script>
```

### B. Lenis + GSAP ScrollTrigger Integration
```javascript
const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);
```

### C. Velocity-Based Dynamic Skew on Scroll
```javascript
let currentSkew = 0;
lenis.on('scroll', ({ velocity }) => {
  // Clamp skew to [-5deg, 5deg]
  const targetSkew = Math.max(-5, Math.min(5, velocity * 0.08));
  currentSkew += (targetSkew - currentSkew) * 0.1;
  document.querySelectorAll('.scroll-skew').forEach(el => {
    el.style.transform = `skewY(${currentSkew.toFixed(2)}deg)`;
  });
});
```

---

## 2. 3D Card Hover Physics with Dynamic Glare Sheen

Every card in a high-end interface should have true 3D spatial depth:

```javascript
function apply3DTilt(cardElement) {
  cardElement.addEventListener('mousemove', (e) => {
    const rect = cardElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Max rotation 12 degrees
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    cardElement.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    
    // Dynamic specular light reflection
    const glare = cardElement.querySelector('.card-glare');
    if (glare) {
      glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.25) 0%, transparent 65%)`;
      glare.style.opacity = '1';
    }
  });

  cardElement.addEventListener('mouseleave', () => {
    cardElement.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    const glare = cardElement.querySelector('.card-glare');
    if (glare) glare.style.opacity = '0';
  });
}
```

---

## 3. Magnetic Element Physics

Buttons and badges should elastically gravitate towards the user's cursor:

```javascript
function applyMagneticPull(el, strength = 0.35) {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    el.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'translate(0px, 0px) scale(1)';
  });
}
```

---

## 4. WebGL Dynamic Synchronized Depth

When combining Lenis with Three.js WebGL scenes:
- Feed `lenis.scroll` directly into `camera.position.y` or uniform `uScroll`.
- Feed `lenis.velocity` into particle field acceleration or wave distortion uniforms.
- Use `requestAnimationFrame` to ensure zero desync between DOM elements and 3D viewports.
