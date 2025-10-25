import Image from "next/image";
import MarginWrapper from "@/components/wrappers/sectionWrapper";

const industries = [
  {
    icon: "industry-item-1",
    title: "Healthcare & Medical",
    description:
      "We develop secure, HIPAA-compliant digital solutions for healthcare providers, including patient management systems, telemedicine platforms, and medical device integrations.",
  },
  {
    icon: "industry-item-2",
    title: "Financial Services",
    description:
      "Our fintech solutions include banking applications, payment processing systems, investment platforms, and regulatory compliance tools for financial institutions.",
  },
  {
    icon: "industry-item-3",
    title: "E-Commerce & Retail",
    description:
      "We create comprehensive e-commerce platforms, inventory management systems, and customer experience solutions that drive online sales and customer engagement.",
  },
  {
    icon: "industry-item-4",
    title: "Education & E-Learning",
    description:
      "Our educational technology solutions include learning management systems, virtual classrooms, and interactive content platforms for institutions and corporate training.",
  },
  {
    icon: "industry-item-5",
    title: "Manufacturing & Logistics",
    description:
      "We develop IoT-enabled manufacturing solutions, supply chain management systems, and predictive analytics tools for industrial operations.",
  },
  {
    icon: "industry-item-6",
    title: "Real Estate & Property",
    description:
      "Our real estate solutions include property management systems, virtual tour platforms, and CRM tools for real estate professionals and property developers.",
  },
  {
    icon: "industry-item-7",
    title: "Travel & Hospitality",
    description:
      "We create booking platforms, customer service solutions, and mobile applications that enhance the travel experience for both businesses and travelers.",
  },
  {
    icon: "industry-item-8",
    title: "Technology & SaaS",
    description:
      "We build scalable SaaS platforms, API integrations, and cloud-based solutions for technology companies and software-as-a-service providers.",
  },
];

export default function IndustriesGridSection() {
  return (
    <MarginWrapper top={0} bottom={96}>
      <div className="w-full max-w-[1596px] mx-auto px-4">
        {/* Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 border-t border-gray-600">
          {industries.map((industry, index) => (
            <div
              key={index}
              className="flex flex-col gap-8 p-8 md:p-12 border-b border-gray-600 last:border-b-0"
            >
              {/* Icon and Title Row */}
              <div className="flex items-center gap-5">
                {/* Icon Container */}
                <div
                  className="flex items-center justify-center w-[88px] h-[88px] rounded-[10px] border border-[#2E2E2E]"
                  style={{
                    background:
                      "linear-gradient(0deg, rgba(67, 104, 177, 0.1), rgba(67, 104, 177, 0.1)), linear-gradient(229.29deg, rgba(6, 214, 160, 0.2) -68.25%, rgba(6, 214, 160, 0) 32.16%)",
                  }}
                >
                  <Image
                    src={`/Images/Icons/${industry.icon}.png`}
                    alt={industry.title}
                    width={40}
                    height={40}
                  />
                </div>

                {/* Title */}
                <h3 className="font-barlow font-medium text-white text-[22px] md:text-[26px] leading-[150%]">
                  {industry.title}
                </h3>
              </div>

              {/* Description */}
              <p className="font-barlow font-normal text-white text-[18px] md:text-[20px] leading-[150%]">
                {industry.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </MarginWrapper>
  );
}
