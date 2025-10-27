import Image from "next/image";

export default function CurrentOpeningsSection() {
  const jobCategories = [
    {
      title: "Design Job Openings",
      jobs: [
        {
          title: "UI Designer",
          description: "Bring your creativity and expertise to our team as a UI Designer. Collaborate with cross-functional teams to design visually stunning and user-friendly interfaces. Utilize your skills in layout design, typography, and color theory to create engaging digital experiences that leave a lasting impression.",
          icon: "/Images/Careers/ui-designer-icon.svg"
        },
        {
          title: "UX Designer", 
          description: "Join us as a UX Designer and help shape exceptional user experiences. Conduct user research, analyze data, and create wireframes and prototypes to design intuitive and user-centric interfaces. Collaborate closely with UI Designers, developers, and stakeholders to ensure seamless and enjoyable user journeys.",
          icon: "/Images/Careers/ux-designer-icon.svg"
        },
        {
          title: "Design Head",
          description: "Lead our design team as a Design Head and drive the creative vision of our products. Provide strategic direction, mentorship, and guidance to UI and UX designers. Collaborate with cross-functional teams to ensure design consistency and elevate our brand identity through innovative and visually impactful designs.",
          icon: "/Images/Careers/design-head-icon.svg"
        }
      ]
    },
    {
      title: "Development Job Openings",
      jobs: [
        {
          title: "Front-End Developer",
          description: "Join our team as a Front-End Developer and bring our designs to life. Transform UI/UX wireframes into interactive web interfaces using HTML, CSS, and JavaScript. Collaborate closely with designers and back-end developers to ensure seamless integration and optimal user experiences.",
          icon: "/Images/Careers/frontend-developer-icon.svg"
        },
        {
          title: "Back-End Developer",
          description: "Be part of our team as a Backend Developer and contribute to building robust and scalable web applications. Develop server-side logic, integrate databases, and optimize system performance. Collaborate with front-end developers to ensure smooth communication between the server and the user interface.",
          icon: "/Images/Careers/backend-developer-icon.svg"
        },
        {
          title: "Full Stack Developer",
          description: "Join us as a Full Stack Developer and take on end-to-end responsibility for web application development. Combine your skills in both front-end and back-end technologies to create dynamic and responsive websites. Collaborate with designers, developers, and stakeholders to deliver comprehensive and user-friendly solutions.",
          icon: "/Images/Careers/fullstack-developer-icon.svg"
        }
      ]
    },
    {
      title: "Management Job Openings",
      jobs: [
        {
          title: "BA Manager",
          description: "Lead our business analysis team as a BA Manager and drive strategic initiatives. Gather and analyze requirements, facilitate communication between stakeholders, and ensure project alignment with business objectives. Provide leadership and mentorship to a team of talented business analysts.",
          icon: "/Images/Careers/ba-manager-icon.svg"
        },
        {
          title: "Project Manager",
          description: "Join our team as a Project Manager and oversee the successful delivery of projects from initiation to completion. Define project scope, manage timelines and resources, and ensure effective communication across cross-functional teams. Utilize your leadership and organizational skills to drive project success.",
          icon: "/Images/Careers/project-manager-icon.svg"
        },
        {
          title: "HR Manager",
          description: "Be part of our team as an HR Manager and play a vital role in managing our human resources. Lead talent acquisition, employee engagement, and performance management initiatives. Collaborate with leadership to develop and implement HR strategies that foster a positive and inclusive work culture.",
          icon: "/Images/Careers/hr-manager-icon.svg"
        }
      ]
    },
    {
      title: "QA Job Openings",
      jobs: [
        {
          title: "QA Tester",
          description: "Ensure the quality of our software products as a QA Tester. Develop test plans, execute test cases, and identify and report software defects. Collaborate with developers and stakeholders to ensure that our products meet high-quality standards and deliver an exceptional user experience.",
          icon: "/Images/Careers/qa-tester-icon.svg"
        },
        {
          title: "SQL Tester",
          description: "Join us as an SQL Tester and play a key role in testing and validating the integrity of our databases. Write complex SQL queries to perform data validation and identify any anomalies. Collaborate with developers and QA testers to ensure the accuracy and reliability of our data.",
          icon: "/Images/Careers/sql-tester-icon.svg"
        },
        {
          title: "Manual Tester",
          description: "Be part of our team as a Manual Tester and perform comprehensive manual testing to ensure the quality and functionality of our software applications. Develop test cases, execute test scripts, and document test results. Collaborate with developers and QA testers to troubleshoot issues and enhance software performance.",
          icon: "/Images/Careers/manual-tester-icon.svg"
        }
      ]
    }
  ];

  return (
    <section className="w-full bg-[#0F172A] py-[120px]">
      <div className="container mx-auto px-4">
        <div className="max-w-[1595px] mx-auto">
          {/* Header */}
          <div className="mb-[50px] px-[50px]">
            <h2 className="font-barlow font-semibold text-[48px] leading-[120%] text-white mb-[14px]">
              Current Openings
            </h2>
            <p className="font-barlow font-normal text-[18px] leading-[150%] tracking-[-0.6%] text-[#E6E6E6] max-w-[1200px]">
              We are always on the lookout for talented individuals who are passionate about creating exceptional digital experiences. Whether you're a designer, engineer, project manager, or have skills that align with our agency's mission, we encourage you to explore our open positions.
            </p>
          </div>

          {/* Job Categories */}
          <div className="space-y-0">
            {jobCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="border-t border-[#57BB6D] first:border-t-0">
                <div className="px-[50px] py-[50px]">
                  <h3 className="font-barlow font-medium text-[28px] leading-[120%] text-[#98989A] mb-[50px] pl-0">
                    {category.title}
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-[#57BB6D] border-t-0">
                    {category.jobs.map((job, jobIndex) => (
                      <div key={jobIndex} className="border-r border-[#57BB6D] last:border-r-0">
                        <div className="p-[50px] h-full flex flex-col justify-between">
                            <div className="mb-[30px]">
                              <div className="mb-[30px]">
                                <div className="w-[72px] h-[72px] mb-[30px]">
                                  <Image
                                    src={job.icon}
                                    alt={`${job.title} icon`}
                                    width={72}
                                    height={72}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              <h4 className="font-barlow font-medium text-[24px] leading-[150%] tracking-[-0.6%] text-white mb-[20px]">
                                {job.title}
                              </h4>
                              <p className="font-barlow font-normal text-[18px] leading-[150%] text-[#E6E6E6]">
                                {job.description}
                              </p>
                            </div>
                          </div>
                          
                          <button className="w-full bg-[#57BB6D] hover:bg-[#4A9B5A] text-[#0F172A] font-barlow font-medium text-[18px] leading-[133%] tracking-[-0.6%] px-[16px] py-[18px] rounded-[30px] transition-colors duration-200">
                            Apply Now
                          </button>
                        </div>
                        {jobIndex < category.jobs.length - 1 && (
                          <div className="w-[1px] h-full bg-[#57BB6D] absolute right-0 top-0"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
