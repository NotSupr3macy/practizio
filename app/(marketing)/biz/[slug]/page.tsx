import { redirect } from 'next/navigation'

// /biz/[slug] redirects to /directory/[slug] for now
export default async function BizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  redirect(`/directory/${slug}`)
}
