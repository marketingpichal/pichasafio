import { useEffect, useRef } from 'react';

interface JuicyAdProps {
  adZoneId: string;
}

export default function JuicyAd({ adZoneId }: JuicyAdProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Carga el script principal de JuicyAds
    const script = document.createElement('script');
    script.src = 'https://js.juicyads.com/juicyads.js'; // Script base
    script.async = true;
    document.body.appendChild(script);

    // Asegura que el <ins> esté listo
    if (adRef.current) {
      adRef.current.setAttribute('data-jua-id', adZoneId);
    }

    // Limpieza al desmontar
    return () => {
      document.body.removeChild(script);
    };
  }, [adZoneId]);

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
        Pichasafio Patrocinado
      </h3>
      <div ref={adRef} className="min-h-[250px] w-full flex justify-center">
        <ins data-jua-id={adZoneId}></ins>
      </div>
    </div>
  );
}