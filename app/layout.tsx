import type { Metadata } from 'next'
import { Syne, Space_Grotesk } from 'next/font/google'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'SpadeChat — Make Your Business Discoverable by AI Agents',
    template: '%s | SpadeChat',
  },
  description:
    'SpadeChat makes any business discoverable and bookable by AI assistants like Claude, ChatGPT, and Gemini. Appointments, orders, products, and more — the platform that makes you visible to the AI era.',
  openGraph: {
    title: 'SpadeChat — AI-Accessible for Any Business',
    description:
      'Make your business discoverable by every AI agent on Earth. Hair salons, restaurants, yoga studios, retail shops — appointments, orders, and more.',
    url: 'https://spadechat.com',
    siteName: 'SpadeChat',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${syne.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen noise-bg">
        {children}
      </body>
    </html>
  )
}
