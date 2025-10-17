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
const MarginWrapper = ({
  children,
  top = 0,       // default: no margin
  bottom = 0,    // default: no margin
  className = "",
}) => {
  return (
    <div
      className={`w-full mx-auto ${className}`}
      style={{
        marginTop: `${top}px`,
        marginBottom: `${bottom}px`,
      }}
    >
      {children}
    </div>
  );
};

export default MarginWrapper;
