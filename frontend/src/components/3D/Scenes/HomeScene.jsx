import React, { memo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei';
import { Airplane } from '../Models/Airplane';

function HomeSceneComponent() {
  return (
    <div
      style={{
        width: '100%',
        height: '600px',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}
    >
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        {/* Camera */}
        <PerspectiveCamera makeDefault position={[3, 2, 5]} />

        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1.2} />
        <pointLight position={[-5, -5, 5]} intensity={0.5} color="#ff0000" />
        <pointLight position={[5, -5, -5]} intensity={0.5} color="#00ff00" />

        {/* 3D Models */}
        <Airplane />

        {/* Text in 3D Space */}
        <Text position={[0, -3, 0]} fontSize={0.8} color="white">
          ✈️ Welcome to JetAirline
        </Text>

        {/* Background */}
        <color attach="background" args={['#0A0A0A']} />

        {/* Controls - allows mouse interaction */}
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          autoRotate={true}
          autoRotateSpeed={2}
        />
      </Canvas>
    </div>
  );
}

export const HomeScene = memo(HomeSceneComponent);
