import ServiceCard from './ServiceCard';

const ProjectManagementSection = () => {
  // Project Planning data
  const projectPlanningCards = [
    {
      icon: "/Images/Icons/project-planning-1.png",
      alt: "Requirements Gathering",
      text: "Requirements Gathering and Analysis"
    },
    {
      icon: "/Images/Icons/project-planning-2.png",
      alt: "Project Roadmap",
      text: "Project Roadmap and Timeline Development"
    },
    {
      icon: "/Images/Icons/project-planning-3.png",
      alt: "Resource Allocation",
      text: "Resource Allocation and Task Assignment"
    },
    {
      icon: "/Images/Icons/project-planning-4.png",
      alt: "Risk Assessment",
      text: "Risk Assessment and Mitigation Strategies"
    }
  ];

  // Agile Development data
  const agileDevCards = [
    {
      icon: "/Images/Icons/agile-development-1.png",
      alt: "Iterative Development",
      text: "Iterative Development and Sprints"
    },
    {
      icon: "/Images/Icons/agile-development-2.png",
      alt: "Scrum Methodology",
      text: "Scrum or Kanban Methodology Implementation"
    },
    {
      icon: "/Images/Icons/agile-development-3.png",
      alt: "Progress Updates",
      text: "Regular Progress Updates and Demos"
    },
    {
      icon: "/Images/Icons/agile-development-4.png",
      alt: "Continuous Improvement",
      text: "Continuous Improvement and Feedback Incorporation"
    }
  ];

  // Quality Assurance data
  const qualityAssuranceCards = [
    {
      icon: "/Images/Icons/quality-ensurance-1.png",
      alt: "Test Planning",
      text: "Test Planning and Execution"
    },
    {
      icon: "/Images/Icons/quality-ensurance-2.png",
      alt: "Functional Testing",
      text: "Functional and Usability Testing"
    },
    {
      icon: "/Images/Icons/quality-ensurance-3.png",
      alt: "Performance Testing",
      text: "Performance and Security Testing"
    },
    {
      icon: "/Images/Icons/quality-ensurance-4.png",
      alt: "Bug Tracking",
      text: "Bug Tracking and Issue Resolution"
    }
  ];

  return (
    <section className="w-full py-16">
      <div className="max-w-[1595px] mx-auto px-[50px]">
        {/* Main Heading and Description Container */}
        <div className="w-full h-[226px] pr-[50px]  flex flex-col gap-[30px] mb-16">
          <h2 className="font-barlow font-semibold text-[48px] leading-[100%] tracking-[0%] text-white">
            Project Management
          </h2>
          <p className="font-barlow font-normal text-[18px] leading-[150%] tracking-[-0.6%] text-white max-w-4xl">
            Our experienced project management team ensures that your projects are delivered on time, within budget, and according to your specifications. We follow industry-standard methodologies and employ effective communication and collaboration tools to keep you informed throughout the development process.
          </p>
          <button className="w-[346px] h-[50px] px-[14px] py-[12px] rounded-[30px] bg-green-600 hover:bg-green-700 text-white font-barlow font-semibold transition-all duration-200">
            Our project management services include
          </button>
        </div>

        {/* Project Planning Subsection */}
        <div className="mb-16">
          <h3 className="font-barlow font-medium text-[28px] leading-[100%] tracking-[0%] text-[#98989A] mb-8 w-[1595px] h-[34px] ">
            Project Planning and Scoping
          </h3>
          <div className="w-full h-[278px] border-t border-b border-gray-700 flex justify-center items-center">
            {projectPlanningCards.map((card, index) => (
              <ServiceCard
                key={index}
                iconSrc={card.icon}
                iconAlt={card.alt}
                text={card.text}
              />
            ))}
          </div>
        </div>

        {/* Agile Development Subsection */}
        <div className="mb-16">
          <h3 className="font-barlow font-medium text-[28px] leading-[100%] tracking-[0%] text-[#98989A] mb-8 w-[1595px] h-[34px]">
            Agile Development
          </h3>
          <div className="w-full h-[278px] border-t border-b border-gray-700 flex justify-center items-center">
            {agileDevCards.map((card, index) => (
              <ServiceCard
                key={index}
                iconSrc={card.icon}
                iconAlt={card.alt}
                text={card.text}
              />
            ))}
          </div>
        </div>

        {/* Quality Assurance Subsection */}
        <div className="mb-16">
          <h3 className="font-barlow font-medium text-[28px] leading-[100%] tracking-[0%] text-[#98989A] mb-8 w-[1595px] h-[34px] ">
            Quality Assurance and Testing
          </h3>
          <div className="w-full h-[278px] border-t border-b border-gray-700 flex justify-center items-center">
            {qualityAssuranceCards.map((card, index) => (
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

export default ProjectManagementSection;
