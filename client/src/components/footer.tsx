import React from "react";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";

import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/logo";

// Define navigation items
const navItems = [
  { href: "/", label: "Home" },
  { href: "/find-practitioner", label: "Find Practitioner" },
  { href: "/dashboard", label: "Dashboard", auth: true },
  { href: "/contact-us", label: "Contact Us" },
  // { href: '/resources', label: 'Resources' },
];

export function Footer({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn("bg-foreground dark:bg-slate-900 ", className)}>
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex">
            <Logo className="text-slate-100" />
          </Link>

          <div className="-mx-4 mt-6 flex flex-wrap justify-center">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href="/"
                className="mx-4 text-sm text-slate-300 transition-colors duration-300 hover:text-primary dark:hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <hr className="my-6 border-slate-700" />

        <p className="text-center text-sm text-slate-500 dark:text-slate-300">
          © 2024 Health Mate. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
