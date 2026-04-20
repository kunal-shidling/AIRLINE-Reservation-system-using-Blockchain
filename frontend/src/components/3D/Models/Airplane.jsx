import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export function Airplane() {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
      groupRef.current.position.y = Math.sin(Date.now() * 0.0008) * 0.8;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={1.5}>
      {/* Main Fuselage (Body) */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 3, 32]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Nose Cone */}
      <mesh position={[1.6, 0, 0]}>
        <coneGeometry args={[0.35, 0.6, 32]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#b0b0b0" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Cockpit Window */}
      <mesh position={[1.2, 0.2, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#4da6ff" metalness={0.8} roughness={0.1} transparent opacity={0.7} />
      </mesh>

      {/* Main Wings */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[5.5, 0.15, 1.2]} />
        <meshStandardMaterial color="#a8a8a8" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Left Engine */}
      <mesh position={[-1, 0.5, -0.7]}>
        <cylinderGeometry args={[0.25, 0.25, 1.2, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#333333" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Right Engine */}
      <mesh position={[1, 0.5, -0.7]}>
        <cylinderGeometry args={[0.25, 0.25, 1.2, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#333333" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Left Engine Front */}
      <mesh position={[-1, 0.5, -1.2]}>
        <cylinderGeometry args={[0.3, 0.28, 0.3, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#ff6b35" metalness={0.7} roughness={0.25} />
      </mesh>

      {/* Right Engine Front */}
      <mesh position={[1, 0.5, -1.2]}>
        <cylinderGeometry args={[0.3, 0.28, 0.3, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#ff6b35" metalness={0.7} roughness={0.25} />
      </mesh>

      {/* Tail Fin */}
      <mesh position={[-1.5, 0.6, 0]}>
        <boxGeometry args={[0.15, 1.2, 0.8]} />
        <meshStandardMaterial color="#a8a8a8" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Horizontal Stabilizer Wings */}
      <mesh position={[-1.6, 0.2, 0]}>
        <boxGeometry args={[0.15, 0.1, 1.5]} />
        <meshStandardMaterial color="#a8a8a8" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Landing Gear - Front */}
      <mesh position={[0.3, -0.35, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.5, 8]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Landing Gear - Left */}
      <mesh position={[-0.8, -0.35, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.6, 8]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Landing Gear - Right */}
      <mesh position={[0.8, -0.35, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.6, 8]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Accent Stripe */}
      <mesh position={[0, 0.05, 0.5]}>
        <boxGeometry args={[3.5, 0.05, 0.2]} />
        <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.2} />
      </mesh>
    </group>
  );
}
