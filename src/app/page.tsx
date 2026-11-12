import { Hero } from "@/components/sections/hero";
import { AboutSection } from "@/components/sections/about";
import { FeaturedVideoSection } from "@/components/sections/featured-video";
import { PromoSection } from "@/components/sections/promo";
import { PhilosophySection } from "@/components/sections/philosophy";
import { ReviewsSection } from "@/components/sections/reviews";
import { ServicesSection } from "@/components/sections/services";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <AboutSection />
      <PromoSection />
      <FeaturedVideoSection />
      <ReviewsSection />
      <PhilosophySection />
      <ServicesSection />
    </main>
  );
}
