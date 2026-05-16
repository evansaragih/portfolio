export default function About() {
  return (
    <section className="about" id="about">
      <div className="container">
        <div className="about-grid">

          <div className="about-left-card" data-reveal>
            <img
              src="https://www.figma.com/api/mcp/asset/de9f883f-0211-4a62-a3cf-8f5189077b35"
              alt="Evan Himawan Saragih"
              className="about-photo"
            />
            <p className="about-available">Available for work</p>
            <h3 className="about-name">Evan Himawan Saragih</h3>
            <p className="about-role">Product - UI/UX Designer Based in Jakarta, Indonesia 🇮🇩</p>
            <div className="about-social-row">
              <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram" className="about-social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener" aria-label="LinkedIn" className="about-social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
              <a href="https://behance.net" target="_blank" rel="noopener" aria-label="Behance" className="about-social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 1.4.836 2.177 2.012 2.177.939 0 1.52-.435 1.744-1.148h3zm-4.87-4c-.023-1.188-.629-1.895-1.787-1.895-1.171 0-1.894.732-2.016 1.895h3.803zM8.462 10.512c0-2.074-1.56-3.512-4.123-3.512H1v12h3.46c2.76 0 4.494-1.453 4.494-3.706 0-1.34-.716-2.367-1.862-2.843.834-.414 1.37-1.264 1.37-1.939zm-4.386-.558c.864 0 1.386.468 1.386 1.224 0 .758-.522 1.226-1.386 1.226H4.044V9.954h.032zm.128 5.808H4.044v-2.546h.16c.896 0 1.46.476 1.46 1.27 0 .8-.564 1.276-1.46 1.276z"/>
                </svg>
              </a>
            </div>
            <a href="#contact" className="btn btn-primary about-cta-btn">Contact Me</a>
          </div>

          <div className="about-right" data-reveal>
            <p className="about-bio">
              I started as a UI/UX Designer and gradually evolved into a Product &amp; Delivery Manager,
              taking ownership of both design execution and product leadership across multiple concurrent digital platforms.
            </p>
            <p className="about-bio">
              My experience spans end-to-end product development — from discovery and information architecture
              to delivery optimization and operational enhancement.
            </p>
            <p className="about-bio">
              Over time, I moved beyond interface design into system thinking, business logic structuring,
              and cross-functional delivery leadership.
            </p>
            <div className="about-divider"></div>
            <div className="skills-wrap">
              {['Product Design','UX Design','UI Design','Framer','Branding','Webflow','Interaction Design','UX Research'].map((s) => (
                <span key={s} className="skill-tag">{s}</span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
