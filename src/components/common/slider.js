"use client";
import React from "react";

const BudgetSlider = ({ min = 1000, max = 5000, step = 100, value, onChange }) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full max-w-[820px] px-2 py-8 relative">
      {/* Value above the ball */}
      <div
        className="absolute text-white font-barlow font-medium text-sm transition-all duration-150"
        style={{
          left: `calc(${percentage}% - 24px)`,
          top: "0",
        }}
      >
        ${value.toLocaleString()}
      </div>

      {/* Slider Container */}
      <div className="relative mt-8">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          className="w-full h-[6px] rounded-full appearance-none cursor-pointer bg-transparent"
          style={{
            background: `linear-gradient(to right, #06D6A0 ${percentage}%, #1E293B ${percentage}%)`,
          }}
        />

        <style jsx>{`
          input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #06d6a0;
            border: 2px solid white;
            box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
            margin-top: -7px; /* centers thumb */
            transition: transform 0.2s ease;
          }
          input[type="range"]::-webkit-slider-thumb:hover {
            transform: scale(1.1);
          }
          input[type="range"]::-webkit-slider-runnable-track {
            height: 6px;
            border-radius: 4px;
          }
          input[type="range"]:focus {
            outline: none;
          }
        `}</style>
      </div>

      {/* Range Labels */}
      <div className="flex justify-between  text-white font-barlow font-normal text-sm">
        <span>${min}</span>
        <span>${max}</span>
      </div>
    </div>
  );
};

export default BudgetSlider;
