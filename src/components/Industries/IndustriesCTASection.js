import Image from 'next/image';

const IndustriesCTASection = () => {
  return (
    <section className="relative w-full h-[619px] flex items-center justify-center overflow-hidden">
      {/* Background Image - brain1 */}
      <Image
        src="/Images/Brain.jpg"
        alt="Brain Network"
        fill
        priority
        className="object-cover opacity-25"
      />

      <div className="absolute inset-0 bg-indigo-900/70 mix-blend-multiply" />
      {/* Blue blush overlay */}
      <div className="absolute inset-0 bg-[#0F172A] opacity-[0.23]"></div>
      
      {/* Content */}
      <div className="relative z-10 text-center flex flex-col items-center gap-[50px] px-[350px] py-[120px]">
        {/* Logo */}
        <Image
          src="/codroon-logo.png"
          alt="Codroon Logo"
          width={201}
          height={41}
          className="mb-4"
        />
        
        {/* Heading */}
        <h2 className="font-barlow font-semibold text-[38px] leading-[100%] tracking-[0%] text-white text-center">
          Let us Bring your Ideas to Life in the Digital World.
        </h2>
        
        {/* Description */}
        <p className="font-barlow font-normal text-[18px] leading-[150%] tracking-[-0.6%] text-white text-center max-w-4xl">
          No matter which industry you're in, we are committed to delivering exceptional results that exceed your expectations. Our multidisciplinary team works closely together to ensure seamless collaboration and a unified vision for your digital product.
        </p>
        
        {/* Button */}
        <button 
          className="text-white font-barlow font-semibold transition-all duration-200 flex items-center justify-center gap-[8px] rounded-[30px]"
          style={{ 
            width: '265px', 
            height: '63px', 
            paddingTop: '18px', 
            paddingRight: '34px', 
            paddingBottom: '18px', 
            paddingLeft: '34px', 
            gap: '8px',
            backgroundColor: '#44915C'
          }}
        >
          Start Project
        </button>
      </div>
    </section>
  );
};

export default IndustriesCTASection;
