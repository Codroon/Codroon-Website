import CareersHeroSection from '@/components/Careers/CareersHeroSection';
import WhyWorkAtCodroonSection from '@/components/Careers/WhyWorkAtCodroonSection';
import CurrentOpeningsSection from '@/components/Careers/CurrentOpeningsSection';
import CareersCTASection from '@/components/Careers/CareersCTASection';
import HorizontalMarginWrapper from '@/components/wrappers/horizontalmarginWrapper';

export default function CareersPage() {
  return (
    <div className="w-full bg-[#0F172A]">
      <CareersHeroSection />
      <WhyWorkAtCodroonSection />
      <CurrentOpeningsSection />
      <CareersCTASection />
    </div>
  );
}
