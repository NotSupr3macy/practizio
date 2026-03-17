import type { Metadata } from 'next'
import { Suspense } from 'react'
import JoinForm from './join-form'

export const metadata: Metadata = {
  title: 'Join SpadeChat — Get Your Business AI-Bookable | SpadeChat',
}

export default function JoinPage() {
  return (
    <Suspense>
      <JoinForm />
    </Suspense>
  )
}
