/**
 * ASURA UNIVERSAL MASTER PROMPT ENGINE
 * Origin: Instagram Architecture Masterclass (@enrriquesdesign & Google Flow)
 * Purpose: Two-stage universal prompting workflow for generating photorealistic visual keyframes
 *          and cinematic 3D camera video motion vectors.
 */

class UniversalPromptEngine {
  /**
   * STAGE 1: Universal Master Prompt for Photorealistic 8K Visuals
   */
  static generateVisualMasterPrompt(niche, brand, subjectDetails) {
    const subjects = {
      automotive: {
        subject: `Sculpted Ferrari SF90 Stradale hypercar in metallic Rosso Corsa with exposed carbon-fiber aerodynamic aero-bridges and titanium exhaust`,
        setting: `Inside a dark high-tech wind tunnel chamber with glowing cyan velocity air streams and wet reflective epoxy tarmac`,
        lighting: `Anamorphic rim lighting, volumetric laser scanlines, ray-traced global illumination, octane render 8K, Unreal Engine 5.4 Lumen`,
        optics: `35mm anamorphic lens, f/1.4 shallow depth of field, natural motion blur, cinematic horizontal flares`,
        grading: `High-contrast DaVinci Resolve filmic color grade, deep obsidian shadows, saturated crimson specular highlights`
      },
      architecture: {
        subject: `Valaïs Alpine Monolith luxury villa cantilevered over the Zermatt cliff with 18m floor-to-ceiling panoramic glass pavilion`,
        setting: `Snow-dusted Swiss alpine mountain summit at golden hour with dramatic Matterhorn peaks in the background and heated infinity pool steaming into cold air`,
        lighting: `Warm golden hour raking sunlight, architectural interior warm 2700K recessed glow, soft atmospheric mountain haze`,
        optics: `24mm tilt-shift architectural lens, perfect vertical lines, Hasselblad medium format 100MP clarity`,
        grading: `Architectural Digest editorial aesthetic, natural linen and raw granite texture grading, deep atmospheric contrast`
      },
      watch: {
        subject: `Haute Horlogerie Grand Tourbillon calibre with multi-axis titanium flying tourbillon cage, 24K rose gold bridges, and flame-blued screws`,
        setting: `Macro watchmaker bench with antique brass instruments, sapphire crystal reflection, and hand-turned barleycorn guilloché dial blank`,
        lighting: `Micro-studio diffused softbox lighting with pinpoint fiber-optic specular highlights catching diamond-polished anglage bevels`,
        optics: `100mm macro f/2.8 lens, extreme close-up showing Côtes de Genève stripes and ruby jewel pivots, razor-thin focal plane`,
        grading: `Geneva prestige atelier luxury palette, warm champagne gold and deep midnight sapphire tones`
      },
      cafe: {
        subject: `Traditional South Indian brass filter with slow-dripping thick dark espresso decoction into a frothing brass dabarah tumbler with bubbling pure A2 ghee foam`,
        setting: `Heirloom heritage roastery hearth with terracotta stone walls, burlap bags of single-origin Chikmagalur coffee beans, and roasted steam rising`,
        lighting: `Warm fire hearth lighting, directional shaft of morning sunlight catching rising aromatic steam plumes`,
        optics: `50mm f/1.2 prime lens, rich creamy bokeh, organic steam particulate illumination`,
        grading: `Rich roasted coffee tones, deep amber caramel, burnt terracotta, and warm oat cream palette`
      }
    };

    const s = subjects[niche] || subjects.automotive;
    return `[SUBJECT]: ${subjectDetails || s.subject} for ${brand}. [ENVIRONMENT]: ${s.setting}. [LIGHTING & ENGINE]: ${s.lighting}. [CAMERA & OPTICS]: ${s.optics}. [COLOR GRADE & TEXTURE]: ${s.grading}. --ar 16:9 --v 6.1 --style raw --q 2`;
  }

  /**
   * STAGE 2: Universal Master Prompt for 3D Video & Camera Motion (Runway / Luma / Sora / Google Flow)
   */
  static generateVideoMotionMasterPrompt(niche, brand) {
    const motions = {
      automotive: {
        vector: `Camera begins in front three-quarter dynamic low angle, smoothly tracking backward at 1.2m/s as the Ferrari accelerates forward, rotating around the side profile into a dramatic high-speed straight tracking shot`,
        dynamics: `Carbon aerodynamic wheels spinning with motion blur, active rear airbrake deploying, cyan aerodynamic wind tunnel streamlines curving over the curves of the chassis, exhaust heat wave distortion`,
        speedRamp: `Starts at 24fps cinematic realtime, slows down to 120fps ultra slow-motion as the car passes the camera, then ramps back into full speed`
      },
      architecture: {
        vector: `Smooth continuous FPV drone dolly push forward starting high above the exterior alpine monolith roofline, gliding seamlessly down through the open floor-to-ceiling glass doors into the cantilever living room`,
        dynamics: `Atmospheric mountain mist parting, gentle water ripples in the horizon infinity pool, curtains undulating softly in alpine breeze`,
        speedRamp: `Fluid constant 0.6m/s contemplative glide with zero sudden jerks, giving a living sense of scale and breathing space`
      },
      watch: {
        vector: `Extreme macro rotational orbit 360 degrees around the beating flying tourbillon cage, pushing into the balance wheel spring as it contracts and expands`,
        dynamics: `Balance wheel oscillating at high frequency 28,800 VPH, epicyclic gear teeth interlocking in fluid mechanical harmony, light glinting across diamond-beveled edges`,
        speedRamp: `Slow, hypnotic 0.2x speed ramp catching individual ticks of the Swiss lever escapement`
      },
      cafe: {
        vector: `Slow cinematic downward tracking shot following a single glistening drop of decoction falling from the brass filter into the golden foam below`,
        dynamics: `Steam plumes curling upward in turbulent organic spirals, coffee foam rippling outward in concentric circles, golden sunlight refracting through the steam`,
        speedRamp: `1000fps phantom slow-motion on the droplet collision, creating liquid crown splash with velvety foam texture`
      }
    };

    const m = motions[niche] || motions.automotive;
    return `[MOTION VECTOR]: ${m.vector}. [TEMPORAL DYNAMICS]: ${m.dynamics}. [SPEED RAMP & FPS]: ${m.speedRamp}. [CAMERA RIG]: Technocrane on gyroscopic Steadicam track, smooth cinematic stabilization.`;
  }
}

module.exports = UniversalPromptEngine;
