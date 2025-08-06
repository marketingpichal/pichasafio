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
  const isProduction = window.location.hostname === 'pichasafio.com' || 
                      window.location.hostname === 'www.pichasafio.com';
  
  // Debug para verificar el entorno
  useEffect(() => {
    console.log('AdComponent Debug:', {
      hostname: window.location.hostname,
      isProduction,
      adZoneId,
      width,
      height
    });
  }, [isProduction, adZoneId, width, height]);

  useEffect(() => {
    if (!isProduction || !adRef.current) return;

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

    // Cargar el anuncio con manejo de errores y reintentos
    const loadAd = (retryCount = 0) => {
      try {
        if (window.adsbyjuicy) {
          console.log(`Loading ad for zone: ${adZoneId}`);
          (window.adsbyjuicy = window.adsbyjuicy || []).push({ adzone: adZoneId });
        } else {
          if (retryCount < 10) {
            console.log(`Retrying ad load for zone: ${adZoneId}, attempt: ${retryCount + 1}`);
            setTimeout(() => loadAd(retryCount + 1), 500);
          } else {
            console.log(`Failed to load ad after ${retryCount} attempts`);
            setAdFailed(true);
          }
        }
      } catch (error) {
        console.log('Ad failed to load:', error);
        setAdFailed(true);
      }
    };

    // Método alternativo: crear el script directamente
    const createAdScript = () => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.textContent = `(adsbyjuicy = window.adsbyjuicy || []).push({ adzone: ${adZoneId} });`;
      
      if (adRef.current) {
        adRef.current.appendChild(script);
      }
    };

    // Esperar un poco antes de cargar el anuncio para asegurar que los scripts estén listos
    setTimeout(() => {
      loadAd();
      // También intentar el método alternativo
      setTimeout(createAdScript, 2000);
    }, 1000);
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