import type { Metadata } from 'next'
import BuildingSection from '@/components/sections/projects/BuildingSection'
import ProjectGrid from '@/components/sections/projects/ProjectGrid'

export const metadata: Metadata = {
  title: 'Projects — Silverring Ventures',
  description:
    'Developments that define neighbourhoods. Explore upcoming and completed projects by Silverring Ventures across Bangalore.',
}

export default function ProjectsPage() {
  return (
    <>
      <BuildingSection />
      <ProjectGrid />
    </>
  )
}
