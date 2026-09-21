/**
 * CLAUDE FRONTEND DESIGN SKILL 03: AWESOME DESIGN SYSTEM
 * Origin: Awesome Design / High-End Interaction Physics
 * Purpose: Supplies complete kinetic design tokens, custom magnetic cursor code,
 *          3D card tilt shaders, and smooth auto-scroll mechanics.
 */

function generateKineticMotionBundle(niche, cursorType) {
  return `
    /* === AWESOME DESIGN SYSTEM: KINETIC INTERACTIONS === */
    <style>
      /* Custom Precision Cursor */
      .custom-cursor-dot {
        position: fixed;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: var(--cursor-color, #00F0FF);
        pointer-events: none;
        z-index: 99999;
        transform: translate(-50%, -50%);
        transition: transform 0.08s ease-out, opacity 0.2s ease;
      }
      .custom-cursor-ring {
        position: fixed;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 1.5px solid var(--cursor-color, #00F0FF);
        pointer-events: none;
        z-index: 99998;
        transform: translate(-50%, -50%);
        transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1), height 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.15s ease-out, border-color 0.3s ease;
      }
      .cursor-hover .custom-cursor-ring {
        width: 58px;
        height: 58px;
        background-color: rgba(255, 255, 255, 0.06);
        border-color: #FFFFFF;
      }

      /* 3D Kinetic Card Tilt & Specular Reflection */
      .tilt-card {
        transform-style: preserve-3d;
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease, box-shadow 0.4s ease;
        will-change: transform;
      }
      .tilt-card:hover {
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px var(--card-glow, rgba(0, 240, 255, 0.25));
      }

      /* Magnetic Button Physics */
      .magnetic-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        will-change: transform;
      }
    </style>

    <!-- Custom Cursor DOM Elements -->
    <div id="cursorDot" class="custom-cursor-dot hidden sm:block"></div>
    <div id="cursorRing" class="custom-cursor-ring hidden sm:block"></div>

    <script>
      // 1. KINETIC CURSOR TRACKING
      var cDot = document.getElementById('cursorDot');
      var cRing = document.getElementById('cursorRing');
      var mouseX = -100, mouseY = -100;
      var ringX = -100, ringY = -100;

      window.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (cDot) {
          cDot.style.left = mouseX + 'px';
          cDot.style.top = mouseY + 'px';
        }
      });

      function renderCursorRing() {
        // Smooth lerp following
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        if (cRing) {
          cRing.style.left = ringX + 'px';
          cRing.style.top = ringY + 'px';
        }
        requestAnimationFrame(renderCursorRing);
      }
      renderCursorRing();

      // Expand cursor on interactive targets
      document.querySelectorAll('a, button, input[type=range], .tilt-card').forEach(function(el) {
        el.addEventListener('mouseenter', function() { document.body.classList.add('cursor-hover'); });
        el.addEventListener('mouseleave', function() { document.body.classList.remove('cursor-hover'); });
      });

      // 2. 3D CARD GYROSCOPIC TILT PHYSICS
      document.querySelectorAll('.tilt-card').forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
          var rect = card.getBoundingClientRect();
          var x = e.clientX - rect.left - (rect.width / 2);
          var y = e.clientY - rect.top - (rect.height / 2);
          var rotX = (y / (rect.height / 2)) * -12;
          var rotY = (x / (rect.width / 2)) * 14;
          card.style.transform = 'perspective(1000px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) scale3d(1.02, 1.02, 1.02)';
        });
        card.addEventListener('mouseleave', function() {
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
      });

      // 3. MAGNETIC BUTTON ATTRACTION
      document.querySelectorAll('.magnetic-btn').forEach(function(btn) {
        btn.addEventListener('mousemove', function(e) {
          var rect = btn.getBoundingClientRect();
          var dx = e.clientX - rect.left - (rect.width / 2);
          var dy = e.clientY - rect.top - (rect.height / 2);
          btn.style.transform = 'translate(' + (dx * 0.3) + 'px, ' + (dy * 0.3) + 'px)';
        });
        btn.addEventListener('mouseleave', function() {
          btn.style.transform = 'translate(0px, 0px)';
        });
      });
    <\/script>
  `;
}

module.exports = { generateKineticMotionBundle };
