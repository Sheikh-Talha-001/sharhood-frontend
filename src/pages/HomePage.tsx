import { SmoothScroll } from "@/src/components/SmoothScroll";
import { Navbar } from "@/src/components/Navbar";
import { Hero } from "@/src/components/Hero";
import { CategoryStrip } from "@/src/components/CategoryStrip";
import { TrustSection } from "@/src/components/TrustSection";
import { PromoBanner } from "@/src/components/PromoBanner";
import { SharingSection } from "@/src/components/SharingSection";
import { SafetySection } from "@/src/components/SafetySection";
import { Testimonials } from "@/src/components/Testimonials";
import { FAQ } from "@/src/components/FAQ";
import { CTA } from "@/src/components/CTA";
import { Footer } from "@/src/components/Footer";

export function HomePage() {
  return (
    <SmoothScroll>
      <div className="relative min-h-screen bg-brand-bg font-sans">
        <Navbar />
        <main>
          <Hero />
          <CategoryStrip />
          <TrustSection />
          <PromoBanner />
          <SharingSection />
          <SafetySection />
          <Testimonials />
          <FAQ />
          <CTA />
        </main>
      </div>
    </SmoothScroll>
  );
}
