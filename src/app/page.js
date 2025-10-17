import Image from "next/image";
import Link from "next/link";
import HeroSection from "@/components/Home/heroSection";
import AIAssistantSection from "@/components/Home/AiAssistantSection";
import MarginWrapper from "@/components/wrappers/sectionWrapper";
export default function Home() {
  return (
    <>
    <HeroSection />
    <AIAssistantSection />
  </>
  );
}
