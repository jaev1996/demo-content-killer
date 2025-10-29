"use client"

import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { MissionSeparator } from "@/components/landing/MissionSeparator";
import { ProcessSection } from "@/components/landing/ProcessSection";
import { FocusSeparator } from "@/components/landing/FocusSeparator";
import { EarningsChart } from "@/components/landing/EarningsChart";
import { PricingSection } from "@/components/landing/PricingSection";
import { TrustSeparator } from "@/components/landing/TrustSeparator";
import { TrustStatsSection } from "@/components/landing/TrustStatsSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden bg-black text-white font-sans">
      <Header />

      <main className="pt-20">
        <HeroSection />
        <MissionSeparator />
        <ProcessSection />
        <div className="py-20 bg-black flex justify-center">
          <EarningsChart />
        </div>
        <PricingSection />
        <TrustSeparator />
        <TrustStatsSection />
        <FaqSection />
      </main>

      <Footer />
    </div >
  )
}
