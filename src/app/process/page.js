import ProcessHeroSection from '@/components/Process/ProcessHeroSection';
import ProcessMainSection from '@/components/Process/ProcessMainSection';
import ProcessGridSection from '@/components/Process/ProcessGridSection';
import ProcessCTASection from '@/components/Process/ProcessCTASection';
import ContactSection from '@/components/Home/ContactSection';
import HorizontalMarginWrapper from '@/components/wrappers/horizontalmarginWrapper';
export default function ProcessPage() {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      <ProcessHeroSection />
            <HorizontalMarginWrapper left={50} right={50}>
        <ProcessMainSection />
        <ProcessGridSection />
      </HorizontalMarginWrapper>
        <ProcessCTASection />
        <ContactSection noThankYou={true}/>
    </div>
  );
}
