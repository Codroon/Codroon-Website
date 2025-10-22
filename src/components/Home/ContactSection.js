"use client";
import Image from "next/image";
import MarginWrapper from "@/components/wrappers/sectionWrapper";
import { useState } from "react";
import BudgetSlider from "../common/slider";
export default function ContactSection() {
  const [selectedServices, setSelectedServices] = useState(["Web Design"]);
  const [budget, setBudget] = useState(3000);
  
  const serviceOptions = [
    "Web Design",
    "Mobile App Design", 
    "Collaboration",
    "Others"
  ];

  const handleServiceToggle = (service) => {
    setSelectedServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };
  return (
    <MarginWrapper top={96} bottom={96}>
      <div className="w-full max-w-[1908px] mx-auto">
        {/* Header Section with Hand Background */}
        <div className="relative w-full h-[592.35px] px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[350px] py-[120px] flex flex-col gap-[50px] items-center justify-center">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/Images/hand.jpg"
              alt="Hand background"
              fill
      className="object-cover mix-blend-overlay"
            />
          </div>
          
  <div className="absolute inset-0 bg-[#0F172A] opacity-[0.23] mix-blend-overlay"></div>
          {/* Content */}
          <div className="relative z-10 text-center">
            {/* Codroon Logo */}
            <div className="mb-[50px]">
              <Image
                src="/codroon-logo.png"
                alt="Codroon Logo"
                width={121.91}
                height={102.35}
                className="mx-auto"
              />
            </div>
            
            {/* Thank You Heading */}
            <h2 className="max-w-[1208px] font-barlow font-semibold text-[38px] leading-[100%] tracking-[0%] text-center text-white mb-[50px]">
              Thank you for your Interest in Codroon.
            </h2>
            
            {/* Description */}
            <p className="max-w-[1208px] font-barlow font-normal text-[18px] leading-[150%] tracking-[-0.6%] text-center text-white mb-[50px]">
              We would love to hear from you and discuss how we can help bring your digital ideas to life. Here are the different ways you can get in touch with us.
            </p>
            
            {/* Start Project Button */}
            <div className="flex justify-center">
            <button className="w-[232px] cursor-pointer h-[63px] bg-[#06D6A0] text-black font-barlow font-medium rounded-[37px] px-[34px] py-[18px] flex items-center justify-center gap-2 hover:bg-[#05C191] transition-colors">
              Start Project
            </button>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full max-w-[900px] mx-auto px-4 sm:px-8 py-16">
          <form className="space-y-8">
            {/* Name and Email Fields */}
            <div className="flex flex-col md:flex-row gap-[40px]">
              <div className="flex-1">
                <label className="block text-white font-barlow font-medium text-lg mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Type here"
                  className="w-full bg-transparent border-b border-[#06D6A0] text-white placeholder-[#06D6A0] py-2 focus:outline-none focus:border-[#05C191]"
                />
              </div>
              <div className="flex-1">
                <label className="block text-white font-barlow font-medium text-lg mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Type here"
                  className="w-full bg-transparent border-b border-[#06D6A0] text-white placeholder-[#06D6A0] py-2 focus:outline-none focus:border-[#05C191]"
                />
              </div>
            </div>

            {/* Why are you contacting us */}
            <div className="space-y-6">
              <h3 className="max-w-[820px] font-barlow font-medium text-[22px] leading-[150%] tracking-[0%] text-white">
                Why are you contacting us?
              </h3>
              <div className="flex flex-col md:flex-row gap-8">
                {/* Left Column */}
                <div className="flex-1 space-y-4">
                  {serviceOptions.slice(0, 2).map((service) => (
                    <label key={service} className="flex items-center gap-3 cursor-pointer" onClick={() => handleServiceToggle(service)}>
                      <div className={`w-[28px] h-[28px] rounded-[4px] border border-[#06D6A0] p-[4px] flex items-center justify-center transition-colors ${
                        selectedServices.includes(service) ? 'bg-[#06D6A0]' : 'bg-[#262626]'
                      }`}>
                        {selectedServices.includes(service) && (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                            <path d="M13.5 4.5L6 12L2.5 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <span className="text-white font-barlow font-normal">{service}</span>
                    </label>
                  ))}
                </div>
                
                {/* Right Column */}
                <div className="flex-1 space-y-4">
                  {serviceOptions.slice(2, 4).map((service) => (
                    <label key={service} className="flex items-center gap-3 cursor-pointer" onClick={() => handleServiceToggle(service)}>
                      <div className={`w-[28px] h-[28px] rounded-[4px] border border-[#06D6A0] p-[4px] flex items-center justify-center transition-colors ${
                        selectedServices.includes(service) ? 'bg-[#06D6A0]' : 'bg-[#262626]'
                      }`}>
                        {selectedServices.includes(service) && (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                            <path d="M13.5 4.5L6 12L2.5 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <span className="text-white font-barlow font-normal">{service}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Your Budget Section */}
            <div className="w-full max-w-[900px] h-[250px] rounded-[12px] bg-[#0F172A] p-[40px] space-y-[40px]">
              <div>
                <h3 className="font-barlow font-medium text-[22px] leading-[150%] text-white mb-2">
                  Your Budget
                </h3>
                <p className="font-barlow font-normal text-sm text-white/80">
                  Slide to indicate your budget range
                </p>
              </div>
              
              {/* Slider */}
              <BudgetSlider
        min={1000}
        max={5000}
        step={100}
        value={budget}
        onChange={(e) => setBudget(parseInt(e.target.value))}
      />
            </div>

            {/* Your Message */}
            <div className="space-y-4">
              <h3 className="font-barlow font-medium text-[22px] leading-[150%] text-white">
                Your Message
              </h3>
              <textarea
                placeholder="Type here"
                rows={6}
                className="w-full bg-transparent border-b border-[#06D6A0] text-white placeholder-[#06D6A0] py-2 focus:outline-none focus:border-[#05C191] resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-8">
              <button className="w-[254px] h-[63px] bg-[#06D6A0] text-black font-barlow font-medium rounded-[30px] px-[44px] py-[18px] flex items-center justify-center gap-2 hover:bg-[#05C191] transition-colors">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </MarginWrapper>
  );
}
