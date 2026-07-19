import React from 'react';
import './StarBorder.css';

const StarBorder = ({
  as: Component = 'div',
  className = '',
  color = 'var(--mp-primary)', // Default to primary Midnight Purple glow
  speed = '4s',
  thickness = 2,
  children,
  ...rest
}) => {
  return (
    <Component
      className={`star-border-container ${className}`}
      style={{
        padding: `${thickness}px`,
        ...rest.style
      }}
      {...rest}
    >
      <div
        className="border-gradient-bottom"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 20%)`,
          animationDuration: speed
        }}
      ></div>
      <div
        className="border-gradient-top"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 20%)`,
          animationDuration: speed
        }}
      ></div>
      <div className="inner-content-star">{children}</div>
    </Component>
  );
};

export default StarBorder;
