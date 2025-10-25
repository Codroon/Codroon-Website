
import Image from "next/image";

export default function FAQHeroSection() {
  return (
    <section className="relative w-full h-[342px] flex items-center justify-center overflow-hidden " style={{ top: '100px' }}>
      {/* Background Image - same as previous pages */}
      <Image
        src="/Images/alonemen.jpg"
        alt="Futuristic Business Scene"
        fill
        priority
        className="object-cover opacity-25 "
      />

  <div className="absolute inset-0 bg-indigo-900/70 mix-blend-multiply" />

    {/* Content */}
<div
  className="relative z-10 flex items-center justify-center w-full h-full text-center gap-[14px] px-[300px] py-[120px] flex-wrap"
>
  <h1 className="font-barlow font-semibold text-[48px] leading-[100%] tracking-[0%] text-white whitespace-nowrap">
    Frequently Asked Questions
  </h1>

  <p className="font-barlow font-normal text-[20px] leading-[150%] tracking-[-0.6%] text-white whitespace-nowrap">
    Still you have any questions? Contact our Team via hello@Codroon.com
  </p>
</div>

    </section>
  );
}
