'use client'
// components/Header.jsx
import Image from 'next/image';
import { useState } from 'react';

const Navbar = () => {
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-10 bg-transparent z-99">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          {/* Replace with your actual logo component or image */}
          <Image
            src="/codroon-logo.png" // Adjust path to your logo image
            alt="Codroon Logo"
            width={201} // Adjust width as needed
            height={41} // Adjust height as needed
          />
        </div>
        <div className="hidden md:flex space-x-8 items-center font-barlow font-semibold tracking-[0.5px]">
  {[
    { name: "Home", href: "/" },
    { name: "Solutions", href: "/solutions" },
    { name: "Products", href: "/case-studies" },
    { name: "Process", href: "/process" },
    { name: "Industries", href: "/industries" },
    { name: "Resources", href: "#", hasDropdown: true }
  ].map(
    (item) => (
      <div key={item.name} className="relative">
        {item.hasDropdown ? (
          <div 
            className="relative"
            onMouseEnter={() => setIsResourcesOpen(true)}
            onMouseLeave={() => setIsResourcesOpen(false)}
          >
            <a
              href={item.href}
              className="
                text-white hover:text-green-400 
                font-heading font-medium 
                text-[18px] leading-[150%] 
                transition-colors duration-200
                cursor-pointer
              "
            >
              {item.name}
            </a>
            {isResourcesOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                <a
                  href="/contact-us"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                >
                  Contact Us
                </a>
                <a
                  href="/who-we-are"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                >
                  About Us
                </a>
              </div>
            )}
          </div>
        ) : (
          <a
            href={item.href}
            className="
              text-white hover:text-green-400 
              font-heading font-medium 
              text-[18px] leading-[150%] 
              transition-colors duration-200
            "
          >
            {item.name}
          </a>
        )}
      </div>
    )
  )}
</div>

       <button
  className="
    bg-green-600 hover:bg-green-700 
    text-white font-heading font-semibold 
    w-[197px] h-[59px] 
    px-[24px] py-[16px] 
    rounded-[57px] 
    text-lg 
    flex items-center justify-center gap-[8px]
    transition-all duration-200 font-barlow
    cursor-pointer
  "
>
  Contact Us
</button>

      </nav>
    </header>
  );
};

export default Navbar;