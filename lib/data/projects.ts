export type ProjectType = 'Residential' | 'Commercial' | 'Land'

export interface Project {
  id: string
  name: string
  location: string
  type: ProjectType
  area: string
  status: string
  year: string
  description: string
  image: string
  gallery: string[]
}

export const projects: Project[] = [
  {
    id: 'project-1',
    name: 'Coming Soon',
    location: 'Indiranagar, Bangalore',
    type: 'Residential',
    area: 'TBA',
    status: 'Upcoming',
    year: '2025',
    description:
      'A premium residential development in the heart of Indiranagar. Details to be announced.',
    image: '/images/projects/placeholder-1.jpg',
    gallery: [],
  },
  {
    id: 'project-2',
    name: 'Coming Soon',
    location: 'Koramangala, Bangalore',
    type: 'Commercial',
    area: 'TBA',
    status: 'Upcoming',
    year: '2025',
    description:
      'A landmark commercial project designed for the modern enterprise. Details to be announced.',
    image: '/images/projects/placeholder-2.jpg',
    gallery: [],
  },
  {
    id: 'project-3',
    name: 'Coming Soon',
    location: 'Whitefield, Bangalore',
    type: 'Residential',
    area: 'TBA',
    status: 'Under Development',
    year: '2025',
    description:
      'Luxury residences crafted for the discerning buyer. Details to be announced.',
    image: '/images/projects/placeholder-3.jpg',
    gallery: [],
  },
  {
    id: 'project-4',
    name: 'Coming Soon',
    location: 'Sarjapur Road, Bangalore',
    type: 'Land',
    area: 'TBA',
    status: 'Upcoming',
    year: '2025',
    description:
      'Prime land development opportunity in one of Bangalore\'s fastest growing corridors.',
    image: '/images/projects/placeholder-4.jpg',
    gallery: [],
  },
  {
    id: 'project-5',
    name: 'Coming Soon',
    location: 'HSR Layout, Bangalore',
    type: 'Residential',
    area: 'TBA',
    status: 'Upcoming',
    year: '2025',
    description:
      'Contemporary living spaces in a sought-after residential destination.',
    image: '/images/projects/placeholder-5.jpg',
    gallery: [],
  },
  {
    id: 'project-6',
    name: 'Coming Soon',
    location: 'JP Nagar, Bangalore',
    type: 'Commercial',
    area: 'TBA',
    status: 'Upcoming',
    year: '2026',
    description:
      'A new benchmark for commercial excellence in South Bangalore.',
    image: '/images/projects/placeholder-6.jpg',
    gallery: [],
  },
]
