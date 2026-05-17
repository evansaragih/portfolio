import { Agentation } from "agentation";
import { useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Projects from './components/Projects.jsx';
import Blog from './components/Blog.jsx';
import CTA from './components/CTA.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    const targets = document.querySelectorAll('[data-reveal]');
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const anchors = document.querySelectorAll('a[href^="#"]');
    const handleClick = (e) => {
      const href = e.currentTarget.getAttribute('href');
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    anchors.forEach((a) => a.addEventListener('click', handleClick));
    return () => anchors.forEach((a) => a.removeEventListener('click', handleClick));
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Projects />
        <Blog />
        <CTA />
      </main>
      <Footer />
      {process.env.NODE_ENV === "development" && <Agentation />}
    </>
  );
}
