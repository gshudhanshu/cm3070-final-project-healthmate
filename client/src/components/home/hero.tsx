import Image from "next/image";
import { Button } from "@/components/ui/button";
export default function Hero() {
  return (
    <section className="container mx-auto px-4 text-slate-600 sm:px-6 lg:px-8 dark:text-slate-400 ">
      <div className="flex flex-col items-center gap-0 md:gap-12 lg:flex-row">
        <div className="mb-16 flex flex-col items-center text-center md:mb-0 lg:w-1/2 lg:items-start lg:text-left">
          <h1 className="mb-4 text-4xl font-bold  leading-[1.2] text-slate-700 sm:text-5xl sm:leading-[1.2] dark:text-slate-100">
            Connecting Care to Communities
          </h1>
          <p className="mb-8 leading-relaxed">
            At Health Mate, we&apos;re dedicated to making medical advice and
            care accessible to underserved communities. Our telemedicine service
            links you to healthcare professionals through a secure, easy-to-use
            platform, ensuring you get the help you need, when you need it.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button variant="default" size="lg">
              Find a Practitioner
            </Button>
            <Button variant="secondary" size="lg">
              Join Our Community
            </Button>
          </div>
        </div>
        <div className="md-w-5/6 lg:w-1/2">
          <Image
            alt="hero"
            src="/assets/images/hero.jpg"
            width={1500}
            height={1500}
            className="flex w-full rounded-[25px] object-cover object-center "
          />
        </div>
      </div>
    </section>
  );
}
