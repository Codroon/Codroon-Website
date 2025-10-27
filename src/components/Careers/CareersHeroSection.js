import Image from "next/image";

export default function CareersHeroSection() {
  return (
    <section className="relative w-full h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="/images/hero-banner.gif"
        alt="Careers Hero Background"
        fill
        priority
        className="object-cover opacity-25"
        unoptimized
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#0F172A] opacity-[0.23]"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full h-[686px] gap-[14px]">
        <h1 className="mx-auto text-center font-barlow font-semibold text-[48px] leading-[120%] tracking-[0px] text-white max-w-[90vw] lg:max-w-[1200px]">
          Join Our Team at Codroon
        </h1>

        <p className="font-barlow font-normal text-[18px] leading-[133%] tracking-[-0.6%] text-[#E6E6E6] max-w-[90vw] lg:max-w-[1000px]">
          Unlock your potential and join our team of innovators and problem solvers.
        </p>
      </div>
    </section>
  );
}
