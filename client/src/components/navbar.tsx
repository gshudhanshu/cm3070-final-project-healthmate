"use client";
import React, { useEffect, useState, useLayoutEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import Hamburger from "hamburger-react";
import { UserNav } from "@/components/user-nav";
import { Notification } from "@/components/notification";
import { DashboardNav } from "@/components/dashboard-nav";

import { useAuthStore } from "@/store/useAuthStore";
import LoadingComponent from "./common/loading";

// Define navigation items
const navItems = [
  { href: "/", label: "Home" },
  { href: "/find-practitioner", label: "Find Practitioner" },
  { href: "/dashboard", label: "Dashboard", auth: true },
  { href: "/contact-us", label: "Contact Us" },
  // { href: "/resources", label: "Resources" },
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

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const { user, fetchUser, isLoading } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const router = useRouter();
  const pathname = usePathname();
  const isDashboardRoute = pathname.startsWith("/dashboard");

  useEffect(() => {
    if (!isLoading && !user && isDashboardRoute) {
      router.push("/auth/login");
    }
  }, [user]);

  return (
    <nav
      className={cn("relative bg-white shadow dark:bg-slate-800", className)}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex">
              <Logo />
            </Link>

            {/* Mobile menu button */}
            <div className="flex gap-3 lg:hidden">
              {/* action buttons in the sm and md hide in  */}
              <div className="hidden items-center gap-3 sm:flex md:flex lg:mt-0 lg:hidden">
                {user !== null ? (
                  <>
                    <Notification />
                    {/* <ModeToggle /> */}
                    <UserNav />
                  </>
                ) : (
                  <GuestActions />
                )}
              </div>
              {user !== null && (
                <span className="hidden sm:flex">
                  <ModeToggle />
                </span>
              )}

              <Button
                variant="ghost"
                onClick={toggleMenu}
                type="button"
                className="px-0 dark:hover:bg-slate-700"
              >
                <Hamburger
                  toggled={isOpen}
                  toggle={toggleMenu}
                  size={25}
                  // color={theme === "dark" ? "#fff" : "#0f172a"}
                />
              </Button>
            </div>
          </div>

          {/* Mobile Menu open: "block", Menu closed: "hidden" */}
          <div
            className={`${
              isOpen
                ? "translate-x-0 opacity-100 "
                : "-translate-x-full opacity-0"
            } absolute inset-x-0 z-20 w-full bg-white px-6 py-6 transition-all duration-300 ease-in-out lg:relative lg:top-0 lg:mt-0 lg:flex lg:w-auto lg:translate-x-0 lg:items-center lg:bg-transparent lg:p-0 lg:opacity-100 dark:bg-slate-800`}
          >
            {/* nav */}
            <div className="flex flex-col lg:mx-6 lg:flex-row lg:items-center lg:space-x-3">
              {navItems.map((item, index) => {
                if (item.auth && !user) return null;
                return (
                  <Link
                    href={item.href}
                    key={index}
                    className="mt-2 transform rounded-md px-3 py-2 text-slate-700 transition-colors duration-300 hover:bg-slate-100 lg:mt-0 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
            {/* action buttons inside the mobile nav size */}
            <div className="mx-3 mt-4 flex items-center gap-3 sm:hidden lg:mt-0 ">
              {user !== null ? <AuthActions /> : <GuestActions />}
            </div>
          </div>
          {/* action buttons inside the mobile nav size */}
          <div className="mx-3 mt-4 hidden items-center gap-3 lg:mt-0 lg:flex ">
            {user !== null ? <AuthActions /> : <GuestActions />}
          </div>
        </div>
      </div>
      {isDashboardRoute && user && <DashboardNav />}
    </nav>
  );
}
