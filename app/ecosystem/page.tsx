import type { Metadata } from 'next'
import EcosystemHero from '@/components/sections/ecosystem/EcosystemHero'
import UnitList from '@/components/sections/ecosystem/UnitList'
import Lifecycle from '@/components/sections/ecosystem/Lifecycle'
import CTASection from '@/components/sections/home/CTASection'

export const metadata: Metadata = {
  title: 'The Ecosystem — Silverring Ventures',
  description:
    'Five specialist units. One unified strategy. Explore the Silverring ecosystem — covering development, advisory, construction, media, and interiors.',
}

export default function EcosystemPage() {
  return (
    <>
      <EcosystemHero />
      <UnitList />
      <Lifecycle />
      <CTASection />
    </>
  )
}
