import Hero from '@/components/sections/home/Hero'
import MarqueeTicker from '@/components/ui/MarqueeTicker'
import AboutPreview from '@/components/sections/home/AboutPreview'
import ManifestoSection from '@/components/sections/home/ManifestoSection'
import EcosystemCards from '@/components/sections/home/EcosystemCards'
import ProjectsPreview from '@/components/sections/home/ProjectsPreview'
import WhySilverring from '@/components/sections/home/WhySilverring'
import FounderSection from '@/components/sections/home/FounderSection'
import CTASection from '@/components/sections/home/CTASection'

export default function Home() {
  return (
    <>
      <Hero />
      <MarqueeTicker />
      <AboutPreview />
      <ManifestoSection />
      <EcosystemCards />
      <MarqueeTicker />
      <ProjectsPreview />
      <WhySilverring />
      <FounderSection />
      <CTASection />
    </>
  )
}
