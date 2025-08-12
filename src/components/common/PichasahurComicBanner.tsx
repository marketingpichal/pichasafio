import React from 'react';
import PichasahurMascot from './PichasahurMascot';

interface PichasahurComicBannerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  animated?: boolean;
  variant?: 'default' | 'speech' | 'action';
}

const PichasahurComicBanner: React.FC<PichasahurComicBannerProps> = ({ 
  size = 'medium', 
  className = "",
  animated = true,
  variant = 'default'
}) => {
  const sizeConfig = {
    small: { mascotSize: 80, textSize: 'text-xl', padding: 'p-3' },
    medium: { mascotSize: 100, textSize: 'text-2xl', padding: 'p-4' },
    large: { mascotSize: 140, textSize: 'text-3xl', padding: 'p-6' }
  };

  const config = sizeConfig[size];

  const getVariantStyles = () => {
    switch (variant) {
      case 'speech':
        return {
          container: 'bg-white/10 backdrop-blur-sm border-2 border-blue-400/30 rounded-2xl shadow-lg',
          text: 'text-blue-100',
          bubble: 'relative after:content-[""] after:absolute after:bottom-0 after:left-8 after:w-0 after:h-0 after:border-l-[15px] after:border-l-transparent after:border-r-[15px] after:border-r-transparent after:border-t-[15px] after:border-t-blue-400/30'
        };
      case 'action':
        return {
          container: 'bg-gradient-to-br from-orange-500/20 to-red-500/20 border-2 border-orange-400/40 rounded-2xl shadow-lg',
          text: 'text-orange-100',
          bubble: ''
        };
      default:
        return {
          container: 'bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-2 border-blue-400/30 rounded-2xl shadow-lg',
          text: 'text-blue-100',
          bubble: ''
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`relative ${styles.container} ${styles.bubble} ${config.padding} ${className}`}>
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-xl"></div>
      
      {/* Contenido principal */}
      <div className="relative z-10 flex items-center gap-4">
        {/* Mascota Pichasahur */}
        <div className="relative">
          <PichasahurMascot size={config.mascotSize} animated={animated} />
          
          {/* Efecto de brillo */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/30 to-orange-400/30 blur-lg scale-125"></div>
        </div>

        {/* Texto del nombre */}
        <div className="flex flex-col">
          <h2 className={`${config.textSize} font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 leading-tight tracking-wide`}>
            PICHASAHUR
          </h2>
          
          <p className={`text-sm ${styles.text} font-semibold mt-1`}>
            ¡Tu compañero de aventuras! ⚡
          </p>
        </div>
      </div>

      {/* Elementos decorativos de comic */}
      <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-400/60 rounded-full"></div>
      <div className="absolute bottom-2 left-2 w-2 h-2 bg-orange-400/60 rounded-full"></div>
      
      {/* Líneas de acción si es variante action */}
      {variant === 'action' && (
        <>
          <div className="absolute -top-1 -right-1 w-8 h-1 bg-yellow-400/80 rounded-full transform rotate-12"></div>
          <div className="absolute -bottom-1 -left-1 w-6 h-1 bg-orange-400/80 rounded-full transform -rotate-12"></div>
        </>
      )}

      {/* Estrellas decorativas */}
      <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-yellow-400/40 transform rotate-45"></div>
      <div className="absolute bottom-1/4 left-1/4 w-1.5 h-1.5 bg-orange-400/40 transform rotate-45"></div>
    </div>
  );
};

export default PichasahurComicBanner;
