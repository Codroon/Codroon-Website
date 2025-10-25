"use client";

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
      question: "How can Codroon help my business?",
      answer: "We help businesses transform their digital presence through innovative solutions. Our services include custom web development, mobile applications, UI/UX design, and digital strategy consulting to drive growth and improve user engagement."
    },
    {
      id: "03",
      question: "What industries does Codroon work with?",
      answer: "We work across various industries including healthcare, financial services, e-commerce, education, manufacturing, real estate, travel, and technology. Our diverse experience allows us to understand unique industry challenges and deliver tailored solutions."
    },
    {
      id: "04",
      question: "How long does it take to complete a project with Codroon?",
      answer: "Project timelines vary based on scope and complexity. Simple websites typically take 2-4 weeks, while complex applications can take 3-6 months. We provide detailed timelines during our initial consultation and maintain regular communication throughout the project."
    },
    {
      id: "05",
      question: "Do you offer ongoing support and maintenance after the project is completed?",
      answer: "Yes, we offer comprehensive post-launch support and maintenance packages. This includes bug fixes, security updates, performance optimization, feature enhancements, and technical support to keep your project running smoothly."
    },
    {
      id: "06",
      question: "Can you work with existing design or development frameworks?",
      answer: "Absolutely! We can work with your existing frameworks, codebases, and design systems. Our team is experienced with various technologies and can integrate seamlessly with your current infrastructure while improving and extending functionality."
    },
    {
      id: "07",
      question: "How involved will I be in the project development process?",
      answer: "We believe in collaborative development. You'll be involved in key decision-making processes, regular progress reviews, and feedback sessions. We maintain transparent communication and provide regular updates to ensure the project aligns with your vision."
    },
    {
      id: "08",
      question: "Can you help with website or app maintenance and updates?",
      answer: "Yes, we provide comprehensive maintenance services including regular updates, security patches, performance monitoring, content updates, and feature additions. Our maintenance packages ensure your digital assets remain secure, fast, and up-to-date."
    }
  ];

  return (
    <MarginWrapper top={96} bottom={96}>
      <div className="w-full max-w-[1904px] mx-auto">
        {/* FAQ Items Container */}
        <div className="w-full border-t border-white/20">
          <HorizontalMarginWrapper left={80} right={80}>
            <div className="flex flex-col lg:flex-row">
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
