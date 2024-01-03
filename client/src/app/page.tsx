import Hero from '@/components/home/hero'
import Features from '@/components/home/features'

export default function Home() {
  return (
    <div className='flex flex-col py-24 space-y-24'>
      <Hero />
      <Features />
    </div>
  )
}
