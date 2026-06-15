import type { Metadata } from 'next'
import { Barlow, Barlow_Condensed } from 'next/font/google'
import '../styles/globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Cursor from '@/components/ui/Cursor'
import Preloader from '@/components/ui/Preloader'
import ScrollProgress from '@/components/ui/ScrollProgress'
import PageTransition from '@/components/layout/PageTransition'
import SmoothScroll from '@/components/layout/SmoothScroll'
import GyroController from '@/components/ui/GyroController'

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  display: 'swap',
  variable: '--font-barlow',
  preload: true,
})

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '800'],
  display: 'swap',
  variable: '--font-barlow-condensed',
  preload: true,
})

export const metadata: Metadata = {
  title: 'Silverring Ventures — Integrated Real Estate Development',
  description:
    'An integrated real estate development company delivering superior outcomes across development, advisory, construction, media, and interiors in Bangalore.',
  keywords:
    'real estate development bangalore, luxury residential, land development, integrated real estate, Indiranagar, Silverring Ventures',
  openGraph: {
    title: 'Silverring Ventures',
    description: 'Building value through integrated excellence.',
    url: 'https://silverringventures.com',
    siteName: 'Silverring Ventures',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Silverring Ventures',
    description: 'Building value through integrated excellence.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Preloader />
        <ScrollProgress />
        <Cursor />
        <GyroController />
        <Navbar />
        <SmoothScroll>
          <PageTransition>
            <main style={{ paddingTop: 72 }}>
              {children}
            </main>
            <Footer />
          </PageTransition>
        </SmoothScroll>
      </body>
    </html>
  )
}
