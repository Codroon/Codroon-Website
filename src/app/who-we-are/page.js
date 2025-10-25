import WhoWeAreHeroSection from '@/components/WhoWeAre/WhoWeAreHeroSection';
import WhoWeAreMainSection from '@/components/WhoWeAre/WhoWeAreMainSection';
import OurStorySection from '@/components/WhoWeAre/OurStorySection';
import WhoWeAreCTASection from '@/components/WhoWeAre/WhoWeAreCTASection';
import HorizontalMarginWrapper from '@/components/wrappers/horizontalmarginWrapper';

export default function WhoWeArePage() {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      <WhoWeAreHeroSection />
      <HorizontalMarginWrapper left={50} right={50}>
        <WhoWeAreMainSection />
        <OurStorySection />
      </HorizontalMarginWrapper>
      <WhoWeAreCTASection />
    </div>
  );
}
