import { useRef, useState, useCallback } from 'react';

const projects = [
  {
    img: 'https://www.figma.com/api/mcp/asset/f0d0aeef-74bc-4e6e-8dee-f9f6e401ad98',
    name: 'Airple Aircon',
    sub: 'Service Operations Ecosystem',
  },
  {
    img: 'https://www.figma.com/api/mcp/asset/7f21066f-6e43-4ecd-8644-6b428460464b',
    name: 'iHome',
    sub: 'Residential Operations Platform',
  },
  {
    img: 'https://www.figma.com/api/mcp/asset/0ac5032b-0cd5-44ba-9f18-6c5ce8427aee',
    name: 'J.City',
    sub: 'Service Operations Ecosystem',
  },
  {
    img: 'https://www.figma.com/api/mcp/asset/5e4d43f0-1d6a-4a0f-8c75-107593710115',
    name: 'Permata Medical',
    sub: 'Residential Operations Platform',
  },
  {
    img: 'https://www.figma.com/api/mcp/asset/dc64e183-1912-4225-9b5d-6b9c8d1795a8',
    name: 'Blaze CRM',
    sub: 'Service Operations Ecosystem',
  },
  {
    img: 'https://www.figma.com/api/mcp/asset/4738c754-bb7a-4a58-a1ac-112a1a2add3e',
    name: 'Rustic Padel',
    sub: 'Residential Operations Platform',
  },
];

// 3×3 Rubik face — colours match the portfolio palette
const RUBIK_COLORS = [
  '#306bea', '#EAB308', '#22C55E',
  '#F97316', '#de313b', '#306bea',
  '#22C55E', '#EAB308', '#F97316',
];

function ProjectCard({ p, index }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const rafRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 → 0.5
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({ x: ny * -12, y: nx * 12 });
    });
  }, []);

  const handleMouseEnter = useCallback(() => setHovered(true), []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    setTilt({ x: 0, y: 0 });
  }, []);

  return (
    /* Outer wrapper owns the 3D transform — keeps overflow:hidden on the card intact */
    <div
      ref={cardRef}
      data-reveal
      className="project-card-wrap"
      style={{
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovered ? 1.03 : 1})`,
        transition: hovered ? 'transform 0.08s linear' : 'transform 0.5s cubic-bezier(0.23,1,0.32,1)',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <article className="project-card">
        <img src={p.img} alt={p.name} className="project-img" />
        <div className="project-overlay" />

        {/* Rubik overlay — fades in on hover */}
        <div className={`rubik-overlay${hovered ? ' rubik-overlay--visible' : ''}`}>
          {RUBIK_COLORS.map((color, ci) => (
            <div
              key={ci}
              className="rubik-cell"
              style={{ background: color, transitionDelay: `${ci * 18}ms` }}
            />
          ))}
        </div>

        <div className="project-info">
          <p className="project-name">{p.name}</p>
          <p className="project-sub">{p.sub}</p>
        </div>
      </article>
    </div>
  );
}

export default function Projects() {
  return (
    <section className="projects" id="projects">
      <div className="container">
        <h2 className="section-title" data-reveal>Selected Works</h2>
        <div className="projects-grid">
          {projects.map((p, i) => (
            <ProjectCard key={i} p={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
