import { useState, useEffect } from 'react';

const navLinks = [
  { href: '#home', label: 'Home', section: 'home' },
  { href: '#projects', label: 'Projects', section: 'projects' },
  { href: '#blog', label: 'Blog', section: 'blog' },
  { href: '#contact', label: 'Contact Me', cta: true },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const sections = ['home', 'about', 'experience', 'blog', 'faq', 'contact'];

    const updateActive = () => {
      const scrollY = window.scrollY + 100;
      let current = 'home';
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) current = id;
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
    return () => window.removeEventListener('scroll', updateActive);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e) => {
      const wrapper = document.getElementById('navbarWrapper');
      if (wrapper && !wrapper.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [menuOpen]);

  return (
    <div className="navbar-wrapper" id="navbarWrapper">
      <div className="navbar-row">
        <div className="nav-pill nav-pill-logo">
          <img
            src="https://www.figma.com/api/mcp/asset/e2549b5a-6df2-48ae-b702-c21924a832d5"
            alt="Evan logo"
            className="nav-logo-img"
          />
          <span className="nav-logo-text">EVAN</span>
        </div>

        <nav className="nav-pill nav-pill-links" id="navPillLinks" aria-label="Main navigation">
          {navLinks.map(({ href, label, section, cta }) => (
            <a
              key={href}
              href={href}
              className={`nav-link${cta ? ' nav-link-cta' : ''}${
                section && activeSection === section ? ' active' : ''
              }`}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="nav-pill nav-pill-social">
          <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram" className="nav-social-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
            </svg>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener" aria-label="LinkedIn" className="nav-social-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
              <rect x="2" y="9" width="4" height="12"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
          </a>
          <a href="https://behance.net" target="_blank" rel="noopener" aria-label="Behance" className="nav-social-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 1.4.836 2.177 2.012 2.177.939 0 1.52-.435 1.744-1.148h3zm-4.87-4c-.023-1.188-.629-1.895-1.787-1.895-1.171 0-1.894.732-2.016 1.895h3.803zM8.462 10.512c0-2.074-1.56-3.512-4.123-3.512H1v12h3.46c2.76 0 4.494-1.453 4.494-3.706 0-1.34-.716-2.367-1.862-2.843.834-.414 1.37-1.264 1.37-1.939zm-4.386-.558c.864 0 1.386.468 1.386 1.224 0 .758-.522 1.226-1.386 1.226H4.044V9.954h.032zm.128 5.808H4.044v-2.546h.16c.896 0 1.46.476 1.46 1.27 0 .8-.564 1.276-1.46 1.276z"/>
            </svg>
          </a>
        </div>

        <button
          className={`hamburger${menuOpen ? ' open' : ''}`}
          id="hamburger"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span></span><span></span><span></span>
        </button>
      </div>

      <nav className={`mobile-menu${menuOpen ? ' open' : ''}`} aria-label="Mobile navigation">
        {navLinks.map(({ href, label, section }) => (
          <a
            key={href}
            href={href}
            className={`mobile-link${section && activeSection === section ? ' active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </a>
        ))}
      </nav>
    </div>
  );
}
