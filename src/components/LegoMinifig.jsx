import { useRef, useMemo, useCallback, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';

const BodyType = { Dynamic: 0, Fixed: 1, KinematicPositionBased: 2 };
const SKIN = '#F5CBA7';
const S = 256; // canvas size

// ─── Face drawing (separates each layer so blinking can swap just the eyes) ──
function drawFace(ctx, expression, hasGlasses, isBlinking = false) {
  ctx.clearRect(0, 0, S, S);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';

  // Skin background
  ctx.fillStyle = SKIN;
  ctx.fillRect(0, 0, S, S);

  const cx = S / 2, cy = S / 2;

  // ── Cheeks (always visible) ──────────────────────────────────────
  if (expression !== 'cool') {
    ctx.fillStyle = '#e8a880';
    ctx.beginPath(); ctx.arc(cx - 80, cy + 12, 9, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 80, cy + 12, 9, 0, Math.PI * 2); ctx.fill();
  }

  // ── Eyes ─────────────────────────────────────────────────────────
  if (isBlinking && expression !== 'cool') {
    // Natural blink — smooth downward arc on each eye
    ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(cx - 67, cy - 22);
    ctx.quadraticCurveTo(cx - 50, cy - 10, cx - 33, cy - 22);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 33, cy - 22);
    ctx.quadraticCurveTo(cx + 50, cy - 10, cx + 67, cy - 22);
    ctx.stroke();
  } else if (expression === 'happy' || expression === 'wink') {
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath(); ctx.arc(cx - 50, cy - 22, 17, 0, Math.PI * 2); ctx.fill();
    if (expression === 'happy') {
      ctx.beginPath(); ctx.arc(cx + 50, cy - 22, 17, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = '#fff'; // eye highlights
    ctx.beginPath(); ctx.arc(cx - 43, cy - 29, 5, 0, Math.PI * 2); ctx.fill();
    if (expression === 'happy') {
      ctx.beginPath(); ctx.arc(cx + 57, cy - 29, 5, 0, Math.PI * 2); ctx.fill();
    }
    if (expression === 'wink') {
      // Right eye winking
      ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 9;
      ctx.beginPath(); ctx.arc(cx + 50, cy - 22, 17, Math.PI + 0.35, -0.35, true); ctx.stroke();
    }
  } else if (expression === 'surprised') {
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath(); ctx.arc(cx - 50, cy - 26, 23, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 50, cy - 26, 23, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(cx - 41, cy - 34, 7, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 59, cy - 34, 7, 0, Math.PI * 2); ctx.fill();
  } else if (expression === 'cool') {
    // Sunglasses (eyes hidden beneath lenses — drawn with the shades below)
  }

  // ── Eyebrows ─────────────────────────────────────────────────────
  if (expression === 'surprised' && !isBlinking) {
    ctx.strokeStyle = '#5a4a3a'; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(cx - 74, cy - 60); ctx.lineTo(cx - 26, cy - 72); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + 26, cy - 72); ctx.lineTo(cx + 74, cy - 60); ctx.stroke();
  } else if (expression !== 'cool' && !isBlinking) {
    ctx.strokeStyle = '#5a4a3a'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(cx - 68, cy - 50); ctx.lineTo(cx - 30, cy - 56); ctx.stroke();
    if (expression !== 'wink') {
      ctx.beginPath(); ctx.moveTo(cx + 30, cy - 56); ctx.lineTo(cx + 68, cy - 50); ctx.stroke();
    }
  }

  // ── Mouth ────────────────────────────────────────────────────────
  if (expression === 'happy' || expression === 'wink') {
    ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 10;
    ctx.beginPath(); ctx.arc(cx, cy + 32, 34, 0.18, Math.PI - 0.18); ctx.stroke();
  } else if (expression === 'surprised') {
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath(); ctx.arc(cx, cy + 42, 24, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#7b3f2a';
    ctx.beginPath(); ctx.arc(cx, cy + 42, 15, 0, Math.PI * 2); ctx.fill();
  } else if (expression === 'cool') {
    ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(cx - 30, cy + 48);
    ctx.bezierCurveTo(cx, cy + 66, cx + 42, cy + 58, cx + 52, cy + 38);
    ctx.stroke();
  }

  // ── Sunglasses (cool) ─────────────────────────────────────────────
  if (expression === 'cool') {
    function rr(x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }
    ctx.fillStyle = '#1a1a1a';
    rr(cx - 92, cy - 54, 68, 44, 8); ctx.fill();
    rr(cx + 24, cy - 54, 68, 44, 8); ctx.fill();
    ctx.fillRect(cx - 24, cy - 40, 48, 14);
    ctx.fillRect(cx - 130, cy - 42, 40, 10);
    ctx.fillRect(cx + 92, cy - 42, 40, 10);
  }

  // ── Round glasses overlay (happy + wink, on top of everything) ────
  if (hasGlasses && (expression === 'happy' || expression === 'wink')) {
    ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 10;
    ctx.beginPath(); ctx.arc(cx - 50, cy - 22, 28, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx + 50, cy - 22, 28, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(cx - 22, cy - 22); ctx.lineTo(cx + 22, cy - 22); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - 78, cy - 22); ctx.lineTo(cx - 118, cy - 20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + 78, cy - 22); ctx.lineTo(cx + 118, cy - 20); ctx.stroke();
  }
}

// ─── Hair pieces ──────────────────────────────────────────────────────────────
function HairWavy({ color }) {
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color, roughness: 0.65 }), [color]);
  return (
    <group position={[0, 1.88, 0]}>
      <mesh material={mat}><boxGeometry args={[1.48, 0.7, 1.38]} /></mesh>
      <mesh material={mat} position={[0, 0.38, 0.52]} rotation={[0.28, 0, 0]}>
        <boxGeometry args={[0.84, 0.48, 0.54]} />
      </mesh>
      <mesh material={mat} position={[-0.57, 0.13, 0.12]} rotation={[0, 0, -0.22]}>
        <boxGeometry args={[0.48, 0.8, 0.88]} />
      </mesh>
      <mesh material={mat} position={[0.57, 0.13, 0.12]} rotation={[0, 0, 0.22]}>
        <boxGeometry args={[0.48, 0.8, 0.88]} />
      </mesh>
      <mesh material={mat} position={[0, -0.04, -0.54]}>
        <boxGeometry args={[1.14, 0.62, 0.52]} />
      </mesh>
    </group>
  );
}

function HairSpiky({ color }) {
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color, roughness: 0.6 }), [color]);
  return (
    <group position={[0, 1.88, 0]}>
      <mesh material={mat}><boxGeometry args={[1.48, 0.5, 1.38]} /></mesh>
      {[[-0.46, 0.64, 0.14], [0, 0.84, 0.1], [0.46, 0.64, 0.14]].map(([x, y, z], i) => (
        <mesh key={i} material={mat} position={[x, y, z]}><coneGeometry args={[0.27, 0.72, 6]} /></mesh>
      ))}
    </group>
  );
}

function HairFlat({ color }) {
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color, roughness: 0.6 }), [color]);
  return (
    <group position={[0, 1.88, 0]}>
      <mesh material={mat}><boxGeometry args={[1.52, 0.36, 1.42]} /></mesh>
      <mesh material={mat} position={[0, 0.18, -0.54]}><boxGeometry args={[1.32, 0.6, 0.5]} /></mesh>
    </group>
  );
}

// ─── Limb pose cycles ─────────────────────────────────────────────────────────
const ARM_POSES = [0, -Math.PI / 2, -Math.PI * 0.85, Math.PI / 5];
const LEG_POSES = [0, Math.PI / 4, -Math.PI / 7];

function nextPose(poses, currentAngle) {
  const idx = poses.findIndex(a => Math.abs(a - currentAngle) < 0.15);
  return poses[(idx + 1) % poses.length];
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function LegoMinifig({
  position = [0, 0, 0],
  expression = 'happy',
  hasGlasses = true,
  torsoColor = '#1e3a5f',
  pantsColor = '#2d3748',
  hairColor = '#1a1a1a',
  hairStyle = 'wavy',
  onTogglePanel,
}) {
  const rbRef = useRef(null);
  const isDragging = useRef(false);
  const dragPlaneZ = useRef(0);
  const targetPos = useRef(null);
  const { camera, gl } = useThree();

  // Limb pivot refs
  const leftArmRef  = useRef(null);
  const rightArmRef = useRef(null);
  const leftLegRef  = useRef(null);
  const rightLegRef = useRef(null);
  const leftArmTarget  = useRef(0);
  const rightArmTarget = useRef(0);
  const leftLegTarget  = useRef(0);
  const rightLegTarget = useRef(0);

  // ── Persistent canvas + texture (never recreated) ──────────────────────────
  const faceCanvas = useMemo(() => {
    const cv = document.createElement('canvas');
    cv.width = S; cv.height = S;
    return cv;
  }, []);

  const faceTexture = useMemo(() => new THREE.CanvasTexture(faceCanvas), [faceCanvas]);
  useEffect(() => () => faceTexture.dispose(), [faceTexture]);

  // Redraw face whenever expression / glasses change
  useEffect(() => {
    drawFace(faceCanvas.getContext('2d'), expression, hasGlasses, false);
    faceTexture.needsUpdate = true;
  }, [expression, hasGlasses, faceCanvas, faceTexture]);

  // ── Blink loop ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (expression === 'cool') return; // shades cover eyes — no blink needed
    let tid;
    const ctx = faceCanvas.getContext('2d');

    const openEyes = () => {
      drawFace(ctx, expression, hasGlasses, false);
      faceTexture.needsUpdate = true;
      scheduleNext();
    };

    const closeEyes = () => {
      drawFace(ctx, expression, hasGlasses, true);
      faceTexture.needsUpdate = true;
      tid = setTimeout(openEyes, 130); // eyes stay closed ~130 ms
    };

    const scheduleNext = () => {
      // Blink every 2.5 – 4.5 s, randomly
      tid = setTimeout(closeEyes, 2500 + Math.random() * 2000);
    };

    scheduleNext();
    return () => clearTimeout(tid);
  }, [expression, hasGlasses, faceCanvas, faceTexture]);

  // ── Materials ──────────────────────────────────────────────────────────────
  const skinMat = useMemo(() => new THREE.MeshStandardMaterial({ color: SKIN, roughness: 0.45 }), []);
  const headMats = useMemo(() => [
    skinMat, skinMat, skinMat, skinMat,
    new THREE.MeshStandardMaterial({ map: faceTexture, roughness: 0.45 }),
    skinMat,
  ], [skinMat, faceTexture]);
  const torsoMat = useMemo(() => new THREE.MeshStandardMaterial({ color: torsoColor, roughness: 0.35, metalness: 0.04 }), [torsoColor]);
  const pantsMat = useMemo(() => new THREE.MeshStandardMaterial({ color: pantsColor, roughness: 0.35, metalness: 0.04 }), [pantsColor]);

  // ── World pos from pointer ─────────────────────────────────────────────────
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

  // ── Per-frame: drag + limb lerp ────────────────────────────────────────────
  useFrame((_, delta) => {
    if (isDragging.current && rbRef.current && targetPos.current) {
      rbRef.current.setNextKinematicTranslation({
        x: targetPos.current.x, y: targetPos.current.y, z: dragPlaneZ.current,
      });
    }
    const alpha = 1 - Math.pow(0.001, delta * 6);
    if (leftArmRef.current)  leftArmRef.current.rotation.x  = THREE.MathUtils.lerp(leftArmRef.current.rotation.x,  leftArmTarget.current,  alpha);
    if (rightArmRef.current) rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, rightArmTarget.current, alpha);
    if (leftLegRef.current)  leftLegRef.current.rotation.x  = THREE.MathUtils.lerp(leftLegRef.current.rotation.x,  leftLegTarget.current,  alpha);
    if (rightLegRef.current) rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, rightLegTarget.current, alpha);
  });

  // ── Body drag ──────────────────────────────────────────────────────────────
  const handleBodyPointerDown = useCallback((e) => {
    e.stopPropagation();
    if (!rbRef.current) return;
    isDragging.current = true;
    const pos = rbRef.current.translation();
    dragPlaneZ.current = pos.z;
    targetPos.current = { x: pos.x, y: pos.y };
    rbRef.current.setBodyType(BodyType.KinematicPositionBased, true);
    rbRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    rbRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);

    const history = [];
    const onMove = (ev) => {
      const world = getWorldPos(ev.clientX, ev.clientY, dragPlaneZ.current);
      if (!world) return;
      targetPos.current = { x: world.x, y: world.y };
      history.push({ x: world.x, y: world.y, t: performance.now() });
      if (history.length > 8) history.shift();
    };
    const onUp = () => {
      isDragging.current = false; targetPos.current = null;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      if (!rbRef.current) return;
      rbRef.current.setBodyType(BodyType.Dynamic, true);
      rbRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
      if (history.length >= 2) {
        const last = history[history.length - 1];
        const prev = history[Math.max(0, history.length - 3)];
        const dt = Math.max((last.t - prev.t) / 1000, 0.016);
        rbRef.current.setLinvel({
          x: Math.max(-11, Math.min(11, (last.x - prev.x) / dt)),
          y: Math.max(-11, Math.min(11, (last.y - prev.y) / dt)),
          z: 0,
        }, true);
      }
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [getWorldPos]);

  // ── Limb clicks ────────────────────────────────────────────────────────────
  const stopPropDown = useCallback((e) => e.stopPropagation(), []);
  const handleLeftArm  = useCallback((e) => { e.stopPropagation(); leftArmTarget.current  = nextPose(ARM_POSES, leftArmRef.current?.rotation.x  || 0); }, []);
  const handleRightArm = useCallback((e) => { e.stopPropagation(); rightArmTarget.current = nextPose(ARM_POSES, rightArmRef.current?.rotation.x || 0); }, []);
  const handleLeftLeg  = useCallback((e) => { e.stopPropagation(); leftLegTarget.current  = nextPose(LEG_POSES, leftLegRef.current?.rotation.x  || 0); }, []);
  const handleRightLeg = useCallback((e) => { e.stopPropagation(); rightLegTarget.current = nextPose(LEG_POSES, rightLegRef.current?.rotation.x || 0); }, []);

  const Hair = hairStyle === 'spiky' ? HairSpiky : hairStyle === 'flat' ? HairFlat : HairWavy;

  return (
    <RigidBody ref={rbRef} position={position} colliders={false}
      restitution={0.08} friction={0.9} linearDamping={0.6} angularDamping={0.95} lockRotations>
      <CuboidCollider args={[0.72, 2.2, 0.52]} position={[0, -0.05, 0]} />

      {/* ── Customise button floats above head ── */}
      <Html position={[0, 3.0, 0]} center>
        <button onClick={(e) => { e.stopPropagation(); onTogglePanel?.(); }} title="Customise"
          style={{ width: 26, height: 26, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.8)',
            background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)', cursor: 'pointer',
            fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)', color: '#17242a', fontWeight: 700, userSelect: 'none' }}>
          ✦
        </button>
      </Html>

      {/* ── Static body (drag from torso area) ── */}
      <group onPointerDown={handleBodyPointerDown} style={{ cursor: 'grab' }}>
        <Hair color={hairColor} />
        <mesh position={[0, 1.72, 0]} material={skinMat}><cylinderGeometry args={[0.24, 0.24, 0.22, 16]} /></mesh>
        <mesh position={[0, 1.12, 0]} material={headMats} castShadow><boxGeometry args={[1.18, 1.1, 1.14]} /></mesh>
        <mesh position={[0, 0.52, 0]} material={skinMat}><cylinderGeometry args={[0.22, 0.22, 0.16, 12]} /></mesh>
        <mesh position={[0, -0.16, 0]} material={torsoMat} castShadow><boxGeometry args={[1.36, 1.16, 0.88]} /></mesh>
        <mesh position={[0, -0.82, 0]} material={torsoMat}><boxGeometry args={[1.36, 0.38, 0.88]} /></mesh>
      </group>

      {/* ── Left arm (click to pose) ── */}
      <group position={[-0.95, 0.30, 0]} ref={leftArmRef} onPointerDown={stopPropDown} onClick={handleLeftArm} style={{ cursor: 'pointer' }}>
        <mesh position={[0, -0.5, 0]} material={torsoMat} castShadow><boxGeometry args={[0.44, 1.0, 0.44]} /></mesh>
        <mesh position={[0, -1.06, 0]} material={skinMat}><sphereGeometry args={[0.22, 10, 10]} /></mesh>
      </group>

      {/* ── Right arm ── */}
      <group position={[0.95, 0.30, 0]} ref={rightArmRef} onPointerDown={stopPropDown} onClick={handleRightArm} style={{ cursor: 'pointer' }}>
        <mesh position={[0, -0.5, 0]} material={torsoMat} castShadow><boxGeometry args={[0.44, 1.0, 0.44]} /></mesh>
        <mesh position={[0, -1.06, 0]} material={skinMat}><sphereGeometry args={[0.22, 10, 10]} /></mesh>
      </group>

      {/* ── Left leg (click to pose) ── */}
      <group position={[-0.37, -0.96, 0]} ref={leftLegRef} onPointerDown={stopPropDown} onClick={handleLeftLeg} style={{ cursor: 'pointer' }}>
        <mesh position={[0, -0.6, 0]} material={pantsMat} castShadow><boxGeometry args={[0.6, 1.22, 0.88]} /></mesh>
        <mesh position={[0, -1.28, 0.09]} material={pantsMat}><boxGeometry args={[0.64, 0.26, 1.06]} /></mesh>
      </group>

      {/* ── Right leg ── */}
      <group position={[0.37, -0.96, 0]} ref={rightLegRef} onPointerDown={stopPropDown} onClick={handleRightLeg} style={{ cursor: 'pointer' }}>
        <mesh position={[0, -0.6, 0]} material={pantsMat} castShadow><boxGeometry args={[0.6, 1.22, 0.88]} /></mesh>
        <mesh position={[0, -1.28, 0.09]} material={pantsMat}><boxGeometry args={[0.64, 0.26, 1.06]} /></mesh>
      </group>
    </RigidBody>
  );
}
