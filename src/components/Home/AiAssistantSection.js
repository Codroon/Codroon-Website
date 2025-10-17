// File: src/components/AIAssistantSection.jsx
import React from "react";
import { Paperclip, ArrowUp } from "lucide-react";
import MarginWrapper from "../wrappers/sectionWrapper";

const AIAssistantSection = () => {
  return (
    <MarginWrapper top={0} bottom={80} leftRight={30}>
      <section className="relative flex flex-col items-center justify-center w-full max-w-[1920px] mx-auto px-4 bg-[#0F172A] overflow-hidden py-12 md:py-16">
        {/* Gradient Banner */}
        <div className="flex items-center justify-center w-[90%] max-w-[902px] h-[83px] rounded-[100px] border border-[#52B069] px-[34px] py-[20px] bg-gradient-to-r from-[#4490C9] to-[#63DAAC]">
          <h2 className="text-white text-[20px] md:text-[24px] font-barlow font-semibold tracking-[0.5px] text-center">
            Your Project, Your Vision – Powered by AI
          </h2>
        </div>

        {/* Search Bar */}
        <div className="mt-[83px] bg-[#00000040] flex items-center justify-between w-[80%] max-w-[1200px] h-[82px] rounded-[48px] border border-[#52B069] px-[27px] py-[21px]">
          {/* Left: Input */}
          <input
            type="text"
            placeholder="Use our AI assistant to create a requirement document in minutes and get instant quotes."
            className="flex-1  text-white placeholder-gray-400 focus:outline-none text-[16px] md:text-[18px]"
          />

          {/* Right: Icon Container */}
          <div className="flex items-center justify-center gap-[10px] w-auto h-[40px]">
            <Paperclip size={24} className="text-[#52B069] cursor-pointer" />
            <ArrowUp size={24} className="text-[#52B069] cursor-pointer" />
          </div>
        </div>

        {/* Buttons Row */}
       <div className="flex items-center justify-center gap-[16px] mt-[30px] w-full max-w-[1061px] flex-nowrap overflow-x-auto scrollbar-hide">
  {[
    "Article",
    "Weather",
    "Sport",
    "Press",
    "Food",
    "Plants",
    "Suggest Something",
  ].map((item) => (
    <button
      key={item}
      className={`${
        item !== "Suggest Something"
          ? "w-[126px]"
          : "w-[295px]"
      } h-[40px] rounded-[30px] bg-[#00000040] border border-[#52B069] text-[#52B069] text-[16px] font-barlow  hover:bg-[#52B069] hover:text-[#050F1A] transition-colors duration-300`}
    >
      {item}
    </button>
  ))}
</div>

      </section>
    </MarginWrapper>
  );
};

export default AIAssistantSection;
