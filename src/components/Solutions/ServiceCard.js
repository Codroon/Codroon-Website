import Image from 'next/image';

const ServiceCard = ({ iconSrc, iconAlt, text }) => {
  return (
    <div className="w-[399px] h-[278px] p-[50px] flex flex-col items-center justify-center gap-[30px]">
      {/* Icon Container */}
      <div 
        className="w-[88px] h-[88px] p-[24px] rounded-[12px] border border-green-500/20 flex items-center justify-center"
        style={{
          background: 'linear-gradient(130.97deg, rgba(82, 176, 105, 0.2) -66.81%, rgba(82, 176, 105, 0) 37.19%)'
        }}
      >
        <Image
          src={iconSrc}
          alt={iconAlt}
          width={40}
          height={40}
          className="object-contain"
        />
      </div>
      
      {/* Text */}
      <p className="font-barlow font-medium text-[20px] leading-[150%] tracking-[-0.6%] text-white text-center">
        {text}
      </p>
    </div>
  );
};

export default ServiceCard;
