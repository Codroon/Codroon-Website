import Image from "next/image";
import MarginWrapper from "@/components/wrappers/sectionWrapper";

const storyCards = [
  {
    number: "01",
    title: "Our Foundation",
    description: "Founded with a vision to bridge the gap between innovative ideas and market-ready solutions, we started as a small team of passionate developers who believed in the power of technology to transform businesses."
  },
  {
    number: "02", 
    title: "Growth & Innovation",
    description: "Over the years, we've grown into a full-service digital agency, expanding our expertise across web development, mobile applications, AI integration, and cloud solutions while maintaining our commitment to quality and innovation."
  },
  {
    number: "03",
    title: "Client Success",
    description: "We've partnered with businesses of all sizes, from startups to enterprise-level organizations, helping them achieve their digital transformation goals and drive measurable business outcomes through cutting-edge technology solutions."
  },
  {
    number: "04",
    title: "Future Vision",
    description: "As we look ahead, we continue to invest in emerging technologies, expand our global reach, and build lasting partnerships that drive innovation and create value for our clients and the communities we serve."
  }
];

export default function OurStorySection() {
  return (
    <MarginWrapper top={96} bottom={96}>
      <div className="w-full max-w-[1596px] mx-auto px-4">
        {/* Section Title */}
        <h2 
          className="font-barlow font-semibold text-[38px] leading-[150%] mb-16"
          style={{ color: '#57BB6D' }}
        >
          Our Story
        </h2>

        {/* Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 border-t border-gray-600">
          {storyCards.map((card, index) => (
            <div
              key={index}
              className="flex flex-col gap-8 p-8 md:p-12 border-b border-gray-600 last:border-b-0"
            >
              {/* Number and Title Row */}
              <div className="flex items-center gap-5">
                {/* Number */}
                <div
                  className="flex items-center justify-center w-[88px] h-[88px] rounded-[10px] border border-[#2E2E2E]"
                  style={{
                    background:
                      "linear-gradient(0deg, rgba(67, 104, 177, 0.1), rgba(67, 104, 177, 0.1)), linear-gradient(229.29deg, rgba(6, 214, 160, 0.2) -68.25%, rgba(6, 214, 160, 0) 32.16%)",
                  }}
                >
                  <span className="font-barlow font-semibold text-white text-[24px]">
                    {card.number}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-barlow font-medium text-white text-[22px] md:text-[26px] leading-[150%]">
                  {card.title}
                </h3>
              </div>

              {/* Description */}
              <p className="font-barlow font-normal text-white text-[18px] md:text-[20px] leading-[150%]">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </MarginWrapper>
  );
}
