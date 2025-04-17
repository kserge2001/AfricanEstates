import { HeroSection } from "@/components/home/hero-section";
import { FeaturedListings } from "@/components/home/featured-listings";
import { PopularLocations } from "@/components/home/popular-locations";
import { HowItWorks } from "@/components/home/how-it-works";
import { Testimonials } from "@/components/home/testimonials";
import { CTASection } from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <FeaturedListings />
      <PopularLocations />
      <HowItWorks />
      <Testimonials />
      <CTASection />
    </div>
  );
}
