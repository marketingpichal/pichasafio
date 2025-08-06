import React, { useEffect, useRef, useState } from 'react';

interface AdComponentProps {
  adZoneId: string;
  width: number;
  height: number;
  className?: string;
  position?: 'header' | 'sidebar-left' | 'sidebar-right' | 'content';
}

const AdComponent: React.FC<AdComponentProps> = ({ 
  adZoneId, 
  width, 
  height, 
  className = "",
  position = "content"
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const [adFailed, setAdFailed] = useState(false);
  const isProduction = window.location.hostname !== 'localhost' && 
                      window.location.hostname !== '127.0.0.1' && 
                      !window.location.hostname.includes('vercel.app') &&
                      !window.location.hostname.includes('netlify.app');

  useEffect(() => {
    if (!isProduction || !adRef.current) return;

    // Cargar el script de JuicyAds si no está cargado
    if (!window.adsbyjuicy) {
      const script = document.createElement('script');
      script.src = 'https://poweredby.jads.co/js/jads.js';
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.onerror = () => {
        console.log('JuicyAds script failed to load - likely blocked by ad blocker');
        setAdFailed(true);
      };
      document.head.appendChild(script);
    }

    // Crear el elemento de anuncio
    const adElement = document.createElement('ins');
    adElement.id = adZoneId;
    adElement.setAttribute('data-width', width.toString());
    adElement.setAttribute('data-height', height.toString());

    // Limpiar el contenedor y agregar el anuncio
    if (adRef.current) {
      adRef.current.innerHTML = '';
      adRef.current.appendChild(adElement);
    }

    // Cargar el anuncio con manejo de errores
    const loadAd = () => {
      try {
        if (window.adsbyjuicy) {
          (window.adsbyjuicy = window.adsbyjuicy || []).push({ adzone: adZoneId });
        } else {
          setTimeout(loadAd, 100);
        }
      } catch (error) {
        console.log('Ad failed to load:', error);
        setAdFailed(true);
      }
    };

    loadAd();
  }, [adZoneId, width, height, isProduction]);

  // En desarrollo o cuando los anuncios fallan, mostrar placeholder
  if (!isProduction || adFailed) {
    return (
      <div 
        ref={adRef}
        className={`ad-placeholder ${className}`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '12px',
          fontWeight: 'bold',
          textAlign: 'center',
          margin: '10px auto',
          border: '2px dashed rgba(255,255,255,0.3)'
        }}
      >
        📢 Anuncio {position}<br/>
        ({width}x{height})<br/>
        {adFailed ? 'Bloqueado por ad blocker' : 'Solo visible en producción'}
      </div>
    );
  }

  return (
    <div 
      ref={adRef}
      className={`ad-container ${className}`}
      style={{
        textAlign: 'center',
        margin: '10px 0',
        minHeight: `${height}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    />
  );
};

export default AdComponent; 