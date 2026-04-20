import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei';
import { AirplaneSeats } from '../Models/AirplaneSeats';

export function SeatSelectionScene({ onSeatsSelected = () => {}, selectedSeats = [] }) {
  const [localSelectedSeats, setLocalSelectedSeats] = useState(selectedSeats);

  const handleSeatClick = (seatId) => {
    setLocalSelectedSeats((prevSeats) => {
      if (prevSeats.includes(seatId)) {
        return prevSeats.filter((s) => s !== seatId);
      } else {
        return [...prevSeats, seatId];
      }
    });
  };

  const handleConfirm = () => {
    onSeatsSelected(localSelectedSeats);
  };

  return (
    <div style={{ width: '100%', marginBottom: '20px' }}>
      {/* 3D Canvas */}
      <div
        style={{
          width: '100%',
          height: '500px',
          borderRadius: '10px',
          overflow: 'hidden',
          marginBottom: '15px',
          border: '2px solid #ddd',
        }}
      >
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 2, 5]} />
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 10, 5]} intensity={1} />
          <pointLight position={[-5, 5, 5]} intensity={0.5} color="#ff6b6b" />
          <pointLight position={[5, -5, 5]} intensity={0.5} color="#4caf50" />

          {/* Airplane Seats */}
          <AirplaneSeats
            selectedSeats={localSelectedSeats}
            onSeatClick={handleSeatClick}
          />

          {/* Instructions */}
          <Text position={[0, 3.5, 0]} fontSize={0.6} color="white">
            Click to select seats
          </Text>

          {/* Background */}
          <color attach="background" args={['#1a1a2e']} />

          {/* Controls */}
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            autoRotate={false}
          />
        </Canvas>
      </div>

      {/* Seat Selection Info */}
      <div
        style={{
          background: '#f8f9fa',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '15px',
          border: '1px solid #dee2e6',
        }}
      >
        <h4 style={{ margin: '0 0 10px 0' }}>Seat Selection Summary</h4>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
          <div>
            <span
              style={{
                display: 'inline-block',
                width: '20px',
                height: '20px',
                background: '#ff6b6b',
                marginRight: '8px',
                borderRadius: '4px',
              }}
            ></span>
            <span>Available</span>
          </div>
          <div>
            <span
              style={{
                display: 'inline-block',
                width: '20px',
                height: '20px',
                background: '#4caf50',
                marginRight: '8px',
                borderRadius: '4px',
              }}
            ></span>
            <span>Selected ({localSelectedSeats.length})</span>
          </div>
        </div>

        {localSelectedSeats.length > 0 && (
          <div style={{ marginBottom: '15px' }}>
            <strong>Selected Seats:</strong>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginTop: '8px',
              }}
            >
              {localSelectedSeats.map((seat) => (
                <span
                  key={seat}
                  style={{
                    background: '#4caf50',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                  }}
                >
                  {seat}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleConfirm}
          style={{
            background: '#007bff',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '100%',
            fontSize: '1rem',
            fontWeight: 'bold',
          }}
          disabled={localSelectedSeats.length === 0}
        >
          {localSelectedSeats.length > 0
            ? `Confirm ${localSelectedSeats.length} Seat(s)`
            : 'Select at least 1 seat'}
        </button>
      </div>
    </div>
  );
}
