"use client";

import PasswordResetConfirm from "@/components/auth/password-reset-form";
import Image from "next/image";

function Page() {
  return (
    <section className="container mx-auto flex flex-col gap-5 py-12">
      <div className="grid grid-cols-1 items-center justify-center gap-0 md:grid-cols-2 md:gap-16 lg:flex-row">
        <PasswordResetConfirm className="mx-auto max-w-sm" />
        <div className="h-full ">
          <Image
            alt="hero"
            src="/assets/images/hero.jpg"
            width={1200}
            height={1200}
            className="flex h-full w-full rounded-[25px] object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}

export default Page;
