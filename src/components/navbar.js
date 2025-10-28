'use client';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

const Navbar = () => {
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const dropdownRef = useRef(null);
  const resourcesButtonRef = useRef(null);

  // ✅ Ensure this only runs on client
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        resourcesButtonRef.current &&
        !resourcesButtonRef.current.contains(event.target)
      ) {
        setIsResourcesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Solutions", href: "/solutions" },
    { name: "Products", href: "/case-studies" },
    { name: "Process", href: "/process" },
    { name: "Industries", href: "/industries" },
    { name: "Resources", href: "#", hasDropdown: true },
  ];

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/codroon-logo.png"
            alt="Codroon Logo"
            width={201}
            height={41}
            priority
          />
        </div>

        {/* Menu */}
        <div className="hidden md:flex space-x-8 items-center font-barlow font-semibold tracking-[0.5px]">
          {menuItems.map((item) =>
            item.hasDropdown ? (
              <div key={item.name} className="relative">
                <button
                  ref={resourcesButtonRef}
                  onClick={() => setIsResourcesOpen((prev) => !prev)}
                  className="
                    text-white hover:text-green-400 
                    font-heading font-medium 
                    text-[18px] leading-[150%] 
                    transition-colors duration-200
                    flex items-center gap-2 cursor-pointer
                  "
                >
                  {item.name}
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className={`transition-transform duration-200 ${isResourcesOpen ? 'rotate-180' : ''}`}
                  >
                    <path
                      d="M3 4.5L6 7.5L9 4.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {/* Dropdown */}
                <div
                  ref={dropdownRef}
                  className={`absolute top-full left-0 mt-2 w-48 bg-[#0F172A] border border-gray-600 rounded-lg shadow-lg py-2 z-50 transition-all duration-200 ${
                    isResourcesOpen
                      ? 'opacity-100 visible translate-y-0'
                      : 'opacity-0 invisible -translate-y-2'
                  }`}
                >
                  <a
                    href="/contact-us"
                    className="block px-4 py-2 text-white hover:bg-gray-700 transition-colors duration-200"
                  >
                    Contact Us
                  </a>
                  <a
                    href="/who-we-are"
                    className="block px-4 py-2 text-white hover:bg-gray-700 transition-colors duration-200"
                  >
                    About Us
                  </a>
                </div>
              </div>
            ) : (
              <a
                key={item.name}
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
            )
          )}
        </div>

        {/* Contact Us button */}
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
