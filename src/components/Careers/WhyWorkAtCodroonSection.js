import MarginWrapper from "../wrappers/sectionWrapper";
export default function WhyWorkAtCodroonSection() {
  const benefits = [
    {
      title: "Innovative and Impactful Projects",
      description: "At Codroon, you'll have the opportunity to work on exciting and impactful projects that shape the digital landscape. From designing intuitive user interfaces to developing robust software solutions, you'll be part of a team that creates products that make a difference."
    },
    {
      title: "Supportive Environment",
      description: "At Codroon, you'll have the opportunity to work on exciting and impactful projects that shape the digital landscape. From designing intuitive user interfaces to developing robust software solutions, you'll be part of a team that creates products that make a difference."
    },
    {
      title: "Continuous Learning and Growth",
      description: "We believe in investing in our team's growth and development. We provide opportunities for continuous learning, whether it's through workshops, training programs, or attending industry conferences. At Codroon, you'll have the chance to expand your skill set and stay up-to-date with the latest trends and technologies."
    },
    {
      title: "Challenging and Rewarding Work",
      description: "Our projects are challenging, but the rewards are even greater. We tackle complex problems and push ourselves to deliver innovative solutions. You'll be empowered to take ownership of your work, make a real impact, and see your ideas come to life."
    }
  ];

  return (
    <MarginWrapper top={90}>
    <section className="w-full bg-[#0F172A] py-[120px]">
      <div className="container mx-auto px-4">
        <div className="max-w-[1595px] mx-auto">
          {/* Welcome Section */}
          <div className="mb-[50px] px-[50px]">
            <div className="mb-[50px]">
              <h2 className="font-barlow font-semibold text-[48px] leading-[120%] text-white mb-[14px]">
                Welcome to Codroon, where talent meets opportunity!
              </h2>
              <p className="font-barlow font-normal text-[18px] leading-[150%] tracking-[-0.6%] text-[#E6E6E6] max-w-[1200px]">
                At Codroon, we believe that the success of our agency lies in the talent, passion, and dedication of our team members. We are a digital product agency that thrives on innovation, creativity, and collaboration. If you're ready to make a difference and contribute to cutting-edge projects, we invite you to explore career opportunities with us.
              </p>
            </div>
            
            <div className="flex justify-start">
              <button className="bg-[#57BB6D] hover:bg-[#4A9B5A] text-[#0F172A] font-barlow font-normal text-[22px] leading-[120%] px-[14px] py-[12px] rounded-[30px] transition-colors duration-200">
                Why Work at Codroon?
              </button>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {benefits.map((benefit, index) => (
              <div key={index} className="border-b border-[#262626] last:border-b-0">
                <div className="px-[50px] py-[100px]">
                  <div className="mb-[50px]">
                    <h3 className="font-barlow font-medium text-[40px] leading-[150%] text-[#57BB6D] mb-[50px]">
                      {benefit.title}
                    </h3>
                    <div className="w-full h-[1px] bg-[#262626]"></div>
                  </div>
                  <p className="font-inter font-normal text-[18px] leading-[150%] text-[#98989A]">
                    {benefit.description}
                  </p>
                </div>
                {index < benefits.length - 1 && (
                  <div className="w-[1px] h-full bg-[#262626] absolute right-0 top-0"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
    </MarginWrapper>
  );
}
