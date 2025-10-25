import CaseStudiesHeroSection from '@/components/CaseStudies/CaseStudiesHeroSection';
import AtCodroonSection from '@/components/CaseStudies/AtCodroonSection';
import CaseStudyCardsSection from '@/components/CaseStudies/CaseStudyCardsSection';
import CaseStudiesCTASection from '@/components/CaseStudies/CaseStudiesCTASection';
import HorizontalMarginWrapper from '@/components/wrappers/horizontalmarginWrapper';
export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      <CaseStudiesHeroSection />
      <HorizontalMarginWrapper left={50} right={50}>
        <AtCodroonSection />
        <CaseStudyCardsSection />
        <CaseStudiesCTASection />
      </HorizontalMarginWrapper>
    </div>
  );
}
