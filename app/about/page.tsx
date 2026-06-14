import type { Metadata } from 'next'
import AboutHero from '@/components/sections/about/AboutHero'
import VisionMission from '@/components/sections/about/VisionMission'
import IntegratedModel from '@/components/sections/about/IntegratedModel'
import Values from '@/components/sections/about/Values'

export const metadata: Metadata = {
  title: 'About — Silverring Ventures',
  description:
    'Learn about Silverring Ventures — an integrated real estate development company built on a vision of seamless, disciplined collaboration across all development disciplines.',
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <VisionMission />
      <IntegratedModel />
      <Values />
    </>
  )
}
