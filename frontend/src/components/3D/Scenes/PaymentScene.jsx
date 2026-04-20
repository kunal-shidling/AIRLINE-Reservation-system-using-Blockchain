import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei';

function PaymentCard() {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.008;
      groupRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Card Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3, 1.8, 0.1]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.9}
          roughness={0.1}
          emissive="#00ff88"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Card Shine */}
      <mesh position={[0, 0, 0.06]}>
        <boxGeometry args={[2.8, 1.6, 0.05]} />
        <meshStandardMaterial
          color="#00ff88"
          metalness={1}
          opacity={0.3}
          transparent
        />
      </mesh>

      {/* Chip */}
      <mesh position={[-1.2, -0.5, 0.15]}>
        <boxGeometry args={[0.5, 0.5, 0.2]} />
        <meshStandardMaterial color="#ffd700" metalness={0.9} />
      </mesh>

      {/* Text */}
      <Text position={[0, 0, 0.2]} fontSize={0.3} color="#00ff88">
        💳 Secure Payment
      </Text>
    </group>
  );
}

function FloatingCoin({ index, angle, radius }) {
  const coinRef = useRef();

  useFrame(({ clock }) => {
    if (coinRef.current) {
      const t = clock.getElapsedTime();
      coinRef.current.position.x = Math.cos(angle + t * 0.5) * radius;
      coinRef.current.position.z = Math.sin(angle + t * 0.5) * radius;
      coinRef.current.rotation.y += 0.05;
    }
  });

  return (
    <group ref={coinRef} position={[0, 0, 0]}>
      <mesh>
        <cylinderGeometry args={[0.4, 0.4, 0.1, 32]} />
        <meshStandardMaterial
          color={index % 2 === 0 ? '#ffd700' : '#ffed4e'}
          metalness={0.95}
          roughness={0.05}
        />
      </mesh>
      <Text position={[0, 0, 0.1]} fontSize={0.2} color="#000">
        ₹
      </Text>
    </group>
  );
}

function CheckmarkAnimation() {
  const circleRef = useRef();

  useFrame(({ clock }) => {
    if (circleRef.current) {
      circleRef.current.scale.x = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.1;
      circleRef.current.scale.y = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.1;
    }
  });

  return (
    <group position={[0, 2.5, 0]}>
      <mesh ref={circleRef}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color="#00ff00"
          emissive="#00aa00"
          emissiveIntensity={0.5}
          metalness={0.6}
        />
      </mesh>
      <Text position={[0, 0, 0.8]} fontSize={0.6} color="white">
        ✓
      </Text>
    </group>
  );
}

export function PaymentScene() {
  const coins = Array.from({ length: 5 }).map((_, i) => {
    const angle = (i / 5) * Math.PI * 2;
    const radius = 3;
    return <FloatingCoin key={i} index={i} angle={angle} radius={radius} />;
  });

  return (
    <div
      style={{
        width: '100%',
        height: '400px',
        borderRadius: '10px',
        overflow: 'hidden',
        marginBottom: '20px',
      }}
    >
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-5, 5, 5]} intensity={0.6} color="#00ff88" />
        <pointLight position={[5, -5, 5]} intensity={0.6} color="#ff0088" />

        {/* 3D Elements */}
        <PaymentCard />
        {coins}
        <CheckmarkAnimation />

        {/* Background */}
        <color attach="background" args={['#0a0e27']} />

        {/* Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={true}
          autoRotateSpeed={1}
        />
      </Canvas>
    </div>
  );
}
