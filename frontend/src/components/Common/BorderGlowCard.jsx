import React, { useRef, useState } from 'react';

export default function BorderGlowCard({ 
  children, 
  className = '', 
  containerClassName = '',
  glowColor = 'rgba(139, 92, 246, 0.40)', // Purple violet glow as shown in the mockup image
  borderWidth = '1.5px',
  ...props 
}) {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ padding: borderWidth }}
      className={`relative rounded-3xl overflow-hidden bg-slate-250/20 dark:bg-slate-800/40 transition-all duration-500 hover:shadow-2xl ${containerClassName}`}
      {...props}
    >
      {/* Outer border glow layer */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 rounded-[inherit]"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(220px circle at ${coords.x}px ${coords.y}px, ${glowColor}, transparent 75%)`,
        }}
      />

      {/* Inner Content Layer */}
      <div className={`relative z-10 w-full h-full rounded-[22px] bg-slate-900 text-slate-100 flex flex-col justify-between overflow-hidden ${className}`}>
        {/* Internal micro-glow overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 rounded-[inherit] mix-blend-screen"
          style={{
            opacity: isHovered ? 0.08 : 0,
            background: `radial-gradient(280px circle at ${coords.x}px ${coords.y}px, ${glowColor}, transparent 80%)`,
          }}
        />
        
        {children}
      </div>
    </div>
  );
}
