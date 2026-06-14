'use client'

import { useState, useRef } from 'react'
import { gsap } from '@/lib/gsap'

const faqs = [
  {
    q: 'What makes Silverring Ventures different from other real estate companies?',
    a: 'Unlike traditional developers who outsource key functions, Silverring operates five integrated specialist units under one roof — covering development, advisory, construction, media, and interiors. This means one point of accountability, zero handoff delays, and outcomes that are genuinely coordinated across every discipline.',
  },
  {
    q: 'Do you work with external landowners and investors?',
    a: 'Yes. We welcome Joint Venture (JV) and Joint Development (JD) structures with landowners, as well as investment partnerships with individuals and institutions. Our team will assess your site or capital position and propose the most suitable collaboration structure.',
  },
  {
    q: 'Which geographies do you currently operate in?',
    a: 'Our primary focus is Bangalore, where we have deep market knowledge, regulatory expertise, and established partnerships. We are exploring select opportunities in other Tier 1 cities and will announce expansion plans in due course.',
  },
  {
    q: 'How does Citex work within the Silverring ecosystem?',
    a: 'Citex is our RERA-certified advisory arm. It provides market intelligence that informs product design, pricing strategy, and channel partner activation. When a Silverring project launches, Citex leads the sales strategy — ensuring the development is positioned correctly for the target buyer segment.',
  },
  {
    q: 'Can Studio Nabi provide interior design services for non-Silverring projects?',
    a: 'Studio Nabi is primarily focused on supporting Silverring development projects. However, on a selective basis, we do take on independent interior commissions. Please reach out via the contact form to discuss your specific requirements.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const contentRefs = useRef<(HTMLDivElement | null)[]>([])

  const toggle = (i: number) => {
    const newOpen = openIndex === i ? null : i

    // Animate close current
    if (openIndex !== null && contentRefs.current[openIndex]) {
      gsap.to(contentRefs.current[openIndex], {
        height: 0,
        duration: 0.4,
        ease: 'power3.inOut',
      })
    }

    // Animate open new
    if (newOpen !== null && contentRefs.current[newOpen]) {
      const el = contentRefs.current[newOpen]!
      const inner = el.querySelector('.acc-inner') as HTMLElement
      gsap.fromTo(el,
        { height: 0 },
        { height: inner.offsetHeight, duration: 0.5, ease: 'power3.inOut' }
      )
    }

    setOpenIndex(newOpen)
  }

  return (
    <section className="faq-section" style={{
      background: 'var(--black)',
      padding: '120px 60px',
      borderTop: '0.5px solid var(--faint)',
    }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(36px, 5vw, 64px)',
          lineHeight: 0.95,
          textTransform: 'uppercase',
          color: 'var(--white)',
          marginBottom: 60,
        }}>
          FREQUENTLY ASKED{' '}
          <span style={{ color: 'var(--gold)' }}>QUESTIONS.</span>
        </div>

        {faqs.map((faq, i) => (
          <div key={i} className="accordion-item" style={{ borderBottom: '0.5px solid var(--faint)' }}>
            <button
              className="accordion-trigger"
              onClick={() => toggle(i)}
              aria-expanded={openIndex === i}
              data-cursor="cta"
            >
              <span>{faq.q}</span>
              <svg
                className="accordion-icon"
                viewBox="0 0 20 20"
                fill="none"
                style={{
                  transform: openIndex === i ? 'rotate(45deg)' : 'rotate(0)',
                  transition: 'transform 0.4s cubic-bezier(0.77,0,0.175,1)',
                  flexShrink: 0,
                }}
              >
                <line x1="10" y1="2" x2="10" y2="18" stroke="currentColor" strokeWidth="1.5" />
                <line x1="2" y1="10" x2="18" y2="10" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>

            <div
              ref={(el) => { contentRefs.current[i] = el }}
              style={{ overflow: 'hidden', height: 0 }}
            >
              <div className="acc-inner" style={{
                padding: '0 0 28px 0',
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 300,
                fontSize: 15,
                lineHeight: 1.9,
                color: 'var(--muted)',
              }}>
                {faq.a}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
