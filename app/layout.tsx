import type { Metadata } from 'next'
import './globals.css'

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
    url: 'https://practizio.com',
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
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  )
}
