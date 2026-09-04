import type { Metadata } from "next";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { Hero } from "@/components/marketing/hero";
import { StatsBar } from "@/components/marketing/stats-bar";
import { FeaturesSection } from "@/components/marketing/features-section";
import { CaseLibraryPreview } from "@/components/marketing/case-library-preview";
import { ChatDemo } from "@/components/marketing/chat-demo";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { StudyToolsPreview } from "@/components/marketing/study-tools-preview";
import { PricingSection } from "@/components/marketing/pricing-section";
import { FinalCta } from "@/components/marketing/final-cta";

export const metadata: Metadata = {
  title: "StudyRex — Master the law with AI",
  description:
    "An AI-powered study companion for law students, CLAT aspirants, and judiciary candidates.",
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <StatsBar />
        <FeaturesSection />
        <CaseLibraryPreview />
        <ChatDemo />
        <HowItWorks />
        <StudyToolsPreview />
        <PricingSection />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
