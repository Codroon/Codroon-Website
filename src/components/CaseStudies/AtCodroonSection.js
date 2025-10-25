import MarginWrapper from "@/components/wrappers/sectionWrapper";
import HorizontalMarginWrapper from "../wrappers/horizontalmarginWrapper";
export default function AtCodroonSection() {
  return (
    <MarginWrapper top={96} bottom={96}>
      <HorizontalMarginWrapper left={50} right={50}>
      <div className="w-full max-w-[1597px] mt-[50px]mx-auto relative">
        {/* Text Container - Left aligned */}
        <div 
          className="flex flex-col gap-[20px] " 

        >
          <h2 
            className="font-barlow font-semibold text-left mt-[20px] text-[#E6E6E6]"
            style={{ 
              fontSize: '48px', 
              lineHeight: '100%', 
              letterSpacing: '0%' 
            }}
          >
            At Codroon
          </h2>
          <p 
            className="font-barlow font-normal text-left text-white"
            style={{ 
              fontSize: '18px', 
              lineHeight: '150%', 
              letterSpacing: '-0.6%' 
            }}
          >
            We have had the privilege of working with a diverse range of clients and delivering exceptional digital products that drive success
          </p>
          
          {/* Call to Action Button */}
          <button 
            className="text-white font-barlow font-semibold transition-all duration-200 flex items-center justify-center rounded-[30px]"
            style={{ 
              width: '446px', 
              height: '50px', 
              paddingTop: '12px', 
              paddingRight: '14px', 
              paddingBottom: '12px', 
              paddingLeft: '14px', 
              gap: '10px',
              backgroundColor: '#44915C'
            }}
          >
            Here are 10 examples of our notable works
          </button>
        </div>
      </div>
      </HorizontalMarginWrapper>
    </MarginWrapper>
  );
}
