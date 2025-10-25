import MarginWrapper from "@/components/wrappers/sectionWrapper";

const processSteps = [
  {
    number: "01",
    title: "Discovery & Research",
    description:
      "We begin by understanding your business goals, target audience, and market landscape through comprehensive research and stakeholder interviews.",
  },
  {
    number: "02",
    title: "Strategy & Planning",
    description:
      "Our team develops a detailed project roadmap, defining scope, timeline, and success metrics to ensure alignment with your objectives.",
  },
  {
    number: "03",
    title: "Design & Prototyping",
    description:
      "We create intuitive user interfaces and experiences through wireframing, prototyping, and iterative design refinement.",
  },
  {
    number: "04",
    title: "Development & Testing",
    description:
      "Our developers build robust, scalable solutions using cutting-edge technologies while maintaining rigorous quality standards.",
  },
  {
    number: "05",
    title: "Quality Assurance",
    description:
      "Comprehensive testing across multiple devices and browsers ensures flawless performance and optimal user experience.",
  },
  {
    number: "06",
    title: "Deployment & Launch",
    description:
      "We handle the technical deployment process, ensuring smooth transition from development to production environment.",
  },
  {
    number: "07",
    title: "Training & Handover",
    description:
      "We provide comprehensive training and documentation to empower your team to manage and maintain the solution effectively.",
  },
  {
    number: "08",
    title: "Support & Optimization",
    description:
      "Ongoing maintenance, monitoring, and optimization ensure your solution continues to deliver value and adapt to changing needs.",
  },
];

export default function ProcessGridSection() {
  return (
    <MarginWrapper top={0} bottom={96}>
      <div className="w-full max-w-[1596px] mx-auto px-4">
        {/* Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {processSteps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col justify-start bg-transparent border border-[#1F2937] rounded-lg p-8 md:p-12"
            >
              {/* Top Section — Number + Title */}
              <div className="flex flex-wrap items-center gap-6">
                {/* Big Number */}
                <div className="font-barlow font-semibold text-[#57BB6D] text-[100px] md:text-[150px] leading-none">
                  {step.number}
                </div>

                {/* Title */}
                <div className="flex-1 border-b border-gray-600 pb-4 pl-2">
                  <h3 className="font-barlow font-semibold text-[20px] md:text-[24px] leading-tight text-[#98989A]">
                    {step.title}
                  </h3>
                </div>
              </div>

              {/* Description */}
              <p className="mt-6 font-inter font-normal text-[#98989A] text-[16px] md:text-[18px] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </MarginWrapper>
  );
}
