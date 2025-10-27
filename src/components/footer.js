// components/Footer.jsx
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  // Define navigation links
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Solutions', href: '/solutions' },
    { name: 'Products', href: '/case-studies' },
    { name: 'Process', href: '/process' },
    { name: 'Industries', href: '/industries' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact-us' },
  ];

  // Define social links
  const socialLinks = [
    { Icon: Facebook, href: '#', label: 'Facebook' },
    { Icon: Twitter, href: '#', label: 'Twitter' },
    { Icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-[#0F172A] text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Top Section: Logo, Navigation, Social Links */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-gray-700 pb-8">
          
          {/* Logo */}
          <div className="mb-6 lg:mb-0">
            {/* Replace with your actual logo component or image */}
            <Image
              src="/codroon-logo.png" // Adjust path to your logo image
              alt="Codroon Logo"
              width={201} 
              height={41} 
            />
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-row items-center justify-center gap-[30px] w-auto max-w-[574px] h-auto">
  {navLinks.map((link) => (
    <Link
      key={link.name}
      href={link.href}
      className="font-barlow font-[500] text-[18px] leading-[150%] tracking-[0] text-white hover:text-[#4ADE80] transition-colors duration-300"
    >
      {link.name}
    </Link>
  ))}
</nav>


         <div className="flex items-center gap-[16px]">
  <span className="font-barlow font-[500] text-[18px] leading-[150%] tracking-[0] text-gray-400">
    Stay Connected
  </span>

  <div className="flex gap-[10px]">
    {socialLinks.map(({ Icon, href, label }) => (
      <Link
  key={label}
  href={href}
  aria-label={label}
  className="p-[20px] bg-[#14243B] rounded-[8px] border border-[#14243B] transition-all duration-300 hover:bg-[#1B2B47] hover:shadow-[0_0_10px_rgba(6,214,160,0.3)]"
>
  <Icon size={24} className="text-[#06D6A0] fill-[#06D6A0]" />
</Link>

    ))}
  </div>
</div>

        </div>

       <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-8 text-white w-full max-w-[1596px] mx-auto">
  {/* LEFT: Contact Information */}
  <div className="flex flex-col md:flex-row items-start md:items-center gap-[30px] w-auto border-b border-[#1E293B] pb-4 md:pb-[16px]">
    
    {/* Email */}
    <div className="flex items-center gap-[10px]">
      <Mail size={24} className="text-[#06D6A0]" />
      <a
        href="mailto:hello@Codroon.com"
        className="text-[18px] font-[400] font-heading leading-[150%] text-white hover:text-[#06D6A0] transition-colors duration-300"
      >
        hello@Codroon.com
      </a>
    </div>

    {/* Phone */}
    <div className="flex items-center gap-[10px]">
      <Phone size={24} className="text-[#06D6A0]" />
      <a
        href="tel:+919991323306"
        className="text-[18px] font-[400] font-heading leading-[150%] text-white hover:text-[#06D6A0] transition-colors duration-300"
      >
        +91 99913 23 306
      </a>
    </div>

    {/* Location */}
    <div className="flex items-center gap-[10px]">
      <MapPin size={24} className="text-[#06D6A0]" />
      <span className="text-[18px] font-[400] font-heading leading-[150%] text-white">
        Somewhere In the World
      </span>
    </div>
  </div>

  {/* RIGHT: Copyright */}
  <p className="text-[18px] font-[400] font-heading leading-[150%] text-white mt-6 md:mt-0">
    © 2023 Codroon. All rights reserved.
  </p>
</div>

      </div>
    </footer>
  );
};

export default Footer;