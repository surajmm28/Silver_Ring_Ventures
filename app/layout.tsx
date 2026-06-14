import type { Metadata } from 'next'
import '../styles/globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Cursor from '@/components/ui/Cursor'
import Preloader from '@/components/ui/Preloader'
import PageTransition from '@/components/layout/PageTransition'
import SmoothScroll from '@/components/layout/SmoothScroll'

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600;700;800&family=Barlow:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Preloader />
        <Cursor />
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
