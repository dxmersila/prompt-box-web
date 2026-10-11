import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AppProviders from '@/providers/AppProviders'

export const metadata: Metadata = {
  title: 'Prompt Box',
  description: 'Prompt Box',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html suppressHydrationWarning>
      <body>
        <AppProviders>
          <Header />
          {children}
          <Footer />
        </AppProviders>
      </body>
    </html>
  )
}
