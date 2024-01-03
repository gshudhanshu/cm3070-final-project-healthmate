import Hero from "@/components/home/hero";
import Features from "@/components/home/features";
import Numbers from "@/components/home/numbers";
import Faqs from "@/components/home/faqs";

export default function Home() {
  return (
    <div className="flex flex-col gap-24 py-12 md:py-24">
      <Hero />
      <Features />
      <Numbers />
      <Faqs />
    </div>
  );
}
