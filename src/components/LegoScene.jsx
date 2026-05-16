import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import LegoBrick from './LegoBrick.jsx';
import LegoMinifig from './LegoMinifig.jsx';

// Pedestal at x=3.5 (right-center), extends x≈2.54–4.46.
const PEDESTAL_DEFS = [
  { id: 'ped1a', color: '#1e3a5f', position: [3.5, -3.2, 0], studCols: 2, studRows: 2, startFixed: true },
  { id: 'ped2a', color: '#3B82F6', position: [3.5, -2.6, 0], studCols: 2, studRows: 2, startFixed: true },
];

// 4 bricks spaced ≥2.2 units apart in x — no physics pile-ups.
// Left of pedestal (right edges ≤2.36): x = -3.0, -0.8, 1.4
// Right of pedestal (left edge ≥4.54):  x = 5.5
const BRICK_DEFS = [
  { id: 'b1', color: '#1A1A2E', position: [-3.0, -3.2,  0.2], studCols: 2, studRows: 2 },
  { id: 'b2', color: '#F97316', position: [-0.8, -3.2, -0.3], studCols: 2, studRows: 2 },
  { id: 'b3', color: '#EAB308', position: [ 1.4, -3.2,  0.5], studCols: 2, studRows: 2 },
  { id: 'b4', color: '#22C55E', position: [ 5.5, -3.2, -0.2], studCols: 2, studRows: 2 },
];

function Scene({ dropZoneRef, onBrickSnapped, minifigState, onTogglePanel }) {
  const [snappedIds, setSnappedIds] = useState(new Set());

  const handleSnap = (id) => {
    setSnappedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    onBrickSnapped?.();
  };

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 7.5]} fov={55} />

      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]}  intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-3, 3, -2]} intensity={0.45} color="#b8ccff" />
      <directionalLight position={[0, -2, 4]}  intensity={0.2}  color="#fff8f0" />
      <Environment preset="city" />

      <Physics gravity={[0, -9.81, 0]} timeStep="vary">

        {PEDESTAL_DEFS.map((def) => (
          <LegoBrick
            key={def.id}
            {...def}
            dropZoneRef={dropZoneRef}
            onSnap={handleSnap}
          />
        ))}

        {BRICK_DEFS.map((def) => (
          <LegoBrick
            key={def.id}
            {...def}
            dropZoneRef={dropZoneRef}
            onSnap={handleSnap}
          />
        ))}

        <LegoMinifig
          position={[3.5, -0.05, 0]}
          {...minifigState}
          onTogglePanel={onTogglePanel}
        />

        {/* ── Invisible boundary walls ─────────────────────────────────────────
            Camera z=7.5, fov=55° → frustum half-width ≈6.94 at z=0.
            Walls at ±6.5: brick edges (half-width 0.96) cap at ±6.46, inside frustum. */}

        {/* Floor */}
        <RigidBody type="fixed" position={[0, -3.6, 0]}>
          <CuboidCollider args={[20, 0.1, 10]} />
        </RigidBody>

        {/* Ceiling */}
        <RigidBody type="fixed" position={[0, 4.0, 0]}>
          <CuboidCollider args={[20, 0.1, 10]} />
        </RigidBody>

        {/* Left wall */}
        <RigidBody type="fixed" position={[-6.5, 0, 0]}>
          <CuboidCollider args={[0.1, 12, 10]} />
        </RigidBody>

        {/* Right wall */}
        <RigidBody type="fixed" position={[6.5, 0, 0]}>
          <CuboidCollider args={[0.1, 12, 10]} />
        </RigidBody>

        {/* Front slab (toward camera) */}
        <RigidBody type="fixed" position={[0, 0, 1.5]}>
          <CuboidCollider args={[20, 12, 0.1]} />
        </RigidBody>

        {/* Back slab */}
        <RigidBody type="fixed" position={[0, 0, -1.5]}>
          <CuboidCollider args={[20, 12, 0.1]} />
        </RigidBody>

      </Physics>
    </>
  );
}

export default function LegoScene({ dropZoneRef, onBrickSnapped, minifigState, onTogglePanel }) {
  return (
    <Canvas
      shadows
      style={{ position: 'absolute', inset: 0, zIndex: 1 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Scene
        dropZoneRef={dropZoneRef}
        onBrickSnapped={onBrickSnapped}
        minifigState={minifigState}
        onTogglePanel={onTogglePanel}
      />
    </Canvas>
  );
}
