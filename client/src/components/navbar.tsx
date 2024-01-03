'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import Logo from '@/components/logo'
import { Button } from '@/components/ui/button'

import { BellIcon } from '@heroicons/react/24/outline'
import { ModeToggle } from '@/components/mode-toggle'

import Hamburger from 'hamburger-react'
import { useTheme } from 'next-themes'

import { userStore } from '@/store/user'
import { UserNav } from '@/components/user-nav'
import { Notification } from '@/components/notification'

// Define navigation items
const navItems = [
  { href: '/', label: 'Home' },
  { href: '/find-practitioner', label: 'Find Practitioner' },
  { href: '/dashboard', label: 'Dashboard', auth: true },
  { href: '/contact-us', label: 'Contact Us' },
  { href: '/resources', label: 'Resources' },
]

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const user = userStore((state: any) => state.user)

  const { theme } = useTheme()

  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  // return (
  //   <nav>
  //     <div className='max-w-7xl mx-auto'>
  //       <div className='flex mx-auto justify-between w-5/6 '>
  //         {/* Primary menu and logo */}
  //         <div className='flex items-center gap-16 my-12'>
  //           {/* logo */}
  //           <a className='flex items-center mb-4 font-medium text-gray-900 title-font md:mb-0'>
  //             <Logo />
  //           </a>
  //           {/* primary */}
  //           <div className='hidden lg:flex gap-8 '>
  //             {navItems.map((item, index) => (
  //               <Link
  //                 href={item.href}
  //                 key={index}
  //                 className='text-sm font-medium transition-colors text-muted-foreground hover:text-primary'
  //               >
  //                 {item.label}
  //               </Link>
  //             ))}
  //           </div>
  //         </div>
  //         {/* secondary */}
  //         <div className='flex gap-6'>
  //           <div className='hidden xs:flex items-center gap-10'>
  //             <div className='hidden lg:flex items-center gap-2'>
  //               <Menu className='h-6 w-6' />
  //               <Menu className='h-6 w-6' />
  //             </div>
  //             <div>
  //               <button className='rounded-full border-solid border-2 border-gray-300 py-2 px-4 hover:bg-gray-700 hover:text-gray-100'>
  //                 Free Trial
  //               </button>
  //             </div>
  //           </div>
  //           {/* Mobile navigation toggle */}
  //           <div className='lg:hidden flex items-center'>
  //             <button onClick={() => setToggleMenu(!toggleMenu)}>
  //               <Menu className='h-6' />
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //     {/* mobile navigation */}
  //     <div
  //       className={`fixed z-40 w-full  bg-gray-100 overflow-hidden flex flex-col lg:hidden gap-12  origin-top duration-300 ${
  //         !toggleMenu ? 'h-0' : 'h-full'
  //       }`}
  //     >
  //       <div className='px-8'>
  //         <div className='flex flex-col gap-8 font-bold tracking-wider'>
  //           {navItems.map((item, index) => (
  //             <Link
  //               href={item.href}
  //               key={index}
  //               className='text-sm font-medium transition-colors text-muted-foreground hover:text-primary'
  //             >
  //               {item.label}
  //             </Link>
  //           ))}
  //         </div>
  //       </div>
  //     </div>
  //   </nav>
  // )

  return (
    <nav className='relative bg-white shadow dark:bg-gray-800'>
      <div className='container px-6 py-4 mx-auto'>
        <div className='lg:flex lg:items-center lg:justify-between'>
          <div className='flex items-center justify-between'>
            <Link href='/' className='flex'>
              <Logo />
            </Link>

            {/* Mobile menu button */}
            <div className='flex lg:hidden'>
              <Button
                variant='ghost'
                onClick={toggleMenu}
                type='button'
                className='px-0'
              >
                <Hamburger
                  toggled={isOpen}
                  toggle={toggleMenu}
                  size={25}
                  color={theme === 'dark' ? '#fff' : '#000'}
                />
              </Button>
            </div>
          </div>

          {/* Mobile Menu open: "block", Menu closed: "hidden" */}
          <div
            className={`${
              isOpen
                ? 'translate-x-0 opacity-100 '
                : 'opacity-0 -translate-x-full'
            } absolute inset-x-0 z-20 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 lg:mt-0 lg:p-0 lg:top-0 lg:relative lg:bg-transparent lg:w-auto lg:opacity-100 lg:translate-x-0 lg:flex lg:items-center`}
          >
            <div className='flex flex-col -mx-6 lg:flex-row lg:items-center lg:mx-8'>
              {navItems.map((item, index) => (
                <Link
                  href={item.href}
                  key={index}
                  className='px-3 py-2 mx-3 mt-2 text-gray-700 transition-colors duration-300 transform rounded-md lg:mt-0 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className='flex items-center space-x-2 mt-4 lg:mt-0'>
              <Notification />
              <ModeToggle />
              <UserNav />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
