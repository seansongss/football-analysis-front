import './globals.css'
import Providers from './providers'
import SiteHeader from '@/components/SiteHeader'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">{/* no 'dark' class here */}
      <body className="min-h-screen bg-background text-foreground">
        <Providers>
          <SiteHeader />
          {children}
        </Providers>
      </body>
    </html>
  )
}
