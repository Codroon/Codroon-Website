import Image from "next/image";
import MarginWrapper from "@/components/wrappers/sectionWrapper";
import HorizontalMarginWrapper from "../wrappers/horizontalmarginWrapper";
export default function OurSolutionsSection() {
  const solutions = [
    {
      icon: "/Images/brush.png", // Brush icon for first column
      title: "UI/UX Design",
      description: "At Codroon, our design team is passionate about creating stunning, user-centric designs that captivate your audience and elevate your brand. We believe that great design is not just about aesthetics; it's about creating seamless and intuitive user experiences."
    },
    {
      icon: "/Images/puzzle.png", // Puzzle icon for second column
      title: "Web Development", 
      description: "Our engineering team combines technical expertise with a passion for innovation to build robust and scalable digital solutions. We leverage the latest technologies and best practices to deliver high-performance applications tailored to your specific needs."
    },
    {
      icon: "/Images/Icons/power.png", // Power icon for third column
      title: "Mobile App Development",
      description: "Our experienced project management team ensures that your projects are delivered on time, within budget, and according to your specifications. We follow industry-standard methodologies and employ effective communication and collaboration tools to keep you informed throughout the development process."
    },
    {
      icon: "/Images/brush.png", // Brush icon for first column
      title: "Project Management",
      description: "At Codroon, our design team is passionate about creating stunning, user-centric designs that captivate your audience and elevate your brand. We believe that great design is not just about aesthetics; it's about creating seamless and intuitive user experiences."
    },
    {
      icon: "/Images/puzzle.png", // Puzzle icon for second column
      title: "SEO",
      description: "Our engineering team combines technical expertise with a passion for innovation to build robust and scalable digital solutions. We leverage the latest technologies and best practices to deliver high-performance applications tailored to your specific needs."
    },
    {
      icon: "/Images/Icons/power.png", // Power icon for third column
      title: "SaaS Development",
      description: "Our experienced project management team ensures that your projects are delivered on time, within budget, and according to your specifications. We follow industry-standard methodologies and employ effective communication and collaboration tools to keep you informed throughout the development process."
    },
    {
      icon: "/Images/brush.png", // Brush icon for first column
      title: "Agentic AI",
      description: "At Codroon, our design team is passionate about creating stunning, user-centric designs that captivate your audience and elevate your brand. We believe that great design is not just about aesthetics; it's about creating seamless and intuitive user experiences."
    },
    {
      icon: "/Images/puzzle.png", // Puzzle icon for second column
      title: "Game Development",
      description: "Our engineering team combines technical expertise with a passion for innovation to build robust and scalable digital solutions. We leverage the latest technologies and best practices to deliver high-performance applications tailored to your specific needs."
    },
    {
      icon: "/Images/power.png", // Power icon for third column
      title: "Desktop Apps",
      description: "Our experienced project management team ensures that your projects are delivered on time, within budget, and according to your specifications. We follow industry-standard methodologies and employ effective communication and collaboration tools to keep you informed throughout the development process."
    }
  ];

  return (
    <MarginWrapper bottom={96}>
    <HorizontalMarginWrapper left={80} right={80}>
    <div className="relative w-full max-w-[1596px] mx-auto">
      {/* Globe Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Image
          src="/globe.gif"
          alt="Globe background"
          width={1596}
          height={577}
          className="object-cover opacity-[0.07] mix-blend-lighten"
        />
      </div>
      
      {/* Content Container */}
      <div className="relative z-10">
        {/* Header Section */}
        <div className="w-full px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[300px] py-[120px] flex flex-col gap-[14px] items-center">
          <h2 className="max-w-[1328px] font-barlow font-semibold text-[48px] leading-[100%] tracking-[0%] text-center text-white">
            Our Solutions
          </h2>
          <p className="max-w-[1328px] font-barlow font-normal text-[18px] leading-[24px] tracking-[-0.6%] text-center text-white">
            Transform your brand with our innovative digital solutions that captivate and engage your audience.
          </p>
        </div>

        {/* Grid Container */}
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
            {solutions.map((solution, index) => (
              <div key={index} className="relative border-r border-white/20 last:border-r-0 flex justify-center">
                {/* Card Content */}
                <div className="w-full max-w-[432px] h-[577px] flex flex-col gap-[40px] p-6">
                  {/* Logo */}
                  <div className="w-[88px] h-[88px] rounded-[10px] border border-white/20 bg-[#4368B11A] p-6 flex items-center justify-center ">
                    <Image
                      src={solution.icon}
                      alt={`${solution.title} icon`}
                      width={40}
                      height={40}
                      className=""
                    />
                  </div>
                  
                  {/* Title */}
                  <h3 className="font-barlow font-semibold text-xl text-white">
                    {solution.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="font-barlow font-normal text-sm text-white/80 leading-relaxed">
                    {solution.description}
                  </p>
                  
                  {/* Learn More Button */}
                  <div className="w-full flex justify-center">
                    <button className="flex flex-row items-center justify-center w-full max-w-[432px] h-[60px] px-[16px] py-[18px] gap-[10px] bg-[#52B069] text-white font-barlow font-medium rounded-[30px] hover:bg-[#05C191] transition-colors">
                      Learn More
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </HorizontalMarginWrapper>
    </MarginWrapper>
  );
}
