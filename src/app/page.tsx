"use client"

import { useTranslations } from "next-intl";
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
//import { WhatsAppButton } from "@/components/WhatsAppButton";

export default function LandingPage() {
  const t = useTranslations("LandingPage.earnings");

  return (
    <div className="relative overflow-hidden bg-background text-foreground font-sans">
      <Header />

      <main className="pt-20">
        <HeroSection />
        <MissionSeparator />
        <ProcessSection />
        <div className="py-20 md:py-24 bg-background text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">{t('title')}</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">{t('subtitle')}</p>
            <div className="mt-16 flex justify-center">
              <EarningsChart />
            </div>
          </div>
        </div>
        <FocusSeparator />
        <PricingSection />
        <TrustSeparator />
        <TrustStatsSection />
        <FaqSection />
      </main>

      <Footer />

      {/* WhatsApp Support Button 
      <WhatsAppButton phoneNumber="+1234567890" />
      */}
    </div >
  )
}
