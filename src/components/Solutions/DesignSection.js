import ServiceCard from './ServiceCard';
import MarginWrapper from '../wrappers/sectionWrapper';
const DesignSection = () => {
  // UX Design data
  const uxDesignCards = [
    {
      icon: "/Images/Icons/user-experience1.png",
      alt: "User Research",
      text: "User Research and Persona Development"
    },
    {
      icon: "/Images/Icons/user-experience2.png",
      alt: "Information Architecture",
      text: "Information Architecture and Wireframing"
    },
    {
      icon: "/Images/Icons/user-experience3.png",
      alt: "Interactive Prototyping",
      text: "Interactive Prototyping and User Testing"
    },
    {
      icon: "/Images/Icons/user-experience4.png",
      alt: "UI Design",
      text: "UI Design and Visual Branding"
    }
  ];

  // UI Design data
  const uiDesignCards = [
    {
      icon: "/Images/Icons/user-interface-1.png",
      alt: "Interface Design",
      text: "Intuitive and Visually Appealing Interface Design"
    },
    {
      icon: "/Images/Icons/user-interface-2.png",
      alt: "Custom Iconography",
      text: "Custom Iconography and Illustration"
    },
    {
      icon: "/Images/Icons/user-interface-3.png",
      alt: "Typography",
      text: "Typography and Color Palette Selection"
    },
    {
      icon: "/Images/Icons/user-interface-4.png",
      alt: "Responsive Design",
      text: "Responsive Design for Various Devices"
    }
  ];

  // Branding data
  const brandingCards = [
    {
      icon: "/Images/Icons/brading-identity-1.png",
      alt: "Logo Design",
      text: "Logo Design and Visual Identity Development"
    },
    {
      icon: "/Images/Icons/brading-identity-2.png",
      alt: "Brand Strategy",
      text: "Brand Strategy and Positioning"
    },
    {
      icon: "/Images/Icons/brading-identity-3.png",
      alt: "Brand Guidelines",
      text: "Brand Guidelines and Style Guides"
    },
    {
      icon: "/Images/Icons/brading-identity-4.png",
      alt: "Marketing Collateral",
      text: "Marketing Collateral Design (Brochures, Business Cards, etc.)"
    }
  ];

  return (
    <section className="w-full py-16">
      <div className="max-w-[1596px] mx-auto px-[50px]">
        {/* Main Heading */}
        <MarginWrapper bottom={50}>
        <h2 className="font-barlow font-semibold text-[48px] leading-[100%] tracking-[0%] text-white mb-6">
          Design
        </h2>
        
        {/* Description */}
        <p className="font-barlow font-normal text-[18px] leading-[150%] tracking-[-0.6%] text-white mb-8 max-w-4xl">
          At Codroon, our design team is passionate about creating stunning, user-centric designs that captivate your audience and elevate your brand. We believe that great design is not just about aesthetics; it's about creating seamless and intuitive user experiences.
        </p>
        <button className="w-[346px] h-[50px] px-[14px] py-[12px] rounded-[30px] bg-[#52B069] hover:bg-green-700 text-white font-barlow font-semibold transition-all duration-200">
        Our design services include:
          </button>
          </MarginWrapper>
        {/* UX Design Subsection */}
        <div className="mb-16">
          <h3 className="font-barlow font-medium text-[28px] leading-[100%] tracking-[0%] text-[#98989A] mb-8">
            User Experience (UX) Design
          </h3>
          <div className="w-full h-[278px] border-t border-b border-gray-700 flex justify-center items-center">
            {uxDesignCards.map((card, index) => (
              <ServiceCard
                key={index}
                iconSrc={card.icon}
                iconAlt={card.alt}
                text={card.text}
              />
            ))}
          </div>
        </div>

        {/* UI Design Subsection */}
        <div className="mb-16">
          <h3 className="font-barlow font-medium text-[28px] leading-[100%] tracking-[0%] text-[#98989A] mb-8">
            User Interface (UI) Design
          </h3>
          <div className="w-full h-[278px] border-t border-b border-gray-700 flex justify-center items-center">
            {uiDesignCards.map((card, index) => (
              <ServiceCard
                key={index}
                iconSrc={card.icon}
                iconAlt={card.alt}
                text={card.text}
              />
            ))}
          </div>
        </div>

        {/* Branding Subsection */}
        <div className="mb-16">
          <h3 className="font-barlow font-medium text-[28px] leading-[100%] tracking-[0%] text-[#98989A] mb-8">
            Branding and Identity
          </h3>
          <div className="w-full h-[278px] border-t border-b border-gray-700 flex justify-center items-center">
            {brandingCards.map((card, index) => (
              <ServiceCard
                key={index}
                iconSrc={card.icon}
                iconAlt={card.alt}
                text={card.text}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DesignSection;
