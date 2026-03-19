import type { Metadata } from 'next'
import ConnectClient from './connect-client'

export const metadata: Metadata = {
  title: 'Connect SpadeChat to Your AI',
  description: 'Set up SpadeChat in Claude Desktop or ChatGPT in under 30 seconds. Find and book local businesses through any AI assistant.',
}

export default function ConnectPage() {
  return <ConnectClient />
}
