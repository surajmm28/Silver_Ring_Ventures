'use client'

import dynamic from 'next/dynamic'

const BuildingConstruction = dynamic(
  () => import('@/components/three/BuildingConstruction'),
  { ssr: false }
)

export default function BuildingSection() {
  return <BuildingConstruction />
}
