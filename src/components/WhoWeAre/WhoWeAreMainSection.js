import Image from "next/image";
import MarginWrapper from "../wrappers/sectionWrapper";
export default function WhoWeAreMainSection() {
  return (
    <MarginWrapper top={90}>
    <div
      className="w-full max-w-[1596px] mx-auto 
                 border border-[#262626] 
                 pt-[100px] pr-[150px] pb-[100px] pl-[150px]
                 flex gap-[100px] "
      style={{ height: "fit-content" }}
    >
      {/* Left Section */}
      <div className="flex flex-col justify-center align-center gap-[20px] w-[598px]">
        <h2 className="font-barlow font-semibold text-white text-[38px] leading-[150%]">
          About Codroon
        </h2>
        <p className="font-inter font-normal text-white text-[18px] leading-[150%]">
          Codroon is a digital product agency that is passionate about crafting
          exceptional digital experiences. We specialize in design, engineering,
          and project management, helping businesses thrive in the digital
          landscape. At Codroon, we follow a structured and collaborative process
          to ensure the successful delivery of exceptional digital products. Our
          process combines industry best practices, creative thinking, and a
          client-centric approach.
        </p>
      </div>

      {/* Right Section */}
      <div className="relative w-[598px] h-[571px] rounded-[16px] overflow-hidden border border-[#262626]">
        {/* Globe GIF (background) */}
        <Image
          src="/globe.gif"
          alt="Globe Background"
          fill
          className="object-cover"
          priority
        />

        {/* Center Codroon Logo */}
<div className="absolute inset-0 flex items-center justify-center z-20 ">
  <div className="w-[100px] h-[100px] rounded-[27px] bg-[#0F172A] flex items-center justify-center">
    <Image
      src="/cordroon-icon.png"
      alt="Codroon Logo"
      width={120}
      height={120}
      className="object-contain"
    />
  </div>
</div>



        <div
          className="absolute inset-0 mix-blend-multiply rounded-[16px]"
          style={{
            background: "linear-gradient(135deg, #19191900 0%, #FFFFFF00 50%), #57BB6D",
          }}
        ></div>

      </div>
    </div>
    </MarginWrapper>
  );
}
