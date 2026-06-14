'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/about', label: 'About' },
  { href: '/ecosystem', label: 'Ecosystem' },
  { href: '/projects', label: 'Projects' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // Magnetic effect for Get In Touch button
  const ctaRef = useRef<HTMLAnchorElement>(null)

  const handleCtaMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const btn = ctaRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`
  }

  const handleCtaMouseLeave = () => {
    if (ctaRef.current)
      ctaRef.current.style.transform = 'translate(0,0)'
  }

  return (
    <>
      <nav
        id="navbar"
        ref={navRef}
        className={scrolled ? 'scrolled' : ''}
      >
        {/* Logo */}
        <Link href="/" id="nav-logo" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Image
            src="/logo-white.png"
            alt="Silverring Ventures"
            width={160}
            height={54}
            priority
            style={{ objectFit: 'contain', height: 36, width: 'auto' }}
          />
        </Link>

        {/* Desktop links */}
        <div id="navbar-links" style={{ display: 'flex', alignItems: 'center' }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? 'active' : ''}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            ref={ctaRef}
            onMouseMove={handleCtaMouseMove}
            onMouseEnter={(e) => {
              const t = e.currentTarget
              t.style.background = 'var(--gold)'
              t.style.color = 'var(--black)'
            }}
            onMouseLeave={(e) => {
              const t = e.currentTarget
              t.style.background = 'transparent'
              t.style.color = 'var(--gold)'
              t.style.transform = 'translate(0,0)'
            }}
            data-cursor="cta"
            style={{
              marginLeft: 28,
              padding: '6px 14px',
              border: '0.5px solid var(--gold)',
              color: 'var(--gold)',
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 600,
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              textDecoration: 'none',
              transition: 'background 0.3s, color 0.3s',
              display: 'inline-flex',
              alignItems: 'center',
              lineHeight: 1,
            }}
          >
            Get In Touch
          </Link>
        </div>

        {/* Hamburger */}
        <button
          id="hamburger"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className={menuOpen ? 'open' : ''}
          onClick={() => setMenuOpen((v) => !v)}
          style={{ background: 'none', border: 'none', padding: 0 }}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <div id="mobile-menu" className={menuOpen ? 'open' : ''}>
        <nav>
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            style={{
              animationDelay: `${navLinks.length * 80}ms`,
              color: 'var(--gold)',
            }}
          >
            Get In Touch
          </Link>
        </nav>
      </div>
    </>
  )
}
