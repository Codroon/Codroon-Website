import ServiceCard from './ServiceCard';
import MarginWrapper from '../wrappers/sectionWrapper';
const EngineeringSection = () => {
  // Web Development data
  const webDevCards = [
    {
      icon: "/Images/Icons/web-development-1.png",
      alt: "Front-End Development",
      text: "Front-End Development (HTML, CSS, JavaScript)"
    },
    {
      icon: "/Images/Icons/web-development-2.png",
      alt: "Back-End Development",
      text: "Back-End Development (PHP, Python, Ruby)"
    },
    {
      icon: "/Images/Icons/web-development-3.png",
      alt: "CMS Development",
      text: "Content Management System (CMS) Development (WordPress, Drupal)"
    },
    {
      icon: "/Images/Icons/web-development-4.png",
      alt: "E-Commerce Development",
      text: "E-Commerce Platform Development (Magento, Shopify)"
    }
  ];

  // Mobile App Development data
  const mobileAppCards = [
    {
      icon: "/Images/Icons/mobile-app-1.png",
      alt: "Native App Development",
      text: "Native iOS and Android App Development"
    },
    {
      icon: "/Images/Icons/mobile-app-2.png",
      alt: "Cross-Platform Development",
      text: "Cross-Platform App Development (React Native, Flutter)"
    },
    {
      icon: "/Images/Icons/mobile-app-3.png",
      alt: "App Prototyping",
      text: "App Prototyping and UI/UX Design Integration"
    },
    {
      icon: "/Images/Icons/mobile-app-4.png",
      alt: "App Testing",
      text: "App Testing, Deployment, and Maintenance"
    }
  ];

  // Custom Software Development data
  const customDevCards = [
    {
      icon: "/Images/Icons/custom-development-1.png",
      alt: "Enterprise Software",
      text: "Enterprise Software Development"
    },
    {
      icon: "/Images/Icons/custom-development-2.png",
      alt: "Custom Web Applications",
      text: "Custom Web Application Development"
    },
    {
      icon: "/Images/Icons/custom-development-3.png",
      alt: "API Integration",
      text: "Integration with Third-Party APIs and Systems"
    },
    {
      icon: "/Images/Icons/custom-development-4.png",
      alt: "Legacy Modernization",
      text: "Legacy System Modernization and Migration"
    }
  ];

  return (
    <section className="w-full py-16">
      <div className="max-w-[1595px] mx-auto px-[50px]">
        {/* Main Heading and Description Container */}
       
        <MarginWrapper bottom={50}>
        <div className="w-full h-auto pr-[50px]  flex flex-col gap-[30px] mb-16">
          <h2 className="font-barlow font-semibold text-[48px] leading-[100%] tracking-[0%] text-white">
            Engineering
          </h2>
          <p className="font-barlow font-normal text-[18px] leading-[150%] tracking-[-0.6%] text-white max-w-4xl">
            Our engineering team combines technical expertise with a passion for innovation to build robust and scalable digital solutions. We leverage the latest technologies and best practices to deliver high-performance applications tailored to your specific needs.
          </p>
          <button className="w-[346px] h-[50px] px-[14px] py-[12px] rounded-[30px] bg-green-600 hover:bg-green-700 text-white font-barlow font-semibold transition-all duration-200">
            Our engineering services include
          </button>
        </div>
        </MarginWrapper>
        {/* Web Development Subsection */}
        <div className="mb-16">
          <h3 className="font-barlow font-medium text-[28px] leading-[100%] tracking-[0%] text-[#98989A] mb-8 w-[1595px] h-[34px] ">
            Web Development
          </h3>
          <div className="w-full h-[278px] border-t border-b border-gray-700 flex justify-center items-center">
            {webDevCards.map((card, index) => (
              <ServiceCard
                key={index}
                iconSrc={card.icon}
                iconAlt={card.alt}
                text={card.text}
              />
            ))}
          </div>
        </div>

        {/* Mobile App Development Subsection */}
        <div className="mb-16">
          <h3 className="font-barlow font-medium text-[28px] leading-[100%] tracking-[0%] text-[#98989A] mb-8 w-[1595px] h-[34px]">
            Mobile App Development
          </h3>
          <div className="w-full h-[278px] border-t border-b border-gray-700 flex justify-center items-center">
            {mobileAppCards.map((card, index) => (
              <ServiceCard
                key={index}
                iconSrc={card.icon}
                iconAlt={card.alt}
                text={card.text}
              />
            ))}
          </div>
        </div>

        {/* Custom Software Development Subsection */}
        <div className="mb-16">
          <h3 className="font-barlow font-medium text-[28px] leading-[100%] tracking-[0%] text-[#98989A] mb-8 w-[1595px] h-[34px] ">
            Custom Software Development
          </h3>
          <div className="w-full h-[278px] border-t border-b border-gray-700 flex justify-center items-center">
            {customDevCards.map((card, index) => (
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

export default EngineeringSection;
