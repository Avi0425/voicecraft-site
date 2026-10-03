"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function Waveform({ count = 48 }: { count?: number }) {
  const ref = useRef<THREE.Group>(null);
  const bars = useMemo(() => Array.from({ length: count }, (_, i) => ({ i, x: (i - count / 2) * 0.22 })), [count]);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.children.forEach((c, i) => {
      const h = 0.6 + Math.sin(t * 1.6 + i * 0.35) * 0.5 + Math.cos(t * 0.9 + i * 0.2) * 0.3;
      (c as THREE.Mesh).scale.y = Math.max(0.15, h * 2.2);
      const mat = (c as THREE.Mesh).material as THREE.MeshStandardMaterial;
      const intensity = 0.5 + h * 0.3;
      mat.emissiveIntensity = intensity;
    });
  });
  return (
    <group ref={ref}>
      {bars.map((b) => (
        <mesh key={b.i} position={[b.x, 0, 0]}>
          <boxGeometry args={[0.11, 1, 0.11]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.6} roughness={0.3} metalness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

function Orb() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.25;
    ref.current.rotation.x = Math.sin(t * 0.3) * 0.15;
  });
  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[1.35, 2]} />
        <meshStandardMaterial color="#1a1a1e" emissive="#f59e0b" emissiveIntensity={0.12} wireframe transparent opacity={0.9} />
      </mesh>
      <mesh scale={0.92}>
        <icosahedronGeometry args={[1.35, 3]} />
        <meshStandardMaterial color="#f59e0b" transparent opacity={0.08} wireframe={false} roughness={0.4} />
      </mesh>
    </Float>
  );
}

function Particles({ count = 140 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
    }
    return arr;
  }, [count]);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.03;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#f59e0b" transparent opacity={0.55} sizeAttenuation />
    </points>
  );
}

export default function Scene({ variant = "hero" }: { variant?: "hero" | "orb" }) {
  return (
    <Canvas dpr={[1, 1.8]} gl={{ antialias: true, alpha: true }} style={{ background: "transparent" }}>
      <PerspectiveCamera makeDefault position={variant === "hero" ? [0, 0.6, 8] : [0, 0, 5.5]} fov={38} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 3]} intensity={1.2} color="#fff7ed" />
      <pointLight position={[-3, 2, 4]} intensity={1.5} color="#f59e0b" distance={12} />
      <pointLight position={[3, -2, -2]} intensity={0.8} color="#38bdf8" distance={10} />
      {variant === "hero" ? (
        <group position={[0, -0.9, 0]}>
          <Waveform />
          <Particles count={110} />
        </group>
      ) : (
        <>
          <Orb />
          <Particles count={80} />
        </>
      )}
      <fog attach="fog" args={["#08080a", 6, 14]} />
    </Canvas>
  );
}
