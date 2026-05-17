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

      {/* Hero text — floats above canvas */}
      <div
        className="relative flex items-center h-full"
        style={{ zIndex: 20, pointerEvents: 'none' }}
      >
        <div className="container" style={{ pointerEvents: 'none' }}>
          <div className="p-8 max-w-lg" style={{ pointerEvents: 'auto' }}>

            {/* h1 + paragraph share width — inline-flex column sizes to h1's natural width */}
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'stretch', marginBottom: '2rem' }}>
              <h1
                className="mb-4 leading-tight"
                style={{
                  fontFamily: 'Instrument Serif, serif',
                  fontSize: '80px',
                  fontWeight: 400,
                  color: '#17242a',
                  whiteSpace: 'nowrap',
                }}
              >
                Evan Himawan Saragih
              </h1>

              <p
                className="leading-relaxed"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '18px',
                  color: '#4f7b90',
                }}
              >
                UI/UX Designer and Product Designer<br />4+ years designing SaaS platforms with a focus on design systems and product thinking.
              </p>
            </div>

            {/* CTA buttons — Figma nodes 2287:1550 & 2287:1583 */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              {/* Contact Me — 3 LEGO studs, dark navy */}
              <a href="#contact" className="hero-btn hero-btn--dark">
                <div className="hero-btn-stud" style={{ left: 4 }} />
                <div className="hero-btn-stud" style={{ left: 41.71 }} />
                <div className="hero-btn-stud" style={{ left: 80.58 }} />
                <span className="hero-btn-label">Contact Me</span>
              </a>
              {/* See Projects — 3 LEGO studs, blue */}
              <a href="#projects" className="hero-btn hero-btn--blue">
                <div className="hero-btn-stud" style={{ left: 4 }} />
                <div className="hero-btn-stud" style={{ left: 41.71 }} />
                <div className="hero-btn-stud" style={{ left: 80.58 }} />
                <span className="hero-btn-label">See Projects</span>
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
