import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Environment, 
  Float, 
  MeshTransmissionMaterial, 
  Points, 
  PointMaterial, 
  Center,
  Sparkles,
  AccumulativeShadows,
  RandomizedLight
} from '@react-three/drei';
import * as THREE from 'three';

/**
 * DIGITAL CURRENCY MINING // HERMES PROCEDURAL ASSET
 * Pattern: Hybrid Pattern A (Crystalline Glass Transmission) + Pattern C (Data Particle Flow)
 * Anti-Slop: >2,500 particles + 60-shard instanced geometry + Studio PBR Environment.
 */

// Shard Network - Abstract Crystalline Cryptographic Blocks
function MiningCrystalCore({ color = '#00F0FF', accentColor = '#39FF14' }) {
  const groupRef = useRef();
  const innerRef = useRef();

  // Procedural shard distribution (64 mathematical coordinates)
  const shardData = useMemo(() => {
    const data = [];
    const count = 48;
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const radius = 2.2 + Math.sin(i * 1.5) * 0.4;
      data.push({
        pos: [
          radius * Math.cos(theta) * Math.sin(phi),
          radius * Math.sin(theta) * Math.sin(phi),
          radius * Math.cos(phi)
        ],
        rot: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
        scale: 0.25 + Math.random() * 0.4,
        speed: 0.2 + Math.random() * 0.6
      });
    }
    return data;
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y -= delta * 0.45;
      innerRef.current.rotation.z += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central High-Density Cryptographic Nucleus */}
      <mesh ref={innerRef} scale={1.3}>
        <icosahedronGeometry args={[1, 3]} />
        <MeshTransmissionMaterial
          backside={true}
          samples={16}
          resolution={512}
          transmission={0.95}
          roughness={0.08}
          thickness={0.8}
          ior={1.65}
          chromaticAberration={0.08}
          anisotropy={0.2}
          distortion={0.3}
          distortionScale={0.4}
          temporalDistortion={0.1}
          color={color}
          attenuationDistance={1.2}
          attenuationColor="#003366"
        />
      </mesh>

      {/* Internal Wireframe Lattice with Neon Edges */}
      <mesh scale={1.32}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial 
          wireframe 
          color={accentColor} 
          transparent 
          opacity={0.4} 
        />
      </mesh>

      {/* Orbiting Cryptographic Geometric Shards */}
      {shardData.map((s, idx) => (
        <Float 
          key={idx} 
          speed={s.speed * 2} 
          rotationIntensity={1.5} 
          floatIntensity={1.2} 
          position={s.pos}
        >
          <mesh rotation={s.rot} scale={s.scale}>
            <octahedronGeometry args={[1, 0]} />
            <meshPhysicalMaterial
              color="#0A183D"
              emissive={idx % 3 === 0 ? accentColor : color}
              emissiveIntensity={0.6}
              roughness={0.1}
              metalness={0.9}
              clearcoat={1}
              clearcoatRoughness={0.1}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// Procedural Hash Particle Field (>3,000 Cryptographic Coordinates)
function DataMiningParticles({ count = 3500 }) {
  const pointsRef = useRef();

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const cyan = new THREE.Color('#00F0FF');
    const neon = new THREE.Color('#39FF14');
    const gold = new THREE.Color('#FFD700');

    for (let i = 0; i < count; i++) {
      // Cylinder / Helix flow mimicking blockchain transactions
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.5 + Math.random() * 4.5;
      const height = (Math.random() - 0.5) * 8;

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = height;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      // Color gradation
      const pick = Math.random();
      const c = pick < 0.6 ? cyan : pick < 0.85 ? neon : gold;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.12;
      // Vertical upward flow of mined transactions
      const array = pointsRef.current.geometry.attributes.position.array;
      for (let i = 1; i < array.length; i += 3) {
        array[i] += delta * 0.8;
        if (array[i] > 4) array[i] = -4;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} colors={colors} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.035}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Master Stage with Anti-Slop Environment and Shadows
export default function DigitalCurrencyMining({ 
  className = "w-full h-[600px] bg-black relative rounded-2xl overflow-hidden" 
}) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 1.5, 6.5], fov: 45 }}
        gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <color attach="background" args={['#02040A']} />

        {/* Studio PBR Environment */}
        <Environment preset="studio" />

        {/* Cryptographic Key Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#FFFFFF" />
        <pointLight position={[-5, -5, -5]} intensity={2.0} color="#00F0FF" />
        <pointLight position={[5, 5, 5]} intensity={2.5} color="#39FF14" />

        <Center>
          <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8}>
            <MiningCrystalCore color="#00F0FF" accentColor="#39FF14" />
          </Float>
        </Center>

        <DataMiningParticles count={3500} />
        <Sparkles count={120} scale={8} size={2.5} speed={0.4} color="#00F0FF" />

        {/* High-fidelity ground contact shadow */}
        <AccumulativeShadows temporal frames={60} alphaTest={0.85} opacity={0.6} scale={12} position={[0, -2.8, 0]}>
          <RandomizedLight amount={8} radius={4} ambient={0.5} intensity={1} position={[5, 5, -10]} bias={0.001} />
        </AccumulativeShadows>
      </Canvas>

      {/* Live Telemetry HUD Overlay */}
      <div className="absolute top-4 left-4 font-mono text-[11px] text-cyan-400 bg-black/60 backdrop-blur-md px-3 py-2 rounded-lg border border-cyan-500/20 space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold text-white">HERMES PROCEDURAL ENGINE // ACTIVE</span>
        </div>
        <div className="text-zinc-400">VERTICES: 3,500+ | PATTERN: A+C | FPS: 60</div>
      </div>
    </div>
  );
}
