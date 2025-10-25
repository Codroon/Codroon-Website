import Image from "next/image";
import Link from "next/link";

export default function ContactCTASection() {
  return (
    <div className="w-full max-w-[1596px] mx-auto px-4 py-20">
      {/* Main Container */}
      <div
        className="w-full flex flex-col gap-[50px] border border-[#262626] px-[80px] py-[60px] rounded-[12px] "
      >
        {/* First Row */}
        <div className="w-full flex gap-[40px]">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/cordroon-icon.png"
              alt="Codroon Logo"
              width={120}
              height={120}
            />
          </div>

          {/* Text Content */}
          <div className="flex-1 flex flex-col justify-center">
            <h3 className="font-barlow font-medium text-white text-[30px] leading-[100%] mb-4">
              Today, Codroon Continues to Thrive as a Leading Digital Product Agency.....
            </h3>
            <p className="font-inter font-normal text-white text-[18px] leading-[150%]">
              Combining the power of design, engineering, and project management to create transformative digital experiences. They invite you to join them on their journey and discover how they can help bring your digital ideas to life.
            </p>
          </div>
        </div>

        {/* Second Row */}
        <div className="w-full flex items-center justify-between gap-[20px] px-[40px] py-[24px] border border-[#262626] rounded-[12px] bg-[#24242433]">
          {/* Left Section */}
          <div className="flex-1 flex items-center gap-[20px]">
            <div className="font-barlow font-normal text-white text-[20px] leading-[100%]">
              Welcome to Codroon
            </div>
            <div className="font-barlow font-normal text-white text-[20px] leading-[150%] bg-[#4368B126] text-center rounded-[8px] px-[12px] py-[8px]">
              Where collaboration, Expertise, and Client-Centricity Intersect to Shape the Future of Digital Innovation.
            </div>
          </div>

          {/* Right Section - Start Project Button */}
          <Link
            href="#"
            className="w-[170px] h-[63px] flex items-center justify-center gap-[8px] rounded-[30px] transition-colors duration-300 hover:bg-[#4A9B5A]"
            style={{ backgroundColor: "#57BB6D" }}
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
