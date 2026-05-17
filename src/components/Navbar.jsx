import { useState, useEffect } from 'react';

// Colors taken directly from Figma design
const navLinks = [
  { href: '#home',     label: 'Home',    section: 'home',     color: '#de313b' },
  { href: '#projects', label: 'Work',    section: 'projects', color: '#306bea' },
  { href: '#about',    label: 'About',   section: 'about',    color: '#243851' },
  { href: '#contact',  label: 'Contact', section: 'contact',  color: '#e66f00' },
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
      <div className="navbar-row" style={{ filter: 'drop-shadow(3.474px 3.474px 1.737px rgba(0,0,0,0.18))' }}>

        {/* Brick nav items */}
        <nav className="nav-bricks" id="navPillLinks" aria-label="Main navigation">
          {navLinks.map(({ href, label, section, color }) => (
            <a
              key={href}
              href={href}
              className={`nav-brick-item${section && activeSection === section ? ' active' : ''}`}
              style={{ '--brick-color': color }}
            >
              {/* Stud sits on top — rounded top corners */}
              <div className="nav-brick-stud">
                <span className="nav-stud-seam" />
                <span className="nav-stud-shine nav-stud-shine-left" />
                <span className="nav-stud-shine nav-stud-shine-right" />
              </div>
              {/* Body below the stud */}
              <div className="nav-brick-body" />
              {/* Label absolutely centred over the body */}
              <span className="nav-brick-label">{label}</span>
            </a>
          ))}
        </nav>

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
