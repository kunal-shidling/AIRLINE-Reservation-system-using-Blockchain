import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export function Globe() {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshPhongMaterial
        color="#4a90e2"
        emissive="#1a3a5c"
        shininess={100}
        wireframe={false}
      />
    </mesh>
  );
}
