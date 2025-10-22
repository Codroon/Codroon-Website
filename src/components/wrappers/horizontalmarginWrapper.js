import React from "react";

/**
 * MarginWrapper
 * A generic reusable wrapper for applying consistent vertical margins.
 *
 * Example:
 * <MarginWrapper top={100} bottom={50}>
 *    <YourComponent />
 * </MarginWrapper>
 */
const HorizontalMarginWrapper = ({
  children,
  left = 0,       // default: no margin
  right = 0,    // default: no margin
  className = "",
}) => {
  return (
    <div
      className={`w-full mx-auto ${className}`}
      style={{
        paddingRight: `${right}px`,
        paddingLeft: `${left}px`,
      }}
    >
      {children}
    </div>
  );
};

export default HorizontalMarginWrapper;
