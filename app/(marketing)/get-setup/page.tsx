import type { Metadata } from 'next'
import GetSetupForm from './get-setup-form'

export const metadata: Metadata = {
  title: 'Get Set Up Free — We\'ll Do It For You | Practizio',
}

export default function GetSetupPage() {
  return <GetSetupForm />
}
