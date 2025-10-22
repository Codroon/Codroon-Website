"use client";

import Image from "next/image";
import MarginWrapper from "@/components/wrappers/sectionWrapper";
import { useState } from "react";
import HorizontalMarginWrapper from "../wrappers/horizontalmarginWrapper";
export default function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState("01");
  
  const faqs = [
    {
      id: "01",
      question: "What services does Codroon provide?",
      answer: "Codroon offers a range of services including design, engineering, and project management. We specialize in user experience design, web development, mobile app development, custom software development, branding and identity, and more."
    },
    {
      id: "02", 
      question: "How long does a typical project take?",
      answer: "Project timelines vary depending on scope and complexity. Simple websites typically take 2-4 weeks, while complex applications can take 3-6 months. We provide detailed timelines during our initial consultation."
    },
    {
      id: "03",
      question: "Do you work with international clients?",
      answer: "Yes, we work with clients worldwide. Our team is experienced in remote collaboration and can accommodate different time zones to ensure smooth communication throughout the project."
    },
    {
      id: "04",
      question: "What technologies do you use?",
      answer: "We use modern, industry-standard technologies including React, Next.js, Node.js, Python, and various cloud platforms. Our tech stack is chosen based on project requirements and scalability needs."
    },
    {
      id: "05",
      question: "How do you handle project communication?",
      answer: "We maintain regular communication through scheduled meetings, project management tools, and direct communication channels. You'll have dedicated points of contact throughout the project lifecycle."
    },
    {
      id: "06",
      question: "What is your pricing model?",
      answer: "We offer flexible pricing models including fixed-price projects, hourly rates, and retainer agreements. Pricing depends on project scope, timeline, and specific requirements."
    },
    {
      id: "07",
      question: "Do you provide ongoing support?",
      answer: "Yes, we offer post-launch support and maintenance packages. This includes bug fixes, updates, security patches, and feature enhancements to keep your project running smoothly."
    },
    {
      id: "08",
      question: "Can you help with existing projects?",
      answer: "Absolutely! We can help improve, maintain, or add new features to existing projects. We'll analyze your current setup and provide recommendations for optimization and enhancement."
    }
  ];

  return (
    <MarginWrapper top={96} bottom={96}>
      <div className="w-full max-w-[1904px] mx-auto">
        {/* Sparkles Background Header */}
        <div className="relative w-full h-[335px] px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[350px] py-[120px] flex flex-col gap-[10px] items-center justify-center">
          {/* Background Image */}
          <div className="absolute inset-0">
    <Image
      src="/Images/sparkles.jpg"
      alt="Sparkles background"
      fill
      className="object-cover mix-blend-overlay"
    />
  </div>
          
  <div className="absolute inset-0 bg-[#0F172A] opacity-[0.23] mix-blend-overlay"></div>
          {/* Content */}
          <div className="relative z-10 text-center">
            <h2 className="font-barlow font-semibold text-[48px] leading-[100%] tracking-[0%] text-center text-white mb-[10px]">
              Frequently Asked Questions
            </h2>
            <p className="font-barlow font-normal text-[18px] leading-[150%] tracking-[-0.6%] text-center text-white">
              Still you have any questions? Contact our Team via hello@Codroon.com
            </p>
          </div>
        </div>

        {/* FAQ Items Container */}
        <div className="w-full border-t border-white/20">
          <HorizontalMarginWrapper left={80} right={80}>
            <div className="flex flex-col lg:flex-row">
              {/* Vertical Divider */}
              {/* <div className="hidden lg:block w-px bg-white/20"></div> */}
              
              {/* Left Column */}
              <div className="w-full lg:w-1/2 px-0 lg:px-8 py-16">
                <div className="space-y-6">
                  {faqs.slice(0, 4).map((faq) => {
                    const isOpen = openFAQ === faq.id;
                    return (
                      <div key={faq.id} className="flex gap-6 group cursor-pointer items-center" onClick={() => setOpenFAQ(isOpen ? null : faq.id)}>
                        {/* Number Indicator */}
                        <div
  className={`w-[80px] h-[80px] rounded-[12px] border border-white/20 p-[20px] flex items-center justify-center flex-shrink-0 transition-all duration-300 bg-gradient-to-b from-[#2E2E2E] to-[#1C1C1C]`}
>
  <span
    className={`w-[40px] h-[40px] font-barlow font-semibold text-[28px] leading-[150%] tracking-[0%] text-center flex items-center justify-center transition-colors duration-300
      ${
        isOpen
          ? 'text-[#06D6A0]' // ✅ Greenish text when selected
          : 'text-white group-hover:text-[#06D6A0]' // ✅ Greenish text only on hover
      }`}
  >
    {faq.id}
  </span>
</div>

                        
                        {/* Question and Answer */}
                        <div className="flex-1 max-w-[588px]">
                          <div className="space-y-5">
                            <h3 className={`font-barlow font-semibold text-xl transition-colors ${
                              isOpen ? 'text-[#06D6A0]' : 'text-white group-hover:text-[#06D6A0]'
                            }`}>
                              {faq.question}
                            </h3>
                            {isOpen && (
                              <p className="font-barlow font-normal text-[18px] leading-[150%] tracking-[-0.6%] text-white/80">
                                {faq.answer}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {/* Toggle Icon */}
                        <div className="flex items-center">
                          <div className={`w-6 h-6 flex items-center justify-center transition-colors ${
                            isOpen ? 'text-[#06D6A0]' : 'text-white group-hover:text-[#06D6A0]'
                          }`}>
                            {isOpen ? (
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M4 8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              </svg>
                            ) : (
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M8 4v8M4 8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column */}
              <div className="w-full lg:w-1/2 px-0 lg:px-8 py-16">
                <div className="space-y-6">
                  {faqs.slice(4, 8).map((faq) => {
                    const isOpen = openFAQ === faq.id;
                    return (
                      <div key={faq.id} className="flex gap-6 group cursor-pointer items-center" onClick={() => setOpenFAQ(isOpen ? null : faq.id)}>
                        {/* Number Indicator */}
                        <div
  className={`w-[80px] h-[80px] rounded-[12px] border border-white/20 p-[20px] flex items-center justify-center flex-shrink-0 transition-all duration-300 bg-gradient-to-b from-[#2E2E2E] to-[#1C1C1C]`}
>
  <span
    className={`w-[40px] h-[40px] font-barlow font-semibold text-[28px] leading-[150%] tracking-[0%] text-center flex items-center justify-center transition-colors duration-300
      ${
        isOpen
          ? 'text-[#06D6A0]' // ✅ Greenish text when selected
          : 'text-white group-hover:text-[#06D6A0]' // ✅ Greenish text only on hover
      }`}
  >
    {faq.id}
  </span>
</div>

                        
                        {/* Question and Answer */}
                        <div className="flex-1 max-w-[588px]">
                          <div className="space-y-5">
                            <h3 className={`font-barlow font-semibold text-xl transition-colors ${
                              isOpen ? 'text-[#06D6A0]' : 'text-white group-hover:text-[#06D6A0]'
                            }`}>
                              {faq.question}
                            </h3>
                            {isOpen && (
                              <p className="font-barlow font-normal text-[18px] leading-[150%] tracking-[-0.6%] text-white/80">
                                {faq.answer}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {/* Toggle Icon */}
                        <div className="flex items-center">
                          <div className={`w-6 h-6 flex items-center justify-center transition-colors ${
                            isOpen ? 'text-[#06D6A0]' : 'text-white group-hover:text-[#06D6A0]'
                          }`}>
                            {isOpen ? (
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M4 8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              </svg>
                            ) : (
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M8 4v8M4 8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </HorizontalMarginWrapper>
        </div>
      </div>
    </MarginWrapper>
  );
}
