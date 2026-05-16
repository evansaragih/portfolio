import { useRef, useMemo, useCallback, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';

const BodyType = { Dynamic: 0, Fixed: 1, KinematicPositionBased: 2 };

const STUD_R = 0.18;
const STUD_H = 0.12;
const BRICK_H = 0.48;

export default function LegoBrick({ id, color, position, studCols = 2, studRows = 2, label, onSnap, dropZoneRef, startFixed = false }) {
  const rbRef = useRef(null);
  const grabbed = useRef(false);
  const releasedRef = useRef(!startFixed);
  const [isGrabbed, setIsGrabbed] = useState(false);
  const dragPlaneZ = useRef(0);
  const targetPos = useRef(null);
  const moveListenerRef = useRef(null);
  const { camera, gl } = useThree();

  useEffect(() => {
    if (!startFixed || !rbRef.current) return;
    rbRef.current.setBodyType(BodyType.Fixed, true);
  }, [startFixed]);

  const brickW = studCols * 0.96;
  const brickD = studRows * 0.96;
  const color3 = useMemo(() => new THREE.Color(color), [color]);

  const getWorldPos = useCallback((cx, cy, planeZ) => {
    const rect = gl.domElement.getBoundingClientRect();
    const nx = ((cx - rect.left) / rect.width) * 2 - 1;
    const ny = -((cy - rect.top) / rect.height) * 2 + 1;
    const ray = new THREE.Raycaster();
    ray.setFromCamera({ x: nx, y: ny }, camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -planeZ);
    const pt = new THREE.Vector3();
    return ray.ray.intersectPlane(plane, pt) ? pt : null;
  }, [camera, gl]);

  const isOverDropZone = useCallback((cx, cy) => {
    if (!dropZoneRef?.current) return false;
    const r = dropZoneRef.current.getBoundingClientRect();
    return cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom;
  }, [dropZoneRef]);

  // Follow cursor every frame + subtle float when grabbed
  useFrame(() => {
    if (!grabbed.current || !rbRef.current || !targetPos.current) return;
    const t = performance.now() * 0.002;
    rbRef.current.setNextKinematicTranslation({
      x: targetPos.current.x,
      y: targetPos.current.y + Math.sin(t) * 0.06,
      z: dragPlaneZ.current,
    });
  });

  // Cleanup on unmount
  useEffect(() => () => {
    if (moveListenerRef.current) window.removeEventListener('pointermove', moveListenerRef.current);
  }, []);

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    if (!rbRef.current) return;

    // First click on a pedestal brick: break it free, don't grab yet
    if (!releasedRef.current) {
      releasedRef.current = true;
      rbRef.current.setBodyType(BodyType.Dynamic, true);
      return;
    }

    if (!grabbed.current) {
      // ── GRAB ──
      grabbed.current = true;
      setIsGrabbed(true);

      const pos = rbRef.current.translation();
      dragPlaneZ.current = pos.z;
      targetPos.current = { x: pos.x, y: pos.y };

      rbRef.current.setBodyType(BodyType.KinematicPositionBased, true);
      rbRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rbRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);

      const onMove = (ev) => {
        const world = getWorldPos(ev.clientX, ev.clientY, dragPlaneZ.current);
        if (world) targetPos.current = { x: world.x, y: world.y };
      };
      moveListenerRef.current = onMove;
      window.addEventListener('pointermove', onMove);
    } else {
      // ── DROP ──
      grabbed.current = false;
      setIsGrabbed(false);

      if (moveListenerRef.current) {
        window.removeEventListener('pointermove', moveListenerRef.current);
        moveListenerRef.current = null;
      }

      // Check drop zone using event position
      const clientX = e.clientX ?? e.nativeEvent?.clientX ?? 0;
      const clientY = e.clientY ?? e.nativeEvent?.clientY ?? 0;

      if (isOverDropZone(clientX, clientY)) {
        rbRef.current.setBodyType(BodyType.Fixed, true);
        rbRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
        onSnap?.(id);
        return;
      }

      rbRef.current.setBodyType(BodyType.Dynamic, true);
    }
  }, [getWorldPos, id, isOverDropZone, onSnap]);

  return (
    <RigidBody
      ref={rbRef}
      position={position}
      colliders={false}
      restitution={0.12}
      friction={0.7}
      linearDamping={0.55}
      angularDamping={0.6}
    >
      <CuboidCollider args={[brickW / 2, (BRICK_H + STUD_H) / 2, brickD / 2]} />

      <group
        onClick={handleClick}
        style={{ cursor: isGrabbed ? 'grabbing' : 'grab' }}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[brickW, BRICK_H, brickD]} />
          <meshStandardMaterial
            color={color3}
            roughness={0.38}
            metalness={0.04}
            emissive={color3}
            emissiveIntensity={isGrabbed ? 0.25 : 0}
          />
        </mesh>

        {Array.from({ length: studCols }, (_, ci) =>
          Array.from({ length: studRows }, (_, ri) => {
            const sx = -brickW / 2 + (ci + 0.5) * (brickW / studCols);
            const sz = -brickD / 2 + (ri + 0.5) * (brickD / studRows);
            return (
              <mesh key={`${ci}-${ri}`} position={[sx, BRICK_H / 2 + STUD_H / 2, sz]} castShadow>
                <cylinderGeometry args={[STUD_R, STUD_R, STUD_H, 16]} />
                <meshStandardMaterial
                  color={color3}
                  roughness={0.38}
                  metalness={0.04}
                  emissive={color3}
                  emissiveIntensity={isGrabbed ? 0.25 : 0}
                />
              </mesh>
            );
          })
        )}

        {label && (
          <Text
            position={[0, BRICK_H / 2 + 0.01, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.2}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            {label}
          </Text>
        )}
      </group>
    </RigidBody>
  );
}
