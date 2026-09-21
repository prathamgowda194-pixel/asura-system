/**
 * CLAUDE FRONTEND DESIGN SKILL 02: WEB DESIGN GUIDELINES
 * Origin: Vercel Web Design Guidelines / Next.js Production Standard
 * Purpose: Enforces performance, accessibility, zero layout shifts, and semantic DOM integrity.
 */

function auditAgainstVercelGuidelines(html) {
  const issues = [];

  // 1. Check for layout shift risks (images missing dimensions or object-fit)
  if (html.includes('<img') && !html.includes('object-cover') && !html.includes('width=')) {
    issues.push('Images without fixed aspect-ratio or object-fit may cause layout shift (CLS).');
  }

  // 2. Check for missing viewport meta tag
  if (!html.includes('viewport')) {
    issues.push('Missing viewport meta tag for mobile responsiveness.');
  }

  // 3. Check for modern Google Fonts preconnect
  if (html.includes('fonts.googleapis.com') && !html.includes('rel="preconnect"')) {
    issues.push('Google Fonts loaded without preconnect links, degrading LCP.');
  }

  // 4. Anti-Slop Check: Primitive 3D Geometry
  if (html.includes('BoxGeometry') || html.includes('CylinderGeometry')) {
    issues.push('VIOLATION OF ANTI-SLOP LAW 1: Primitive Three.js geometries detected in production build.');
  }

  // 5. Zero-counter slop check
  if (html.includes('>0<') && html.includes('counter')) {
    issues.push('Uninitialized 0-start counter found. Metrics must be pre-rendered.');
  }

  return {
    compliant: issues.length === 0,
    issues: issues
  };
}

module.exports = { auditAgainstVercelGuidelines };
