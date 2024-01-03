import Image from 'next/image'
import { Button } from '@/components/ui/button'

import { HomeIcon } from '@heroicons/react/24/outline'

export default function Features() {
  return (
    <div className='max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto'>
      <div className='grid sm:grid-cols-2 lg:grid-cols-4 items-center gap-12'>
        <div>
          <div className='relative flex justify-center items-center w-12 h-12 bg-white rounded-xl before:absolute before:-inset-px before:-z-[1] before:bg-gradient-to-br before:from-blue-600 before:via-transparent before:to-violet-600 before:rounded-xl dark:bg-slate-900'>
            <HomeIcon className='h-8 w-8 text-primary' />
          </div>
          <div className='mt-5'>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-white'>
              Responsive
            </h3>
            <p className='mt-1 text-gray-600 dark:text-gray-400'>
              Responsive, and mobile-first project on the web
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
