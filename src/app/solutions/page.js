import SolutionsHeroSection from '@/components/Solutions/SolutionsHeroSection';
import DesignSection from '@/components/Solutions/DesignSection';
import EngineeringSection from '@/components/Solutions/EngineeringSection';
import ProjectManagementSection from '@/components/Solutions/ProjectManagementSection';
import CTASection from '@/components/Solutions/CTASection';
import HorizontalMarginWrapper from '@/components/wrappers/horizontalmarginWrapper';

export default function SolutionsPage() {
  return (
    <div className="w-full">
      <SolutionsHeroSection />
        <HorizontalMarginWrapper left={80} right={80}>
          <DesignSection />
          <EngineeringSection />
          <ProjectManagementSection />
        </HorizontalMarginWrapper>
      <CTASection />
    </div>
  );
}
