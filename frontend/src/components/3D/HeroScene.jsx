import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PresentationControls, Environment } from '@react-three/drei';
import { Mesh, MeshStandardMaterial } from 'three';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Simple 3D Airplane Model
const AirplaneModel = () => {
  const groupRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (groupRef.current) {
        gsap.to(groupRef.current.rotation, {
          scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom center',
            scrub: 1,
          },
          x: Math.PI * 2,
          y: Math.PI * 0.5,
          duration: 2,
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <group ref={groupRef}>
      {/* Fuselage */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.3, 2, 4, 8]} />
        <meshStandardMaterial
          color="#D4AF37"
          metalness={0.9}
          roughness={0.1}
          emissive="#F4D03F"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Wings */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4, 0.2, 0.5]} />
        <meshStandardMaterial
          color="#A78BFA"
          metalness={0.8}
          roughness={0.15}
        />
      </mesh>

      {/* Tail Wing */}
      <mesh position={[0, 0.3, 1.2]}>
        <boxGeometry args={[1.5, 0.15, 0.4]} />
        <meshStandardMaterial
          color="#00D9FF"
          metalness={0.85}
          roughness={0.12}
          emissive="#00D9FF"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Cockpit */}
      <mesh position={[0, 0.4, -0.8]}>
        <sphereGeometry args={[0.25, 8, 8]} />
        <meshStandardMaterial
          color="#00D9FF"
          metalness={1}
          roughness={0.05}
        />
      </mesh>
    </group>
  );
};

const HeroScene = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 35 }}
      style={{ width: '100%', height: '100%' }}
    >
      <Environment preset="city" />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} color="#00D9FF" />

      <PresentationControls
        speed={1.5}
        global
        zoom={1}
        rotation={[0.13, 0.1, 0]}
      >
        <Float speed={4} rotationIntensity={1} floatIntensity={2}>
          <AirplaneModel />
        </Float>
      </PresentationControls>
    </Canvas>
  );
};

export default HeroScene;
