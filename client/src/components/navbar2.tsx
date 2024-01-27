"use client";

// Import necessary components and hooks
import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import Hamburger from "hamburger-react";
import { useAuthStore } from "@/store/useAuthStore";
import { UserNav } from "@/components/user-nav";
import { Notification } from "@/components/notification";
import { DashboardNav } from "@/components/dashboard-nav";

// Define navigation items
const navItems = [
  { href: "/", label: "Home" },
  { href: "/find-practitioner", label: "Find Practitioner" },
  { href: "/dashboard", label: "Dashboard", auth: true },
  { href: "/contact-us", label: "Contact Us" },
  { href: "/resources", label: "Resources" },
];

const AuthActions = () => {
  return (
    <>
      <Notification />
      <UserNav />
      <ModeToggle />
    </>
  );
};

const GuestActions = () => {
  return (
    <>
      <Link href="/auth/login">
        <Button variant="default">Login</Button>
      </Link>
      <Link href="/auth/register">
        <Button variant="default">Sign Up</Button>
      </Link>
      <ModeToggle />
    </>
  );
};

export function MainNav({ className }: React.HTMLAttributes<HTMLElement>) {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  const RenderNavItems = () =>
    navItems.map(
      (item, index) =>
        (!item.auth || user) && (
          <Link
            key={index}
            href={item.href}
            className="mt-2 rounded-md px-3 py-2 text-slate-700 transition-colors duration-300 hover:bg-slate-100 lg:mt-0 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            {item.label}
          </Link>
        ),
    );

  return (
    <nav
      className={cn("relative bg-white shadow dark:bg-slate-800", className)}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Logo />
            </Link>
            <div className="flex gap-3 lg:hidden">
              <div className="hidden items-center gap-3 sm:flex md:flex lg:hidden">
                {user ? <AuthActions /> : <GuestActions />}
              </div>
              {!user && (
                <span className="hidden sm:flex">
                  <ModeToggle />
                </span>
              )}
              <Button
                variant="ghost"
                onClick={toggleMenu}
                className="px-0 dark:hover:bg-slate-700"
              >
                <Hamburger toggled={isOpen} toggle={toggleMenu} size={25} />
              </Button>
            </div>
          </div>

          <div
            className={cn(
              "absolute inset-x-0 z-20 w-full px-6 py-6 transition-all duration-300 ease-in-out lg:relative lg:top-0 lg:mt-0 lg:flex lg:w-auto lg:items-center lg:bg-transparent lg:p-0 dark:bg-slate-800",
              isOpen
                ? "translate-x-0 opacity-100"
                : "-translate-x-full opacity-0",
            )}
          >
            <div className="flex flex-col lg:mx-6 lg:flex-row lg:items-center lg:space-x-3">
              <RenderNavItems />
            </div>
            <div className="mx-3 mt-4 flex items-center gap-3 sm:hidden lg:hidden">
              {user ? <AuthActions /> : <GuestActions />}
            </div>
          </div>
          <div className="mx-3 mt-4 hidden items-center gap-3 lg:flex">
            {user ? <AuthActions /> : <GuestActions />}
          </div>
        </div>
      </div>
      {user && <DashboardNav />}
    </nav>
  );
}
