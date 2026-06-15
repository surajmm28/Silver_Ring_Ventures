import Hero from '@/components/sections/home/Hero'
import AboutPreview from '@/components/sections/home/AboutPreview'
import EcosystemPreview from '@/components/sections/home/EcosystemPreview'
import ProjectsPreview from '@/components/sections/home/ProjectsPreview'
import WhySilverring from '@/components/sections/home/WhySilverring'
import FounderSection from '@/components/sections/home/FounderSection'

export default function Home() {
  return (
    <>
      <Hero />
      <AboutPreview />
      <EcosystemPreview />
      <ProjectsPreview />
      <WhySilverring />
      <FounderSection />
    </>
  )
}
