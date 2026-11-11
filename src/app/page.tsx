import { Hero } from "@/components/sections/hero";
import { AboutSection } from "@/components/sections/about";
import { FeaturedVideoSection } from "@/components/sections/featured-video";
import { PhilosophySection } from "@/components/sections/philosophy";
import { ReviewsSection } from "@/components/sections/reviews";
import { ServicesSection } from "@/components/sections/services";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <AboutSection />
      <FeaturedVideoSection />
      <ReviewsSection />
      <PhilosophySection />
      <ServicesSection />
    </main>
  );
}
