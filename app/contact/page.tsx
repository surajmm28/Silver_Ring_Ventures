import type { Metadata } from 'next'
import ContactInfo from '@/components/sections/contact/ContactInfo'
import ContactForm from '@/components/sections/contact/ContactForm'
import MapEmbed from '@/components/sections/contact/MapEmbed'
import FAQ from '@/components/sections/contact/FAQ'

export const metadata: Metadata = {
  title: 'Contact — Silverring Ventures',
  description:
    "Let's build something extraordinary. Reach out to Silverring Ventures for land acquisition, investment, development partnerships, construction, or interior design.",
}

export default function ContactPage() {
  return (
    <>
      {/* Split hero — info left, form right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>
        <ContactInfo />
        <ContactForm />
      </div>

      <MapEmbed />
      <FAQ />
    </>
  )
}
