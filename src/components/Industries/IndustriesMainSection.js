import MarginWrapper from "@/components/wrappers/sectionWrapper";

export default function IndustriesMainSection() {
  return (
    <MarginWrapper top={96} bottom={96}>
      <div className="w-full max-w-[1596px] mx-auto px-4 text-center">
        {/* Main Container */}
        <div className="flex flex-col items-center justify-center gap-6 py-24">
          <h2 className="font-barlow font-semibold text-white text-[36px] md:text-[48px] leading-[110%]">
            Industries We Empower
          </h2>
          <p className="font-barlow font-normal text-white text-[18px] md:text-[20px] leading-[150%] max-w-3xl mx-auto">
            Experience excellence in digital craftsmanship with our team of skilled
            professionals dedicated to delivering exceptional results.
          </p>
        </div>
      </div>
    </MarginWrapper>
  );
}
