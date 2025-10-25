import Image from "next/image";

export default function WhoWeAreMainSection() {
  return (
    <div className="w-full max-w-[1596px] mx-auto pt-[100px] pr-[150px] pb-[100px] pl-[150px]">
      <div className="flex gap-[100px]">
        {/* Left Container */}
        <div className="w-[598px] h-[571px] flex flex-col gap-[10px] rounded-[16px] border border-gray-600">
          <div className="p-8">
            <h2 className="font-barlow font-semibold text-white text-[38px] leading-[150%] mb-6">
              Our Mission
            </h2>
            <p className="font-inter font-normal text-white text-[18px] leading-[150%]">
              We are a team of passionate developers, designers, and innovators who believe in the power of technology to transform businesses and create meaningful impact. Our mission is to deliver exceptional digital solutions that drive growth and success for our clients.
            </p>
          </div>
        </div>

        {/* Right Container with Globe Image and Overlay */}
        <div className="relative w-[598px] h-[571px] rounded-[16px] border border-gray-600 overflow-hidden">
          {/* Globe GIF Background */}
          <Image
            src="/globe.gif"
            alt="Globe"
            fill
            className="object-cover"
          />
          
          {/* Greenish Night Vision Overlay */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(87, 187, 109, 0.3) 0%, rgba(87, 187, 109, 0.1) 50%, rgba(0, 0, 0, 0.4) 100%)',
              mixBlendMode: 'multiply'
            }}
          ></div>
          
          {/* Codroon Logo in Center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/codroon-logo.png"
              alt="Codroon Logo"
              width={200}
              height={200}
              className="z-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
