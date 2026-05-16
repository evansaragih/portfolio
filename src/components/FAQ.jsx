import { useState } from 'react';

const faqs = [
  {
    q: 'What services do you offer?',
    a: 'I specialize in web design, app design, branding, UI/UX, and Framer development, creating modern, user-friendly experiences tailored to your needs.',
    bg: 'faq-cream',
  },
  {
    q: 'Do you provide revisions?',
    a: 'Yes! I offer two free rounds of revisions to ensure the final design meets your vision perfectly. Additional revisions are available if needed.',
    bg: 'faq-white',
  },
  {
    q: 'How do I start working with you?',
    a: "Simply reach out through my contact page, and we'll discuss your project, goals, and timeline before getting started.",
    bg: 'faq-cream',
  },
  {
    q: 'What is your pricing structure?',
    a: 'Pricing depends on the project scope. Contact me for a custom quote based on your needs and budget.',
    bg: 'faq-white',
  },
  {
    q: 'How long does a project typically take?',
    a: 'Timelines vary based on project complexity, but most designs take 1–3 weeks, while full websites take 3–6 weeks.',
    bg: 'faq-cream',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <section className="faq" id="faq">
      <div className="container">
        <div className="faq-header" data-reveal>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-sub">Find quick answers to the most common questions about the services offered.</p>
        </div>
        <div className="faq-list">
          {faqs.map((item, i) => (
            <div
              key={i}
              className={`faq-item ${item.bg}`}
              data-reveal
              style={{ cursor: 'pointer' }}
              onClick={() => toggle(i)}
            >
              <p className="faq-q">{item.q}</p>
              {openIndex === i && <p className="faq-a">{item.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
