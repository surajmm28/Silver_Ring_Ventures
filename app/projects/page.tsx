import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import ProjectsHero from '@/components/sections/projects/ProjectsHero'
import ProjectGrid from '@/components/sections/projects/ProjectGrid'

const BuildingConstruction = dynamic(
  () => import('@/components/three/BuildingConstruction'),
  { ssr: false }
)

export const metadata: Metadata = {
  title: 'Projects — Silverring Ventures',
  description:
    'Developments that define neighbourhoods. Explore upcoming and completed projects by Silverring Ventures across Bangalore.',
}

export default function ProjectsPage() {
  return (
    <>
      <ProjectsHero />
      <BuildingConstruction />
      <ProjectGrid />
    </>
  )
}
