# Visual & Technical QA Report — `celeste-elixir`

- **Engine**: Asura v3.1 (`three.js 0.187.0`, `gsap 3.15.1`, `lenis 1.3.27`) + Cloud `SUPRA-Tex` (`asura_pbr_adapter.py`)
- **Cloud Verification Environment**: GitHub Codespace `ubiquitous-space-xylophone-xr4qp775qr96frrx` (Chromium SwiftShader WebGL2)
- **Viewports Checked**: Desktop `1440x900` (`high` tier), Mobile `390x844` (`mid` tier), `?fallback=1` (`0, 0.5, 1`), Interactive `#ritual` keyboard/click probe (`[data-variant='30ml']`)

## Telemetry Summary (Round 3 — Final)

| Metric | Desktop (`1440x900`) | Mobile (`390x844`) | Threshold |
|---|---:|---:|---|
| Draw Calls (max) | `163` | `163` | `< 400` |
| Triangles (max) | `264,612` | `191,076` | `< 3M` / `< 1.5M` |
| Console / Page Errors | `0` | `0` | `0` |
| Failed Network Requests | `0` | `0` | `0` |
| `?fallback=1` Errors | `0` | `0` | `0` |
| Interactive Probe Diff | `1.56` | — | `> 0.30` |

## Defects Caught & Resolved Across Rounds 1–3

1. **Label Circumference Centering**: Rotated `CylinderGeometry` sleeve via `phiStart = -labelArc / 2` so `celeste` stays strictly camera-facing on hero intro; added matte cotton apothecary ingredient composition rear strip (`phiStart = Math.PI - rearArc / 2`) so 360-degree spins show rear apothecary print instead of blank glass.
2. **Meadow Botanical Realism & Triangle Budget**: Replaced straight cylinder needles and sphere balls with curved wind-swept grass ribbon geometry and 5-petal blue tansy / forget-me-not florets, improving silhouette realism while reducing scene triangle count from `1.32M` to `264k`.
3. **Travertine Basin UV Seam**: Replaced `stone` texture seam with tileable `plaster` relief + `dishGeo.rotateY(Math.PI)` so the seam sits behind `-Z`.
4. **Beat 3 (`#dropper`) Contrast**: Fixed `.chapter--tall` sticky bottom override with `.copy--sky-mid` so `"Three drops. Take your time."` sits over clear upper-left skyish-blue air.
5. **Beat 6 (`#clarity`) Clarity**: Faded `capGroup` cleanly above frame before overhead nadir shots (`swirl < 0.08`), matched `swirl` hemispherical end-cap radii (`0.0046`), and tuned `#0f2e4d` liquid-glass relief typography for crisp contrast over the cerulean water ripple.
6. **Beat 7 (`#ritual`) & Mobile Hero Scrim**: Calibrated desktop headroom (`trioGroup.position.y = -0.006`), mobile 3-column variant row + portrait camera pull-back (`z: 0.82`), and explicit `--scrim` tokens (`chapter--white-ink` dark moss scrim on `#intro`/`#distilled` vs light frost scrim on dark-ink chapters).
