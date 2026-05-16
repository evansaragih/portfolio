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

export default function Projects() {
  return (
    <section className="projects" id="projects">
      <div className="container">
        <h2 className="section-title" data-reveal>Projects</h2>
      </div>
      <div className="projects-scroll-wrap">
        <div className="projects-track">
          {projects.map((p, i) => (
            <article className="project-card" key={i} data-reveal>
              <img src={p.img} alt={p.name} className="project-img" />
              <div className="project-overlay"></div>
              <div className="project-info">
                <p className="project-name">{p.name}</p>
                <p className="project-sub">{p.sub}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
