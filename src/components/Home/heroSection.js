import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative w-full h-[100vh] flex items-center justify-center overflow-hidden">
  {/* Background GIF */}
      <Image
        src="/images/hero-banner.gif"
        alt="Hero Banner"
        fill
        priority
        className="object-cover opacity-25"
      />

      {/* Blue blush overlay */}
      <div className="absolute inset-0 bg-[#0F172A] opacity-[0.23]"></div>



      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full h-[686px] gap-[50px]">
      <h1
  className="mx-auto text-center font-heading font-semibold text-[68px] leading-[100%] tracking-[0px] 
             bg-gradient-to-r from-[#00E6A8] via-[#00AEEF] to-[#0070F3] text-transparent bg-clip-text 
             max-w-[90vw] lg:max-w-[1200px] font-barlow"
>
  Where Code Becomes Conscious
</h1>


       <p
  className="font-montserrat  mt-6 mx-auto text-center text-white font-body font-normal text-[32px] leading-[100%] tracking-[0px] max-w-[90vw] lg:max-w-[1000px]"
>
  Turning code into products that wow users and win markets!
</p>

<div className="mt-10 flex justify-center gap-6">
  {/* View Solutions Button */}
  <Link
    href="#"
    className="cursor-pointer text-[#4368B1] border border-[#4368B1] hover:bg-[#4368B1] hover:text-white 
               px-6 py-3 rounded-full transition-colors duration-300 
               font-body font-semibold text-[18px] leading-[100%] font-montserrat"
  >
    View Solutions
  </Link>

  {/* Get Started Button */}
  <Link
    href="#"
    className="cursor-pointer bg-[#4368B1] hover:bg-[#33558F] text-white 
               px-6 py-3 rounded-full transition-colors duration-300 
               font-body font-semibold text-[18px] leading-[100%] font-montserrat"
  >
    Get Started
  </Link>
</div>

      </div>
    </section>
  );
}
