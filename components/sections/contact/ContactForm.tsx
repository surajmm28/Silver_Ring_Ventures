'use client'

import { useState, useRef } from 'react'

const ENQUIRY_TYPES = [
  'Land Purchase',
  'Investment',
  'Development Partnership',
  'Construction',
  'Interior Design',
  'General Enquiry',
]

const CONTACT_METHODS = ['Email', 'WhatsApp', 'Call']

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    enquiryType: '',
    message: '',
    contactMethod: 'Email',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const validate = () => {
    const e: Record<string, string> = {}
    if (!formData.name.trim()) e.name = 'Name is required'
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Valid email required'
    if (!formData.phone.trim()) e.phone = 'Phone number is required'
    if (!formData.message.trim()) e.message = 'Message is required'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})
    setStatus('sending')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', phone: '', company: '', enquiryType: '', message: '', contactMethod: 'Email' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const fieldStyle = {
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: '0.5px solid var(--faint)',
    color: 'var(--white)',
    fontFamily: "'Barlow', sans-serif",
    fontWeight: 300,
    fontSize: 15,
    padding: '16px 0 12px',
    outline: 'none',
    caretColor: 'var(--gold)',
    transition: 'border-color 0.3s',
  }

  const labelStyle = {
    display: 'block',
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: 600,
    fontSize: 10,
    letterSpacing: '0.22em',
    textTransform: 'uppercase' as const,
    color: 'var(--gold)',
    marginBottom: 4,
  }

  const fieldWrap = { marginBottom: 32 }

  return (
    <div style={{
      background: 'var(--deep)',
      padding: '80px 60px',
      height: '100%',
    }}>
      <div style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontWeight: 800,
        fontSize: 28,
        textTransform: 'uppercase',
        color: 'var(--white)',
        marginBottom: 48,
        letterSpacing: '0.02em',
      }}>
        SEND US A MESSAGE
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, columnGap: 40 }}>
          <div style={fieldWrap}>
            <label style={labelStyle}>Full Name *</label>
            <input
              type="text"
              placeholder=" "
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              style={{ ...fieldStyle, borderBottomColor: errors.name ? '#e05555' : formData.name ? 'var(--gold)' : 'var(--faint)' }}
              aria-required="true"
            />
            {errors.name && <div style={{ fontSize: 11, color: '#e05555', marginTop: 4, fontFamily: "'Barlow', sans-serif" }}>{errors.name}</div>}
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Email Address *</label>
            <input
              type="email"
              placeholder=" "
              value={formData.email}
              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              style={{ ...fieldStyle, borderBottomColor: errors.email ? '#e05555' : formData.email ? 'var(--gold)' : 'var(--faint)' }}
              aria-required="true"
            />
            {errors.email && <div style={{ fontSize: 11, color: '#e05555', marginTop: 4, fontFamily: "'Barlow', sans-serif" }}>{errors.email}</div>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, columnGap: 40 }}>
          <div style={fieldWrap}>
            <label style={labelStyle}>Phone Number *</label>
            <input
              type="tel"
              placeholder=" "
              value={formData.phone}
              onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
              style={{ ...fieldStyle, borderBottomColor: errors.phone ? '#e05555' : formData.phone ? 'var(--gold)' : 'var(--faint)' }}
              aria-required="true"
            />
            {errors.phone && <div style={{ fontSize: 11, color: '#e05555', marginTop: 4, fontFamily: "'Barlow', sans-serif" }}>{errors.phone}</div>}
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Company / Project Name</label>
            <input
              type="text"
              placeholder=" "
              value={formData.company}
              onChange={(e) => setFormData((p) => ({ ...p, company: e.target.value }))}
              style={{ ...fieldStyle, borderBottomColor: formData.company ? 'var(--gold)' : 'var(--faint)' }}
            />
          </div>
        </div>

        <div style={fieldWrap}>
          <label style={labelStyle}>What are you looking for?</label>
          <select
            value={formData.enquiryType}
            onChange={(e) => setFormData((p) => ({ ...p, enquiryType: e.target.value }))}
            style={{ ...fieldStyle, color: formData.enquiryType ? 'var(--white)' : 'var(--muted)', borderBottomColor: formData.enquiryType ? 'var(--gold)' : 'var(--faint)' }}
          >
            <option value="" style={{ background: '#111' }}>Select enquiry type</option>
            {ENQUIRY_TYPES.map((t) => (
              <option key={t} value={t} style={{ background: '#111' }}>{t}</option>
            ))}
          </select>
        </div>

        <div style={fieldWrap}>
          <label style={labelStyle}>Your Message *</label>
          <textarea
            placeholder=" "
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
            style={{ ...fieldStyle, resize: 'none', borderBottomColor: errors.message ? '#e05555' : formData.message ? 'var(--gold)' : 'var(--faint)' }}
            aria-required="true"
          />
          {errors.message && <div style={{ fontSize: 11, color: '#e05555', marginTop: 4, fontFamily: "'Barlow', sans-serif" }}>{errors.message}</div>}
        </div>

        {/* Contact method pills */}
        <div style={{ marginBottom: 40 }}>
          <div style={labelStyle}>Preferred Contact Method</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            {CONTACT_METHODS.map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setFormData((p) => ({ ...p, contactMethod: method }))}
                className="contact-pill"
                style={{
                  background: formData.contactMethod === method ? 'var(--gold-faint)' : 'transparent',
                  border: `0.5px solid ${formData.contactMethod === method ? 'var(--gold)' : 'var(--faint)'}`,
                  color: formData.contactMethod === method ? 'var(--gold)' : 'var(--muted)',
                }}
                data-cursor="cta"
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={status === 'sending'}
          data-cursor="cta"
          style={{
            width: '100%',
            padding: '18px 36px',
            background: status === 'success' ? '#2d7a2d' : status === 'error' ? '#7a2d2d' : 'var(--gold)',
            color: status === 'success' || status === 'error' ? 'var(--white)' : 'var(--black)',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: 14,
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            border: 'none',
            cursor: status === 'sending' ? 'wait' : 'none',
            transition: 'background 0.4s, transform 0.3s',
            transform: 'scale(1)',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.01)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)' }}
        >
          {status === 'sending' ? 'SENDING...' : status === 'success' ? '✓ MESSAGE SENT' : status === 'error' ? '✕ TRY AGAIN' : 'SEND ENQUIRY →'}
        </button>

        {status === 'success' && (
          <div style={{
            marginTop: 16,
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 300,
            fontSize: 13,
            color: 'var(--muted)',
            textAlign: 'center',
          }}>
            We&apos;ll be in touch within 24 hours.
          </div>
        )}
      </form>
    </div>
  )
}
