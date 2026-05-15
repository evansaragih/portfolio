/* =========================================
   HAMBURGER / MOBILE MENU
========================================= */
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

// Close menu when a mobile link is tapped
mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});

/* =========================================
   ACTIVE NAV LINK ON SCROLL
========================================= */
const sections = [
  { id: 'home',       nav: 'home' },
  { id: 'projects',   nav: 'projects' },
  { id: 'about',      nav: 'projects' }, // no dedicated nav item
  { id: 'experience', nav: 'projects' }, // no dedicated nav item
  { id: 'blog',       nav: 'blog' },
  { id: 'faq',        nav: 'blog' },     // no dedicated nav item
  { id: 'contact',    nav: 'contact' },
];

function updateActiveLinks() {
  const scrollY = window.scrollY + 120;
  let current = 'home';

  sections.forEach(({ id, nav }) => {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= scrollY) {
      current = nav;
    }
  });

  // Desktop nav
  document.querySelectorAll('.nav-link[data-section]').forEach(link => {
    link.classList.toggle('active', link.dataset.section === current);
  });

  // Mobile nav
  document.querySelectorAll('.mobile-link').forEach(link => {
    const href = link.getAttribute('href')?.replace('#', '');
    link.classList.toggle('active', href === current);
  });
}

window.addEventListener('scroll', updateActiveLinks, { passive: true });

/* =========================================
   SMOOTH SCROLL FOR ANCHOR LINKS
========================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId  = anchor.getAttribute('href');
    const target    = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      // Account for sticky navbar height (~60px)
      const offset = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});

/* =========================================
   SCROLL REVEAL
========================================= */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold:  0.1,
  rootMargin: '0px 0px -40px 0px',
});

function initReveal() {
  const targets = [
    '.hero-left',
    '.project-card',
    '.about-left-card',
    '.about-right',
    '.exp-card',
    '.experience-right-card',
    '.blog-header',
    '.blog-card',
    '.faq-header',
    '.faq-item',
    '.cta-inner',
  ];

  targets.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.setAttribute('data-reveal', '');
      el.style.transitionDelay = `${i * 0.06}s`;
      revealObserver.observe(el);
    });
  });
}

/* =========================================
   INIT
========================================= */
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  updateActiveLinks();
});
