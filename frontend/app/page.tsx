"use client"

import { Header } from "@/components/landing/header"
import { HeroSection } from "@/components/landing/hero-section"
import { SecurityBanner } from "@/components/landing/security-banner"
import { HowItWorks } from "@/components/landing/how-it-works"
import { FeaturesSection } from "@/components/landing/features-section"
import { PrivacySection } from "@/components/landing/privacy-section"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <SecurityBanner />
        <HowItWorks />
        <FeaturesSection />
        <PrivacySection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
