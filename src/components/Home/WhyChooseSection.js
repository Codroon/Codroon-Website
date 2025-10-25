import Image from "next/image";
import MarginWrapper from "@/components/wrappers/sectionWrapper";

export default function WhyChooseSection() {
  const features = [
    "AI-Powered Requirement Gathering",
    "Agile Project Management", 
    "Scalable Tech Stack",
    "Trusted by Global Teams"
  ];

  return (
    <MarginWrapper top={96} bottom={96}>
    <div className="w-full max-w-[1597px] mx-auto relative">
      {/* Text Container */}
      <div className="w-full px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[300px] py-[120px] flex flex-col gap-[14px] items-center">
        <h2 className="max-w-[997px] font-barlow font-semibold text-[48px] leading-[100%] tracking-[0%] text-center text-white">
          Why Choose Codroon?
        </h2>
        <p className="font-barlow font-normal text-[18px] leading-[24px] tracking-[-0.6%] text-center text-white">
          Experience excellence in digital craftsmanship with our team of skilled professionals dedicated to delivering exceptional results.
        </p>
      </div>

      {/* Solar System Area */}
      <div className="relative w-full max-w-[1436px] h-[925.19px] mx-auto mt-0">
        {/* Solar System Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/Images/solarSystem-codroon.svg"
            alt="Codroon Solar System"
            width={1436}
            height={925.19}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
    </MarginWrapper>
  );
}
