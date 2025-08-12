import React from 'react';

interface PichasahurMascotProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

const PichasahurMascot: React.FC<PichasahurMascotProps> = ({ 
  size = 120, 
  className = "",
  animated = false 
}) => {
  return (
    <div className={`inline-block ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={animated ? "animate-bounce" : ""}
      >
        {/* Cuerpo principal - bloque cilíndrico como Tung Tung Sahur */}
        <rect
          x="35"
          y="25"
          width="50"
          height="70"
          rx="8"
          fill="url(#bodyGradient)"
          stroke="url(#borderGradient)"
          strokeWidth="2"
        />
        
        {/* Ojos - tallados en el bloque de madera */}
        <circle cx="48" cy="35" r="3" fill="#1e293b" />
        <circle cx="72" cy="35" r="3" fill="#1e293b" />
        <circle cx="49" cy="33" r="1" fill="white" />
        <circle cx="73" cy="33" r="1" fill="white" />
        
        {/* Nariz - tallada en el bloque */}
        <ellipse cx="60" cy="42" rx="1.5" ry="1" fill="#1e293b" />
        
        {/* Sonrisa - tallada en el bloque de madera */}
        <path
          d="M 50 45 Q 60 50 70 45"
          stroke="#1e293b"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Brazos - delgados y rectos como Tung Tung Sahur */}
        <rect x="25" y="50" width="8" height="25" rx="4" fill="url(#limbGradient)" />
        <rect x="87" y="50" width="8" height="25" rx="4" fill="url(#limbGradient)" />
        
        {/* Piernas - delgadas y rectas como Tung Tung Sahur */}
        <rect x="45" y="95" width="6" height="20" rx="3" fill="url(#limbGradient)" />
        <rect x="69" y="95" width="6" height="20" rx="3" fill="url(#limbGradient)" />
        
        {/* Pies - simples y redondeados */}
        <ellipse cx="48" cy="115" rx="4" ry="2" fill="url(#limbGradient)" />
        <ellipse cx="72" cy="115" rx="4" ry="2" fill="url(#limbGradient)" />
        
        {/* Bate de béisbol como Tung Tung Sahur */}
        <rect x="85" y="60" width="4" height="35" rx="2" fill="url(#batGradient)" />
        <rect x="83" y="55" width="8" height="8" rx="4" fill="url(#batGradient)" />
        
        {/* Detalles de madera - vetas */}
        <path d="M 40 30 Q 60 35 80 30" stroke="rgba(139,69,19,0.3)" strokeWidth="1" fill="none" />
        <path d="M 40 50 Q 60 55 80 50" stroke="rgba(139,69,19,0.3)" strokeWidth="1" fill="none" />
        <path d="M 40 70 Q 60 75 80 70" stroke="rgba(139,69,19,0.3)" strokeWidth="1" fill="none" />
        
        {/* Gradientes */}
        <defs>
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D2691E" />
            <stop offset="100%" stopColor="#CD853F" />
          </linearGradient>
          
          <linearGradient id="earGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A0522D" />
            <stop offset="100%" stopColor="#8B4513" />
          </linearGradient>
          
          <linearGradient id="limbGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B4513" />
            <stop offset="100%" stopColor="#A0522D" />
          </linearGradient>
          
          <linearGradient id="batGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B4513" />
            <stop offset="100%" stopColor="#A0522D" />
          </linearGradient>
          
          <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default PichasahurMascot;
