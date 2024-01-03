'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import Logo from '@/components/logo'
import { Button } from '@/components/ui/button'

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

  return (
    // <nav className='relative bg-white shadow dark:bg-slate-800'>
    <nav
      className={cn('relative bg-white shadow dark:bg-slate-800', className)}
    >
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
                className='px-0 dark:hover:bg-slate-700'
              >
                <Hamburger
                  toggled={isOpen}
                  toggle={toggleMenu}
                  size={25}
                  color={theme === 'dark' ? '#fff' : '#0f172a'}
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
            } absolute inset-x-0 z-20 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-white dark:bg-slate-800 lg:mt-0 lg:p-0 lg:top-0 lg:relative lg:bg-transparent lg:w-auto lg:opacity-100 lg:translate-x-0 lg:flex lg:items-center`}
          >
            {/* nav */}
            <div className='flex flex-col mx-6 lg:flex-row lg:items-center lg:mx-6 space-x-3'>
              {navItems.map((item, index) => (
                <Link
                  href={item.href}
                  key={index}
                  className='px-3 py-2 mt-2 text-slate-700 transition-colors duration-300 transform rounded-md lg:mt-0 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* action buttons */}
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
