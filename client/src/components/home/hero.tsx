import Image from 'next/image'
import { Button } from '@/components/ui/button'
export default function Hero() {
  return (
    <section className='text-slate-600 dark:text-slate-400 '>
      <div className='container mx-auto flex px-5 md:flex-row flex-col items-center'>
        <div className='md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center'>
          <h1 className='sm:text-5xl sm:leading-[1.2] leading-[1.2]  text-4xl mb-4 font-bold text-slate-700 dark:text-slate-100'>
            Connecting You to Health Care, Anytime, Anywhere
          </h1>
          <p className='mb-8 leading-relaxed'>
            At Health Mate, we&apos;re dedicated to making medical advice and
            care accessible to underserved communities. Our telemedicine service
            links you to healthcare professionals through a secure, easy-to-use
            platform, ensuring you get the help you need, when you need it.
          </p>
          <div className='flex justify-center'>
            {/* <Button className='inline-flex text-white bg-primary border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded text-lg'> */}
            <Button variant='default' size='lg'>
              Find a Practitioner
            </Button>
            <Button variant='secondary' size='lg' className='ml-4'>
              Sign Up
            </Button>
          </div>
        </div>
        <div className='lg:max-w-lg lg:w-full md:w-1/2 w-5/6'>
          <Image
            className='object-cover object-center rounded-[25px] '
            alt='hero'
            src='/assets/images/hero.jpg'
            width={1000}
            height={1000}
          />
        </div>
      </div>
    </section>
  )
}
