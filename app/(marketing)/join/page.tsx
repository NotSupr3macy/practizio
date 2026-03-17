import type { Metadata } from 'next'
import { Suspense } from 'react'
import JoinForm from './join-form'

export const metadata: Metadata = {
  title: 'Join Practizio — Get Your Business AI-Bookable | Practizio',
}

export default function JoinPage() {
  return (
    <Suspense>
      <JoinForm />
    </Suspense>
  )
}
