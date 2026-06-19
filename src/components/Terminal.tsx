import React from 'react';

interface TerminalProps {
  children: React.ReactNode;
  className?: string;
}

export default function Terminal({ children, className = '' }: TerminalProps) {
  return (
    <div className={`relative w-full h-full bg-dos-bg overflow-hidden ${className}`}>
      <div className="absolute inset-0 screen-flicker">
        {children}
      </div>

      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background:
            'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none z-21"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      <div
        className="absolute left-0 right-0 h-1 bg-green-500 opacity-20 pointer-events-none z-30"
        style={{
          animation: 'scanline 6s linear infinite',
        }}
      />
    </div>
  );
}
