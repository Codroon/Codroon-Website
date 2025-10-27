import Image from "next/image";

export default function CareersCTASection() {
  return (
    <section className="w-full bg-[#0F172A] py-[80px]">
      <div className="container mx-auto px-4">
        <div className="max-w-[1596px] mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-[40px] mb-[50px]">
            {/* Logo */}
            <div className="w-[190px] h-[190px] bg-[#0F172A] rounded-[27px] flex items-center justify-center">
              <Image
                src="/Images/Careers/codroon-logo-careers.svg"
                alt="Codroon Logo"
                width={190}
                height={190}
                className="w-[190px] h-[190px] object-contain"
              />
            </div>

            {/* Text Content */}
            <div className="flex-1 space-y-[20px]">
              <h2 className="font-barlow font-medium text-[30px] leading-[120%] text-[#98989A]">
                Today, Codroon Continues to Thrive as a Leading Digital Product Agency.....
              </h2>
              <p className="font-inter font-normal text-[18px] leading-[150%] text-[#98989A]">
                Combining the power of design, engineering, and project management to create transformative digital experiences. They invite you to join them on their journey and discover how they can help bring your digital ideas to life.
              </p>
            </div>
          </div>

          {/* CTA Card */}
          <div className="bg-[rgba(36,36,36,0.2)] backdrop-blur-[12px] border border-[#262626] rounded-[12px] p-[24px] flex flex-col lg:flex-row items-center justify-between gap-[20px]">
            <div className="flex flex-col lg:flex-row items-center gap-[20px] flex-1">
              <h3 className="font-barlow font-normal text-[20px] leading-[120%] text-[#98989A]">
                Welcome to Codroon
              </h3>
              <div className="bg-[rgba(67,104,177,0.15)] rounded-[8px] px-[20px] py-[14px]">
                <p className="font-barlow font-normal text-[20px] leading-[150%] text-white">
                  Where collaboration, Expertise, and Client-Centricity Intersect to Shape the Future of Digital Innovation.
                </p>
              </div>
            </div>
            
            <button className="bg-[#57BB6D] hover:bg-[#4A9B5A] text-[#1A1A1A] font-barlow font-medium text-[18px] leading-[150%] px-[34px] py-[18px] rounded-[30px] transition-colors duration-200">
              Start Project
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
