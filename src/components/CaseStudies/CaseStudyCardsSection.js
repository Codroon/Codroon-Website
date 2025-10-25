import Image from "next/image";
import MarginWrapper from "@/components/wrappers/sectionWrapper";

const caseStudies = [
  {
    category: "E-Commerce Platform for Fashion Hub",
    projectName: "Chic Boutique",
    website: "https://www.chicboutique.com",
    description:
      "We developed a visually stunning and user-friendly e-commerce platform for Chic Boutique, a renowned fashion retailer. The platform featured seamless product browsing, secure payment integration, and personalized recommendations, resulting in increased online sales and customer satisfaction.",
  },
  {
    category: "Mobile App for Food Delivery Service",
    projectName: "HungryBites",
    website: "https://www.hungrybites.com",
    description:
      "HungryBites approached us to create a mobile app that streamlined their food delivery service. The app included features like real-time order tracking, easy menu customization, and secure payment options, resulting in improved customer convenience and operational efficiency.",
  },
  {
    category: "Booking and Reservation System for Event Management",
    projectName: "EventMasters",
    website: "https://www.eventmasters.com",
    description:
      "EventMasters required a comprehensive booking and reservation system for their event services. We designed a user-friendly platform that allowed seamless event registration, ticketing, and attendee management, resulting in streamlined processes and enhanced customer experiences.",
  },
  {
    category: "Custom Software for Workflow Automation",
    projectName: "ProTech Solutions",
    website: "https://www.protechsolutions.com",
    description:
      "ProTech Solutions required a custom software solution to automate their internal workflows. We developed a robust system that integrated with existing tools, automated repetitive tasks, and provided real-time analytics, leading to significant time savings and increased productivity.",
  },
  {
    category: "Web Portal for Real Estate Listings",
    projectName: "Dream Homes Realty",
    website: "https://www.dreamhomesrealty.com",
    description:
      "Dream Homes Realty wanted an intuitive web portal for showcasing their property listings. We created a visually appealing platform with advanced search filters, virtual tours, and a user-friendly interface, enabling potential buyers to find their dream homes easily.",
  },
  {
    category: "Mobile App for Fitness Tracking",
    projectName: "FitLife Tracker",
    website: "https://www.fitlifetracker.com",
    description:
      "FitLife Tracker approached us to develop a mobile app that tracked fitness activities and provided personalized workout plans. The app included features such as activity tracking, progress monitoring, and social sharing, empowering users to lead healthier lifestyles.",
  },
  {
    category: "Custom Software for Supply Chain Management",
    projectName: "Global Logistics Solutions",
    website: "https://www.globallogisticssolutions.com",
    description:
      "Global Logistics Solutions required a custom software solution to streamline their supply chain operations. We developed a scalable system that optimized inventory management, automated order processing, and enhanced logistics tracking, resulting in improved efficiency and reduced costs.",
  },
  {
    category: "Educational Platform for Online Learning",
    projectName: "EduConnect",
    website: "https://www.educonnect.com",
    description:
      "EduConnect sought an educational platform to facilitate online learning. We developed an interactive platform with virtual classrooms, multimedia content, and student progress tracking, providing a seamless and engaging learning experience for students of all ages.",
  },
  {
    category: "Mobile App for Travel Planning",
    projectName: "WanderWise",
    website: "https://www.wanderwise.com",
    description:
      "WanderWise wanted a mobile app that simplified travel planning and discovery. We developed an app with features like personalized itineraries, destination guides, and integrated booking options, making it easier for travelers to explore new destinations.",
  },
  {
    category: "Web Application for Customer Relationship Management",
    projectName: "ConnectCRM",
    website: "https://www.connectcrm.com",
    description:
      "ConnectCRM needed a web application to manage their customer relationships effectively. We developed a feature-rich CRM platform with lead management, communication tracking, and data analytics, enabling businesses to nurture customer relationships and drive growth.",
  },
];

export default function CaseStudyCardsSection() {
  return (
    <MarginWrapper top={96} bottom={96}>
      <div className="w-full max-w-[1596px] mx-auto px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[50px]">
        {/* Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[50px] pb-[100px]">
          {caseStudies.map((study, index) => (
         <div
         key={index}
         className="bg-[#0F172A] rounded-[12px] w-full h-auto overflow-hidden flex flex-col"
       >
       
              {/* Category Header */}
              <div className="border-y border-white/10  py-[30px]">
                <h3 className="font-barlow font-medium text-[20px] leading-[150%] text-[#98989A]">
                  {study.category}
                </h3>
              </div>

              {/* Different layout for first card */}
              {index === 0 ? (
                <>
                  <div className=" flex justify-between items-center mb-[20px]">
                    <div className="pt-[10px]">
                      <h4 className="font-barlow font-medium text-[24px] text-white leading-[150%] tracking-tight">
                        {study.projectName}
                      </h4>

                      <a
                        href={study.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-[#14243B] rounded-[8px] text-white px-[14px] py-[10px] text-[18px] font-barlow mt-[10px]"
                      >
                        {study.website}
                      </a>
                    </div>

                    <div className="bg-[#14243B] rounded-[8px] w-[54px] h-[54px] flex items-center justify-center p-[10px]">
                      <Image
                        src="/Images/Icons/top-right-arrow.png"
                        alt="External Link"
                        width={28}
                        height={28}
                      />
                    </div>
                  </div>

                  {/* Image */}
                  <div className="flex justify-center py-[20px]">
                    <Image
                      src="/Images/laptop.jpg"
                      alt="Project Preview"
                      width={698}
                      height={423}
                      className="rounded-[12px] object-cover"
                    />
                  </div>

                  {/* Description */}
                  <div className="">
                    <p className="font-inter text-[18px] text-[#E6E6E6] leading-[150%]">
                      {study.description}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* Image first */}
                  <div className="flex justify-center py-[20px]">
                    <Image
                      src="/Images/laptop.jpg"
                      alt="Project Preview"
                      width={698}
                      height={423}
                      className="rounded-[12px] object-cover"
                    />
                  </div>

                  {/* Project Info below */}
                  <div className=" flex justify-between items-center mb-[20px]">
                    <div>
                      <h4 className="font-barlow font-medium text-[24px] text-white leading-[150%] tracking-tight">
                        {study.projectName}
                      </h4>

                      <a
                        href={study.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-[#14243B] rounded-[8px] text-white px-[14px] py-[10px] text-[18px] font-barlow mt-[10px]"
                      >
                        {study.website}
                      </a>
                    </div>

                    <div className="bg-[#14243B] rounded-[8px] w-[54px] h-[54px] flex items-center justify-center p-[10px]">
                      <Image
                        src="/Images/Icons/top-right-arrow.png"
                        alt="External Link"
                        width={28}
                        height={28}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="">
                    <p className="font-inter text-[18px] text-white leading-[150%]">
                      {study.description}
                    </p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </MarginWrapper>
  );
}
