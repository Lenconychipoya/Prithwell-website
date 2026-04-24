import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Prithwell Motor Spares — Quality Parts, Harare',
  description: 'Zimbabwe\'s trusted auto parts supplier. Genuine and quality aftermarket parts for Toyota, Nissan, Honda, Mazda and more. Fast delivery across Zimbabwe.',
  keywords: 'auto parts Zimbabwe, car parts Harare, Toyota parts, Nissan parts, spare parts Zimbabwe',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#0a1628" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
