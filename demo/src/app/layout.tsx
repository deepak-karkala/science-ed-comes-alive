import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vigyan Dost Demo',
  description: 'Investor demo for verified science simulations with Socratic AI guidance.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
