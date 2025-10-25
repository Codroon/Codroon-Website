import Image from "next/image";
import Link from "next/link";

export default function WhoWeAreCTASection() {
  return (
    <div className="w-full max-w-[1596px] mx-auto px-4 py-20">
      {/* Main Container */}
      <div 
        className="w-full h-[511px] flex flex-col gap-[50px] p-[80px]"
        style={{ background: 'rgba(128, 128, 128, 0.6)' }}
      >
        {/* First Row */}
        <div className="w-full h-[190px] flex gap-[40px]">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/codroon-logo.png"
              alt="Codroon Logo"
              width={120}
              height={120}
            />
          </div>

          {/* Text Content */}
          <div className="flex-1 flex flex-col justify-center">
            <h3 className="font-barlow font-medium text-white text-[30px] leading-[100%] mb-4">
              Ready to Start Your Project?
            </h3>
            <p className="font-inter font-normal text-white text-[18px] leading-[150%]">
              Let's collaborate to bring your vision to life. Our team of experts is ready to help you build innovative solutions that drive your business forward. From concept to deployment, we're with you every step of the way.
            </p>
          </div>
        </div>

        {/* Second Row */}
        <div className="w-full h-[111px] flex items-center justify-between gap-[20px] pt-[24px] pr-[40px] pb-[24px] pl-[40px] border border-gray-600 rounded-[12px]">
          {/* Left Section */}
          <div className="flex-1 flex items-center gap-[20px]">
            <div className="font-barlow font-normal text-white text-[20px] leading-[100%]">
              Ready to collaborate?
            </div>
            <div className="font-barlow font-normal text-white text-[20px] leading-[150%]">
              Let's build something amazing together
            </div>
          </div>

          {/* Right Section - Start Project Button */}
          <Link
            href="#"
            className="w-[170px] h-[63px] flex items-center justify-center gap-[8px] pt-[18px] pr-[34px] pb-[18px] pl-[34px] rounded-[30px] transition-colors duration-300 hover:bg-[#4A9B5A]"
            style={{ backgroundColor: '#57BB6D' }}
          >
            <span className="font-barlow font-medium text-white text-[16px]">
              Start Project
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
