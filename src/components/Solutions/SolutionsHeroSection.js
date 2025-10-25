import Image from 'next/image';

const SolutionsHeroSection = () => {
  return (
    <section className="relative w-full h-[558px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="/Images/furisticBusinessScene.jpg"
        alt="Futuristic Business Scene"
        fill
        priority
        className="object-cover opacity-25 "
      />

  <div className="absolute inset-0 bg-indigo-900/70 mix-blend-multiply" />
      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <h1 className="font-barlow font-semibold text-[48px] leading-[100%] tracking-[0%] text-white mb-6">
          Our Solutions
        </h1>
        <p className="font-barlow font-normal text-[20px] leading-[24px] tracking-[-0.6%] text-white max-w-4xl mx-auto">
          Transform your brand with our innovative digital solutions that captivate and engage your audience.
        </p>
      </div>
    </section>
  );
};

export default SolutionsHeroSection;
