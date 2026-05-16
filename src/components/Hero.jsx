import { useRef, useState, useCallback, useEffect } from 'react';
import LegoScene from './LegoScene.jsx';
import MinifigPanel from './MinifigPanel.jsx';

export default function Hero() {
  const dropZoneRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const dotGridRef = useRef(null);
  const [snapped, setSnapped] = useState(false);

  const [showPanel, setShowPanel] = useState(false);
  const togglePanel = useCallback(() => setShowPanel(v => !v), []);

  const [minifigState, setMinifigState] = useState({
    expression: 'happy',
    hasGlasses: true,
    torsoColor: '#1e3a5f',
    pantsColor: '#2d3748',
    hairColor: '#1a1a1a',
    hairStyle: 'wavy',
  });

  const handleMouseMove = useCallback((e) => {
    const canvas = dotGridRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    drawDotGrid(ctx, canvas.width, canvas.height, mx, my);
  }, []);

  const handleMouseLeave = useCallback(() => {
    const canvas = dotGridRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    drawDotGrid(ctx, canvas.width, canvas.height, -999, -999);
  }, []);

  useEffect(() => {
    const canvas = dotGridRef.current;
    if (!canvas) return;

    const resize = () => {
      const hero = canvas.parentElement;
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
      const ctx = canvas.getContext('2d');
      drawDotGrid(ctx, canvas.width, canvas.height, -999, -999);
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  function drawDotGrid(ctx, w, h, mx, my) {
    ctx.clearRect(0, 0, w, h);
    const spacing = 32;
    const glowRadius = 120;

    for (let x = spacing / 2; x < w; x += spacing) {
      for (let y = spacing / 2; y < h; y += spacing) {
        const dist = Math.hypot(x - mx, y - my);
        const glow = Math.max(0, 1 - dist / glowRadius);
        const alpha = 0.5 + glow * 0.5;
        const r = 1.5 + glow * 1.5;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(203,213,225,${alpha})`;
        ctx.fill();
      }
    }
  }

  return (
    <section
      id="home"
      className="relative overflow-hidden"
      style={{ height: '100vh', background: '#F8F9FA' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dot grid background */}
      <canvas
        ref={dotGridRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Three.js canvas */}
      <div ref={canvasContainerRef} style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <LegoScene
          dropZoneRef={dropZoneRef}
          onBrickSnapped={() => setSnapped(true)}
          minifigState={minifigState}
          onTogglePanel={togglePanel}
        />
      </div>

      {/* Glass card — floats above canvas */}
      <div
        className="relative flex items-center h-full"
        style={{ zIndex: 20, pointerEvents: 'none' }}
      >
        <div className="container" style={{ pointerEvents: 'none' }}>
          <div
            className="rounded-3xl p-8 max-w-lg"
            style={{
              background: 'rgba(255,255,255,0.40)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.60)',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.18)',
              pointerEvents: 'auto',
            }}
          >
            {/* Eyebrow */}
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-4"
              style={{ color: '#6B7280', fontFamily: 'Satoshi, sans-serif' }}
            >
              Hello, I'm Evan
            </p>

            {/* Headline */}
            <h1
              className="mb-4 leading-tight"
              style={{
                fontFamily: 'Instrument Serif, serif',
                fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                fontWeight: 400,
                color: '#17242a',
              }}
            >
              Building scalable products,{' '}
              <span
                ref={dropZoneRef}
                className="inline-block px-3 py-1 rounded-xl align-middle"
                style={{
                  border: '3px dashed #9CA3AF',
                  minWidth: '120px',
                  minHeight: '2.2rem',
                  verticalAlign: 'middle',
                  transition: 'border-color 0.2s, background 0.2s',
                  background: snapped ? 'rgba(59,130,246,0.08)' : 'transparent',
                  borderColor: snapped ? '#3B82F6' : '#9CA3AF',
                }}
              >
                {snapped ? (
                  <span
                    style={{
                      animation: 'fadeIn 0.4s ease forwards',
                      color: '#3B82F6',
                      fontStyle: 'italic',
                    }}
                  >
                    one by one.
                  </span>
                ) : (
                  <span style={{ color: '#9CA3AF', fontSize: '0.75em' }}>drop brick</span>
                )}
              </span>
            </h1>

            {/* Sub-copy */}
            <p
              className="mb-8 leading-relaxed"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                color: '#4f7b90',
                maxWidth: '380px',
              }}
            >
              UI/UX Designer & Product Manager crafting cohesive design systems and
              modular interfaces — one component at a time.
            </p>

            {/* CTA buttons */}
            <div className="flex gap-3 flex-wrap">
              <a
                href="#projects"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-150 active:translate-y-1.5"
                style={{
                  fontFamily: 'Satoshi, sans-serif',
                  background: 'linear-gradient(180deg, #17242a 0%, #4f7b90 100%)',
                  boxShadow: '0 6px 0 #000000',
                  transition: 'transform 0.1s, box-shadow 0.1s',
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(6px)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '0 6px 0 #000000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '0 6px 0 #000000';
                }}
              >
                View Projects
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-150"
                style={{
                  fontFamily: 'Satoshi, sans-serif',
                  background: 'linear-gradient(180deg, #ffffff 0%, #dce7ec 100%)',
                  color: '#17242a',
                  boxShadow: '0 6px 0 #b0bec8',
                  transition: 'transform 0.1s, box-shadow 0.1s',
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(6px)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '0 6px 0 #b0bec8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '0 6px 0 #b0bec8';
                }}
              >
                Contact Me
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Minifig customisation panel — only visible when toggled via ✦ button */}
      {showPanel && <MinifigPanel state={minifigState} onChange={setMinifigState} />}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: none; }
        }
      `}</style>
    </section>
  );
}
