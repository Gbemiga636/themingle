"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

function Rings() {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.18;
    ref.current.rotation.x = Math.sin(t * 0.25) * 0.25;
  });
  return (
    <group ref={ref}>
      <mesh rotation={[0.5, 0.2, 0.2]}>
        <torusGeometry args={[1.2, 0.014, 12, 64]} />
        <meshStandardMaterial color="#e4d3bc" metalness={0.82} roughness={0.28} />
      </mesh>
      <mesh rotation={[1.1, 0.4, 0.5]}>
        <torusGeometry args={[0.78, 0.01, 12, 64]} />
        <meshStandardMaterial color="#a68456" metalness={0.9} roughness={0.22} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.34, 28, 28]} />
        <meshStandardMaterial color="#f3eee6" transparent opacity={0.16} roughness={0.08} metalness={0.05} />
      </mesh>
    </group>
  );
}

export default function HeroCanvas() {
  return (
    <Canvas camera={{ position: [0, 0, 3.4], fov: 35 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={0.55} />
      <directionalLight position={[2, 2, 3]} intensity={1.5} color="#f3eee6" />
      <pointLight position={[-2, -1, 2]} intensity={3} color="#72283a" />
      <Rings />
    </Canvas>
  );
}
