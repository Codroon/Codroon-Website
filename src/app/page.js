import Image from "next/image";
import Link from "next/link";
import HeroSection from "@/components/Home/heroSection";
import AIAssistantSection from "@/components/Home/AiAssistantSection";
import OurSolutionsSection from "@/components/Home/OurSolutionsSection";
import WhyChooseSection from "@/components/Home/WhyChooseSection";
import FAQSection from "@/components/Home/FAQSection";
import ContactSection from "@/components/Home/ContactSection";
import MarginWrapper from "@/components/wrappers/sectionWrapper";

export default function Home() {
  return (
    <div className="w-full">
      <HeroSection />
      <AIAssistantSection />
      <OurSolutionsSection />
      <WhyChooseSection />
      <FAQSection />
      <ContactSection />
    </div>
  );
}
