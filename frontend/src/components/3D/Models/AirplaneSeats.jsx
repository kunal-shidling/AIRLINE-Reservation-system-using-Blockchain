import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export function AirplaneSeats({ selectedSeats = [], onSeatClick = () => {} }) {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x += 0.002;
    }
  });

  // Create seat layout (6 seats per row, 8 rows)
  const rows = 8;
  const seatsPerRow = 6;
  const seatWidth = 0.4;
  const seatHeight = 0.4;
  const rowSpacing = 0.6;
  const seatSpacing = 0.5;

  const seats = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < seatsPerRow; col++) {
      const seatId = `${String.fromCharCode(65 + row)}${col + 1}`;
      const x = (col - seatsPerRow / 2 + 0.5) * seatSpacing;
      const y = 0;
      const z = (row - rows / 2 + 0.5) * rowSpacing;

      const isSelected = selectedSeats.includes(seatId);

      seats.push({
        id: seatId,
        position: [x, y, z],
        isSelected,
        row,
        col,
      });
    }
  }

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Fuselage (airplane body outline) */}
      <mesh position={[0, -1, 0]}>
        <boxGeometry args={[4, 0.1, 6]} />
        <meshStandardMaterial color="#444444" metalness={0.5} />
      </mesh>

      {/* Seats */}
      {seats.map((seat) => (
        <group
          key={seat.id}
          position={seat.position}
          onClick={() => onSeatClick(seat.id)}
        >
          {/* Seat back */}
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[seatWidth, 0.3, 0.2]} />
            <meshStandardMaterial
              color={seat.isSelected ? '#4caf50' : '#ff6b6b'}
              emissive={seat.isSelected ? '#2d7a3d' : '#cc2020'}
              emissiveIntensity={0.3}
              metalness={0.4}
            />
          </mesh>

          {/* Seat bottom */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[seatWidth, 0.15, seatHeight]} />
            <meshStandardMaterial
              color={seat.isSelected ? '#4caf50' : '#ff6b6b'}
              emissive={seat.isSelected ? '#2d7a3d' : '#cc2020'}
              emissiveIntensity={0.3}
              metalness={0.4}
            />
          </mesh>

          {/* Seat padding highlight */}
          {seat.isSelected && (
            <mesh position={[0, 0.05, 0]}>
              <boxGeometry args={[seatWidth * 0.8, 0.08, seatHeight * 0.8]} />
              <meshStandardMaterial
                color="#66bb6a"
                emissiveIntensity={0.5}
                transparent
                opacity={0.6}
              />
            </mesh>
          )}
        </group>
      ))}

      {/* Seat Labels */}
      {seats.map((seat) => (
        <mesh key={`label-${seat.id}`} position={[seat.position[0], seat.position[1] + 0.7, seat.position[2]]}>
          <planeGeometry args={[0.3, 0.2]} />
          <meshStandardMaterial color="transparent" />
        </mesh>
      ))}
    </group>
  );
}
