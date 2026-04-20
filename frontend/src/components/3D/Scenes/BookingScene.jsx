import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei';

function AnimatedBookingBox() {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.008;
      meshRef.current.position.y = Math.sin(Date.now() * 0.002) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial
        color="#ff6b6b"
        metalness={0.7}
        roughness={0.3}
        emissive="#ff2020"
      />
    </mesh>
  );
}

export function BookingScene() {
  return (
    <div style={{
      width: '100%',
      height: '500px',
      borderRadius: '10px',
      overflow: 'hidden',
      marginBottom: '20px'
    }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, 5]} intensity={0.6} color="#ff00ff" />

        <AnimatedBookingBox />

        <Text position={[0, -3, 0]} fontSize={0.9} color="white">
          📅 Book Your Flight
        </Text>

        <color attach="background" args={['#1a1a2e']} />
        <OrbitControls autoRotate autoRotateSpeed={3} />
      </Canvas>
    </div>
  );
}
