'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import TransitionLink from '@/components/ui/TransitionLink'

const navLinks = [
  { href: '/about',     label: 'About'     },
  { href: '/ecosystem', label: 'Ecosystem' },
  { href: '/projects',  label: 'Projects'  },
]

export default function Navbar() {
  const pathname  = usePathname()
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]   = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on navigation
  useEffect(() => { setMenuOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // Magnetic CTA effect — uses e.currentTarget so no ref needed
  const handleCtaMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const btn  = e.currentTarget
    const rect = btn.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width  / 2
    const y = e.clientY - rect.top  - rect.height / 2
    btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`
  }

  const handleCtaMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.background = 'var(--gold)'
    e.currentTarget.style.color      = 'var(--black)'
  }

  const handleCtaMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.background = 'transparent'
    e.currentTarget.style.color      = 'var(--gold)'
    e.currentTarget.style.transform  = 'translate(0,0)'
  }

  return (
    <>
      <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
        {/* Logo */}
        <TransitionLink
          href="/"
          id="nav-logo"
          style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
        >
          <Image
            src="/logo-white.png"
            alt="Silverring Ventures"
            width={160}
            height={54}
            priority
            style={{ objectFit: 'contain', height: 36, width: 'auto' }}
          />
        </TransitionLink>

        {/* Desktop links */}
        <div id="navbar-links" style={{ display: 'flex', alignItems: 'center' }}>
          {navLinks.map((link) => (
            <TransitionLink
              key={link.href}
              href={link.href}
              className={pathname === link.href ? 'active' : ''}
            >
              {link.label}
            </TransitionLink>
          ))}

          {/* Get In Touch — magnetic + fill effect */}
          <TransitionLink
            href="/contact"
            onMouseMove={handleCtaMouseMove}
            onMouseEnter={handleCtaMouseEnter}
            onMouseLeave={handleCtaMouseLeave}
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
          </TransitionLink>
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
            <TransitionLink
              key={link.href}
              href={link.href}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {link.label}
            </TransitionLink>
          ))}
          <TransitionLink
            href="/contact"
            style={{
              animationDelay: `${navLinks.length * 80}ms`,
              color: 'var(--gold)',
            }}
          >
            Get In Touch
          </TransitionLink>
        </nav>
      </div>
    </>
  )
}
