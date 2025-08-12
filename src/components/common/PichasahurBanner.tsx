import React from 'react';
import PichasahurMascot from './PichasahurMascot';

interface PichasahurBannerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  animated?: boolean;
  showSubtitle?: boolean;
}

const PichasahurBanner: React.FC<PichasahurBannerProps> = ({ 
  size = 'medium', 
  className = "",
  animated = true,
  showSubtitle = true
}) => {
  const sizeConfig = {
    small: { mascotSize: 80, textSize: 'text-2xl', containerClass: 'gap-3' },
    medium: { mascotSize: 120, textSize: 'text-3xl', containerClass: 'gap-4' },
    large: { mascotSize: 160, textSize: 'text-4xl', containerClass: 'gap-6' }
  };

  const config = sizeConfig[size];

  return (
    <div className={`inline-flex items-center justify-center ${config.containerClass} ${className}`}>
      {/* Mascota Pichasahur */}
      <div className="relative">
        <PichasahurMascot size={config.mascotSize} animated={animated} />
        
        {/* Efecto de brillo alrededor de la mascota */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-xl scale-110"></div>
      </div>

      {/* Texto del nombre */}
      <div className="flex flex-col items-start">
        <h2 className={`${config.textSize} font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 leading-tight`}>
          Pichasahur
        </h2>
        
        {showSubtitle && (
          <p className="text-sm text-gray-300 font-medium mt-1">
            Tu compañero de viaje 🐾
          </p>
        )}
      </div>

      {/* Elementos decorativos */}
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400/30 rounded-full blur-sm"></div>
      <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-purple-400/30 rounded-full blur-sm"></div>
    </div>
  );
};

export default PichasahurBanner;
