import { Hero } from '@/components/marketing/hero'
import { CommandBar } from '@/components/marketing/command-bar'
import { ProblemSolution } from '@/components/marketing/problem-solution'
import { BentoGrid } from '@/components/marketing/bento-grid'
import { HowItWorks } from '@/components/marketing/how-it-works'
import { Pricing } from '@/components/marketing/pricing'
import { Testimonials } from '@/components/marketing/testimonials'

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <CommandBar />
      <ProblemSolution />
      <BentoGrid />
      <Pricing />
      <Testimonials />
    </>
  )
}
