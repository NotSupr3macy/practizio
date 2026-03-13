import type { Metadata } from 'next'
import { Inter, Inter_Tight, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800', '900'],
  variable: '--font-inter-tight',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Practizio — Make Your Practice Discoverable by AI Agents',
    template: '%s | Practizio',
  },
  description:
    'Practizio makes professional practices discoverable and bookable by AI agents like Claude, ChatGPT, and Gemini via MCP. The subscription that makes you visible to the agentic era.',
  openGraph: {
    title: 'Practizio — AI-Accessible Practice Management',
    description:
      'Make your dental, medical, legal, or financial practice discoverable by every AI agent on Earth.',
    url: 'https://practizio.com',
    siteName: 'Practizio',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen noise-bg">
        {children}
      </body>
    </html>
  )
}
